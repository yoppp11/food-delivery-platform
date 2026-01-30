import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

interface OrderUpdate {
  status?: string;
  driverId?: string;
  driver?: Record<string, unknown>;
  message?: string;
}

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: "/orders",
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  handleConnection(client: AuthenticatedSocket) {
    const userId = String(
      client.handshake.auth?.userId || client.handshake.query?.userId || "",
    );
    const role = String(
      client.handshake.auth?.role || client.handshake.query?.role || "",
    );

    if (!userId) {
      this.logger.warn(`Client ${client.id} connected without userId`);
      client.disconnect();
      return;
    }

    client.userId = userId;
    client.role = role;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(client.id);

    this.logger.info(
      `User ${userId} connected to orders with socket ${client.id}`,
    );
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
      this.logger.info(
        `User ${client.userId} disconnected from orders socket ${client.id}`,
      );
    }
  }

  @SubscribeMessage("order:subscribe")
  handleSubscribeToOrder(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    if (!client.userId) return;

    void client.join(`order:${data.orderId}`);
    this.logger.info(
      `User ${client.userId} subscribed to order ${data.orderId}`,
    );
    client.emit("order:subscribed", { orderId: data.orderId });
  }

  @SubscribeMessage("order:unsubscribe")
  handleUnsubscribeFromOrder(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: string },
  ) {
    void client.leave(`order:${data.orderId}`);
    this.logger.info(
      `User ${client.userId} unsubscribed from order ${data.orderId}`,
    );
  }

  notifyOrderUpdate(orderId: string, update: OrderUpdate) {
    this.server.to(`order:${orderId}`).emit("order:updated", {
      orderId,
      ...update,
    });
    this.logger.info(`Emitted order update for order ${orderId}`);
  }

  notifyDriverAssigned(orderId: string, driver: unknown) {
    this.server.to(`order:${orderId}`).emit("order:driver-assigned", {
      orderId,
      driver,
    });
    this.logger.info(`Emitted driver assigned for order ${orderId}`);
  }

  notifyUserOrderUpdate(userId: string, orderId: string, update: OrderUpdate) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit("order:updated", {
          orderId,
          ...update,
        });
      });
    }
  }

  notifyDriverNewOrder(driverId: string, order: unknown) {
    const sockets = this.connectedUsers.get(driverId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit("order:new-assignment", order);
      });
    }
  }
}

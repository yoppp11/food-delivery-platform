import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ChatService } from "./chat.service.new";
import {
  TicketQueryDto,
  UpdateTicketDto,
  AssignTicketDto,
} from "./dto/chat.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { User } from "@prisma/client";

class AdminGuard {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === "ADMIN";
  }
}

@ApiTags("admin-support")
@ApiBearerAuth()
@Controller("admin/support")
export class ChatAdminController {
  constructor(private readonly chatService: ChatService) {}

  @Get("tickets")
  @ApiOperation({ summary: "List all support tickets (Admin only)" })
  @ApiResponse({ status: 200, description: "List of support tickets" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async getTickets(
    @Query() query: TicketQueryDto,
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.getSupportTickets(query);
  }

  @Get("tickets/:id")
  @ApiOperation({ summary: "Get ticket details (Admin only)" })
  @ApiResponse({ status: 200, description: "Ticket details with chat room" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  async getTicketById(
    @Param("id") ticketId: string,
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    
    const tickets = await this.chatService.getSupportTickets({
      page: 1,
      limit: 1,
    });
    
    const ticket = tickets.data.find((t) => t.id === ticketId);
    
    if (!ticket) {
      throw new HttpException("Ticket not found", HttpStatus.NOT_FOUND);
    }

    return ticket;
  }

  @Post("tickets/:id/assign")
  @ApiOperation({ summary: "Assign ticket to an admin" })
  @ApiResponse({ status: 200, description: "Ticket assigned successfully" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  async assignTicket(
    @Param("id") ticketId: string,
    @Body() body: AssignTicketDto,
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.assignTicket(ticketId, body.adminId, request.user.id);
  }

  @Post("tickets/:id/assign-self")
  @ApiOperation({ summary: "Assign ticket to yourself" })
  @ApiResponse({ status: 200, description: "Ticket assigned to you" })
  async assignToSelf(
    @Param("id") ticketId: string,
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.assignTicket(ticketId, request.user.id, request.user.id);
  }

  @Patch("tickets/:id")
  @ApiOperation({ summary: "Update ticket status/priority" })
  @ApiResponse({ status: 200, description: "Ticket updated" })
  async updateTicket(
    @Param("id") ticketId: string,
    @Body() body: UpdateTicketDto,
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.updateTicket(ticketId, request.user.id, body);
  }

  @Post("tickets/:id/resolve")
  @ApiOperation({ summary: "Resolve a support ticket" })
  @ApiResponse({ status: 200, description: "Ticket resolved" })
  async resolveTicket(
    @Param("id") ticketId: string,
    @Body() body: { resolution: string },
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.updateTicket(ticketId, request.user.id, {
      status: "RESOLVED",
      resolution: body.resolution,
    });
  }

  @Post("tickets/:id/close")
  @ApiOperation({ summary: "Close a support ticket" })
  @ApiResponse({ status: 200, description: "Ticket closed" })
  async closeTicket(
    @Param("id") ticketId: string,
    @Body() body: { resolution?: string },
    @Req() request: { user: User },
  ) {
    this.verifyAdminAccess(request.user);
    return this.chatService.updateTicket(ticketId, request.user.id, {
      status: "CLOSED",
      resolution: body.resolution,
    });
  }

  @Get("stats")
  @ApiOperation({ summary: "Get support ticket statistics" })
  @ApiResponse({ status: 200, description: "Ticket statistics" })
  async getStats(@Req() request: { user: User }) {
    this.verifyAdminAccess(request.user);
    
    const [open, inProgress, resolved, closed] = await Promise.all([
      this.chatService.getSupportTickets({ status: "OPEN", limit: 1 }),
      this.chatService.getSupportTickets({ status: "IN_PROGRESS", limit: 1 }),
      this.chatService.getSupportTickets({ status: "RESOLVED", limit: 1 }),
      this.chatService.getSupportTickets({ status: "CLOSED", limit: 1 }),
    ]);

    return {
      open: open.meta.total,
      inProgress: inProgress.meta.total,
      resolved: resolved.meta.total,
      closed: closed.meta.total,
      total: open.meta.total + inProgress.meta.total + resolved.meta.total + closed.meta.total,
    };
  }

  private verifyAdminAccess(user: User): void {
    if (!user || user.role !== "ADMIN") {
      throw new HttpException("Admin access required", HttpStatus.FORBIDDEN);
    }
  }
}

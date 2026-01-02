import "dotenv/config";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaService } from "../src/common/prisma.service";
import { v4 as uuid } from "uuid";

const prisma = new PrismaService();

const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

// Helper function to sign up a user via Better Auth API
async function signUpUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to sign up ${email}: ${error}`);
  }

  const data = await response.json();
  return data.user;
}

async function main() {
  console.log("🌱 Starting seed...");
  console.log(`📡 Using Better Auth API at: ${BASE_URL}`);

  // Clean up existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning up existing data...");
  await prisma.paymentCallback.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderPromotion.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.driverLocation.deleteMany();
  await prisma.driverReview.deleteMany();
  await prisma.merchantReview.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuVariant.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();
  await prisma.merchantOperationalHour.deleteMany();
  await prisma.merchantMenuCategory.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userAddres.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.image.deleteMany();
  await prisma.user.deleteMany();

  // Create Images
  console.log("📸 Creating images...");
  const images = await Promise.all([
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750513695/c7pxafle3zhmhmzpswmb.jpg",
      },
    }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750503080/o6oy3773pbava52m2ygp.jpg",
      },
    }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750502929/m7w1sqiayr0sqwmmhpyh.jpg",
      },
    }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750502672/ukdeffqc5pkbgbebefvr.jpg",
      },
    }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750445576/m4nrl2spmzrp4bc3in8s.jpg",
      },
    }),
    prisma.image.create({
      data: {
        id: uuid(),
        imageUrl:
          "https://res.cloudinary.com/dtjbr2rgi/image/upload/v1750445798/fgskfbi1w8q7qtlrrnrq.jpg",
      },
    }),
  ]);

  // Create Users via Better Auth API
  console.log("👥 Creating users via Better Auth...");

  const customerUserData = await signUpUser(
    "customer@example.com",
    "password123"
  );
  console.log(`   ✓ Customer created: ${customerUserData.id}`);

  const merchantUserData = await signUpUser(
    "merchant@example.com",
    "password123"
  );
  console.log(`   ✓ Merchant created: ${merchantUserData.id}`);

  const merchantUserData2 = await signUpUser(
    "merchant2@example.com",
    "password123"
  );
  console.log(`   ✓ Merchant 2 created: ${merchantUserData2.id}`);

  const driverUserData = await signUpUser("driver@example.com", "password123");
  console.log(`   ✓ Driver created: ${driverUserData.id}`);

  const adminUserData = await signUpUser("admin@example.com", "password123");
  console.log(`   ✓ Admin created: ${adminUserData.id}`);

  // Update user roles
  console.log("🔐 Updating user roles...");
  const customerUser = await prisma.user.update({
    where: { id: customerUserData.id },
    data: { role: "CUSTOMER", phoneNumber: "+6281234567890" },
  });

  const merchantUser = await prisma.user.update({
    where: { id: merchantUserData.id },
    data: { role: "MERCHANT", phoneNumber: "+6281234567891" },
  });

  const merchantUser2 = await prisma.user.update({
    where: { id: merchantUserData2.id },
    data: { role: "MERCHANT", phoneNumber: "+6281234567894" },
  });

  const driverUser = await prisma.user.update({
    where: { id: driverUserData.id },
    data: { role: "DRIVER", phoneNumber: "+6281234567892" },
  });

  const adminUser = await prisma.user.update({
    where: { id: adminUserData.id },
    data: { role: "ADMIN", phoneNumber: "+6281234567893" },
  });

  // Create User Profiles
  console.log("👤 Creating user profiles...");
  await Promise.all([
    prisma.userProfile.create({
      data: {
        userId: customerUser.id,
        fullName: "John Customer",
        imageId: images[0].id,
        birthDate: new Date("1995-05-15"),
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: merchantUser.id,
        fullName: "Jane Merchant",
        imageId: images[1].id,
        birthDate: new Date("1988-08-20"),
      },
    }),
    prisma.userProfile.create({
      data: {
        userId: merchantUser2.id,
        fullName: "Bob Sushi Owner",
        imageId: images[1].id,
        birthDate: new Date("1990-03-10"),
      },
    }),
  ]);

  // Create User Addresses
  console.log("📍 Creating user addresses...");
  await Promise.all([
    prisma.userAddres.create({
      data: {
        userId: customerUser.id,
        label: "Home",
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        isDefault: true,
      },
    }),
    prisma.userAddres.create({
      data: {
        userId: customerUser.id,
        label: "Office",
        latitude: -6.1751,
        longitude: 106.865,
        address: "Jl. Thamrin No. 456, Jakarta Pusat",
        isDefault: false,
      },
    }),
  ]);

  // Create Merchants
  console.log("🏪 Creating merchants...");
  const merchant1 = await prisma.merchant.create({
    data: {
      id: uuid(),
      ownerId: merchantUser.id,
      name: "Warung Nasi Padang Sederhana",
      description: "Authentic Padang cuisine with rich flavors",
      latitude: -6.2,
      longitude: 106.84,
      isOpen: true,
      rating: 4.5,
    },
  });

  const merchant2 = await prisma.merchant.create({
    data: {
      id: uuid(),
      ownerId: merchantUser2.id,
      name: "Sushi Express",
      description: "Fresh Japanese sushi and sashimi",
      latitude: -6.21,
      longitude: 106.85,
      isOpen: true,
      rating: 4.7,
    },
  });

  // Create Merchant Categories
  console.log("🏷️ Creating merchant categories...");
  await Promise.all([
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Drinks",
        merchantId: merchant1.id,
      },
    }),
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Desserts",
        merchantId: merchant1.id,
      },
    }),
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Halal",
        merchantId: merchant1.id,
      },
    }),
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Japanese",
        merchantId: merchant2.id,
      },
    }),
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Sushi",
        merchantId: merchant2.id,
      },
    }),
    prisma.merchantMenuCategory.create({
      data: {
        id: uuid(),
        name: "Seafood",
        merchantId: merchant2.id,
      },
    }),
  ]);

  // Create Merchant Operational Hours
  console.log("🕐 Creating operational hours...");
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  for (const merchant of [merchant1, merchant2]) {
    for (const day of daysOfWeek) {
      await prisma.merchantOperationalHour.create({
        data: {
          merchantId: merchant.id,
          dayOfWeek: day,
          openTime: day === 0 ? "10:00" : "08:00", // Sunday opens later
          closeTime: "22:00",
        },
      });
    }
  }

  // Create Categories
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Rice Dishes",
        description: "Various rice-based meals",
      },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Noodles",
        description: "Noodle dishes",
      },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Sushi",
        description: "Fresh sushi rolls and nigiri",
      },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Beverages",
        description: "Refreshing drinks",
      },
    }),
  ]);

  // Create Menus
  console.log("🍽️ Creating menus...");
  const menu1 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: categories[0].id,
      name: "Nasi Rendang",
      description: "Steamed rice with spicy beef rendang",
      price: 35000,
      isAvailable: true,
      imageId: images[2].id,
      createdAt: new Date(),
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: categories[0].id,
      name: "Nasi Ayam Pop",
      description: "Steamed rice with Padang-style fried chicken",
      price: 30000,
      isAvailable: true,
      imageId: images[3].id,
      createdAt: new Date(),
    },
  });

  const menu3 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: categories[2].id,
      name: "Salmon Sashimi",
      description: "Fresh Norwegian salmon slices",
      price: 65000,
      isAvailable: true,
      imageId: images[4].id,
      createdAt: new Date(),
    },
  });

  const menu4 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: categories[2].id,
      name: "Dragon Roll",
      description: "Eel and cucumber roll topped with avocado",
      price: 85000,
      isAvailable: true,
      imageId: images[5].id,
      createdAt: new Date(),
    },
  });

  // Create Menu Variants
  console.log("🔄 Creating menu variants...");
  const variant1 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu1.id,
      name: "Regular",
      price: 35000,
    },
  });

  const variant2 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu1.id,
      name: "Large",
      price: 45000,
    },
  });

  const variant3 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu3.id,
      name: "5 pcs",
      price: 65000,
    },
  });

  const variant4 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu3.id,
      name: "10 pcs",
      price: 120000,
    },
  });

  // Create Driver
  console.log("🚗 Creating drivers...");
  const driver = await prisma.driver.create({
    data: {
      id: uuid(),
      userId: driverUser.id,
      plateNumber: "B 1234 XYZ",
      isAvailable: true,
    },
  });

  // Create Driver Location
  console.log("📍 Creating driver locations...");
  await prisma.driverLocation.create({
    data: {
      driverId: driver.id,
      latitude: -6.205,
      longitude: 106.845,
      recordedAt: new Date(),
    },
  });

  // Create Promotions
  console.log("🎉 Creating promotions...");
  const promotion = await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "NEWUSER50",
      discountType: "PERCENT",
      discountValue: 50,
      maxDiscount: 30000,
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "FLAT10K",
      discountType: "FLAT",
      discountValue: 10000,
      maxDiscount: 10000,
      expiredAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    },
  });

  // Create Orders
  console.log("📦 Creating orders...");
  const order1 = await prisma.order.create({
    data: {
      id: uuid(),
      userId: customerUser.id,
      merchantId: merchant1.id,
      driverId: driver.id,
      status: "COMPLETED",
      totalPrice: 80000,
      deliveryFee: 10000,
      paymentStatus: "SUCCESS",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: uuid(),
      userId: customerUser.id,
      merchantId: merchant2.id,
      driverId: driver.id,
      status: "PREPARING",
      totalPrice: 150000,
      deliveryFee: 15000,
      paymentStatus: "SUCCESS",
    },
  });

  // Create Order Items
  console.log("🛒 Creating order items...");
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        menuId: menu1.id,
        variantId: variant1.id,
        quantity: 2,
        price: 70000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        menuId: menu3.id,
        variantId: variant4.id,
        quantity: 1,
        price: 120000,
      },
    }),
  ]);

  // Create Order Status History
  console.log("📜 Creating order status histories...");
  await Promise.all([
    prisma.orderStatusHistory.create({
      data: {
        orderId: order1.id,
        status: "CREATED",
        changedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order1.id,
        status: "PAID",
        changedAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order1.id,
        status: "COMPLETED",
        changedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        changedBy: driverUser.id,
      },
    }),
  ]);

  // Create Payments
  console.log("💳 Creating payments...");
  const payment = await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order1.id,
      provider: "MIDTRANS",
      paymentType: "gopay",
      transactionId: "TXN-001-" + Date.now(),
      amount: 90000,
      status: "SUCCESS",
      createdAt: new Date(),
    },
  });

  await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order2.id,
      provider: "MIDTRANS",
      paymentType: "bank_transfer",
      transactionId: "TXN-002-" + Date.now(),
      amount: 165000,
      status: "SUCCESS",
      createdAt: new Date(),
    },
  });

  // Create Payment Callback
  console.log("📞 Creating payment callbacks...");
  await prisma.paymentCallback.create({
    data: {
      paymentId: payment.id,
      payload: {
        status_code: "200",
        transaction_status: "settlement",
        gross_amount: "90000",
      },
      receivedAt: new Date(),
    },
  });

  // Create Delivery
  console.log("🚚 Creating deliveries...");
  await prisma.delivery.create({
    data: {
      orderId: order1.id,
      driverId: driver.id,
      pickedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      distanceKm: 3.5,
    },
  });

  // Create Order Promotion
  console.log("🏷️ Creating order promotions...");
  await prisma.orderPromotion.create({
    data: {
      orderId: order1.id,
      promotionId: promotion.id,
      discountAmount: 30000,
    },
  });

  // Create Reviews
  console.log("⭐ Creating reviews...");
  await prisma.merchantReview.create({
    data: {
      userId: customerUser.id,
      merchantId: merchant1.id,
      rating: 5,
      comment: "Delicious food! The rendang was amazing.",
      createdAt: new Date(),
    },
  });

  await prisma.driverReview.create({
    data: {
      userId: customerUser.id,
      driverId: driver.id,
      rating: 5,
      comment: "Very fast delivery, friendly driver!",
    },
  });

  // Create Notifications
  console.log("🔔 Creating notifications...");
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: customerUser.id,
        type: "ORDER",
        message: "Your order #order-1 has been delivered!",
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customerUser.id,
        type: "PROMO",
        message:
          "New promotion! Use code NEWUSER50 for 50% off your next order!",
        isRead: false,
        createdAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: merchantUser.id,
        type: "ORDER",
        message: "New order received! Order #order-2",
        isRead: false,
        createdAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - 5 Users (customer, 2 merchants, driver, admin)");
  console.log("   - 5 Accounts with password: password123");
  console.log("   - 3 User Profiles");
  console.log("   - 2 User Addresses");
  console.log("   - 2 Merchants with operational hours");
  console.log("   - 6 Merchant Categories");
  console.log("   - 4 Categories");
  console.log("   - 4 Menus with variants");
  console.log("   - 1 Driver with location");
  console.log("   - 2 Promotions");
  console.log("   - 2 Orders with items and status history");
  console.log("   - 2 Payments");
  console.log("   - 1 Delivery");
  console.log("   - 2 Reviews (merchant and driver)");
  console.log("   - 3 Notifications");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

/* eslint-disable prettier/prettier */
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
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
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

  // Create Images (expanded for more menu items)
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
    // Additional images for more menu items
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
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
    prisma.image.create({ data: { id: uuid(), imageUrl: "" } }),
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
    "password123",
  );
  console.log(`   ✓ Customer created: ${customerUserData.id}`);

  const merchantUserData = await signUpUser(
    "merchant@example.com",
    "password123",
  );
  console.log(`   ✓ Merchant created: ${merchantUserData.id}`);

  const merchantUserData2 = await signUpUser(
    "merchant2@example.com",
    "password123",
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

  // Create Merchant Categories (at least 4 per merchant)
  console.log("🏷️ Creating merchant categories...");
  const merchantCategory1_1 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Rice Dishes", merchantId: merchant1.id },
  });
  const merchantCategory1_2 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Drinks", merchantId: merchant1.id },
  });
  const merchantCategory1_3 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Sides", merchantId: merchant1.id },
  });
  const merchantCategory1_4 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Desserts", merchantId: merchant1.id },
  });

  const merchantCategory2_1 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Sushi Rolls", merchantId: merchant2.id },
  });
  const merchantCategory2_2 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Sashimi", merchantId: merchant2.id },
  });
  const merchantCategory2_3 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Ramen", merchantId: merchant2.id },
  });
  const merchantCategory2_4 = await prisma.merchantMenuCategory.create({
    data: { id: uuid(), name: "Beverages", merchantId: merchant2.id },
  });

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

  // Create Categories (global categories - at least 4)
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
      data: { id: uuid(), name: "Noodles", description: "Noodle dishes" },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Sushi",
        description: "Fresh sushi rolls and nigiri",
      },
    }),
    prisma.category.create({
      data: { id: uuid(), name: "Beverages", description: "Refreshing drinks" },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Desserts",
        description: "Sweet treats and pastries",
      },
    }),
    prisma.category.create({
      data: {
        id: uuid(),
        name: "Appetizers",
        description: "Starters and sides",
      },
    }),
  ]);

  // Create Menus (at least 4 per merchant, with proper category relationships)
  console.log("🍽️ Creating menus...");

  // ===== Merchant 1 (Padang Restaurant) Menus =====
  // Rice Dishes (4 items)
  const menu1_1 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_1.id,
      name: "Nasi Rendang",
      description: "Steamed rice with spicy beef rendang",
      price: 35000,
      isAvailable: true,
      imageId: images[2].id,
    },
  });

  const menu1_2 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_1.id,
      name: "Nasi Ayam Pop",
      description: "Steamed rice with Padang-style fried chicken",
      price: 30000,
      isAvailable: true,
      imageId: images[3].id,
    },
  });

  const menu1_3 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_1.id,
      name: "Nasi Gulai Ikan",
      description: "Steamed rice with fish curry",
      price: 32000,
      isAvailable: true,
      imageId: images[8].id,
    },
  });

  const menu1_4 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_1.id,
      name: "Nasi Dendeng Balado",
      description: "Steamed rice with crispy beef and chili",
      price: 38000,
      isAvailable: true,
      imageId: images[9].id,
    },
  });

  // Drinks (4 items)
  const menu1_5 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_2.id,
      name: "Es Teh Manis",
      description: "Sweet iced tea",
      price: 8000,
      isAvailable: true,
      imageId: images[10].id,
    },
  });

  const menu1_6 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_2.id,
      name: "Es Jeruk",
      description: "Fresh orange juice with ice",
      price: 12000,
      isAvailable: true,
      imageId: images[11].id,
    },
  });

  const menu1_7 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_2.id,
      name: "Teh Tarik",
      description: "Malaysian pulled tea",
      price: 15000,
      isAvailable: true,
      imageId: images[12].id,
    },
  });

  const menu1_8 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_2.id,
      name: "Kopi Susu",
      description: "Coffee with condensed milk",
      price: 15000,
      isAvailable: true,
      imageId: images[13].id,
    },
  });

  // Sides (4 items)
  const menu1_9 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_3.id,
      name: "Perkedel",
      description: "Indonesian potato fritters",
      price: 5000,
      isAvailable: true,
      imageId: images[14].id,
    },
  });

  const menu1_10 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_3.id,
      name: "Telur Balado",
      description: "Boiled egg with chili sauce",
      price: 8000,
      isAvailable: true,
      imageId: images[15].id,
    },
  });

  const menu1_11 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_3.id,
      name: "Kerupuk",
      description: "Crispy crackers",
      price: 3000,
      isAvailable: true,
      imageId: images[16].id,
    },
  });

  const menu1_12 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_3.id,
      name: "Sayur Nangka",
      description: "Jackfruit vegetable curry",
      price: 10000,
      isAvailable: true,
      imageId: images[17].id,
    },
  });

  // Desserts (4 items)
  const menu1_13 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_4.id,
      name: "Es Campur",
      description: "Mixed ice dessert with fruits and jellies",
      price: 18000,
      isAvailable: true,
      imageId: images[18].id,
    },
  });

  const menu1_14 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_4.id,
      name: "Kolak Pisang",
      description: "Banana in coconut milk syrup",
      price: 12000,
      isAvailable: true,
      imageId: images[19].id,
    },
  });

  const menu1_15 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_4.id,
      name: "Bubur Sumsum",
      description: "Rice flour porridge with palm sugar",
      price: 10000,
      isAvailable: true,
    },
  });

  const menu1_16 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      categoryId: merchantCategory1_4.id,
      name: "Es Cendol",
      description: "Green rice flour jelly with coconut milk",
      price: 15000,
      isAvailable: true,
    },
  });

  // ===== Merchant 2 (Sushi Restaurant) Menus =====
  // Sushi Rolls (4 items)
  const menu2_1 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_1.id,
      name: "Dragon Roll",
      description: "Eel and cucumber roll topped with avocado",
      price: 85000,
      isAvailable: true,
      imageId: images[4].id,
    },
  });

  const menu2_2 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_1.id,
      name: "California Roll",
      description: "Crab, avocado, and cucumber inside-out roll",
      price: 55000,
      isAvailable: true,
      imageId: images[5].id,
    },
  });

  const menu2_3 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_1.id,
      name: "Spicy Tuna Roll",
      description: "Tuna with spicy mayo and cucumber",
      price: 65000,
      isAvailable: true,
      imageId: images[6].id,
    },
  });

  const menu2_4 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_1.id,
      name: "Rainbow Roll",
      description: "Assorted fish over California roll",
      price: 95000,
      isAvailable: true,
      imageId: images[7].id,
    },
  });

  // Sashimi (4 items)
  const menu2_5 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_2.id,
      name: "Salmon Sashimi",
      description: "Fresh Norwegian salmon slices",
      price: 65000,
      isAvailable: true,
    },
  });

  const menu2_6 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_2.id,
      name: "Tuna Sashimi",
      description: "Premium bluefin tuna slices",
      price: 75000,
      isAvailable: true,
    },
  });

  const menu2_7 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_2.id,
      name: "Mixed Sashimi",
      description: "Assorted fresh fish selection",
      price: 120000,
      isAvailable: true,
    },
  });

  const menu2_8 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_2.id,
      name: "Octopus Sashimi",
      description: "Tender octopus slices",
      price: 70000,
      isAvailable: true,
    },
  });

  // Ramen (4 items)
  const menu2_9 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_3.id,
      name: "Tonkotsu Ramen",
      description: "Rich pork bone broth ramen",
      price: 55000,
      isAvailable: true,
    },
  });

  const menu2_10 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_3.id,
      name: "Shoyu Ramen",
      description: "Soy sauce based ramen",
      price: 50000,
      isAvailable: true,
    },
  });

  const menu2_11 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_3.id,
      name: "Miso Ramen",
      description: "Fermented soybean paste ramen",
      price: 52000,
      isAvailable: true,
    },
  });

  const menu2_12 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_3.id,
      name: "Spicy Tantanmen",
      description: "Spicy sesame ramen with minced pork",
      price: 58000,
      isAvailable: true,
    },
  });

  // Beverages (4 items)
  const menu2_13 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_4.id,
      name: "Green Tea",
      description: "Traditional Japanese green tea",
      price: 15000,
      isAvailable: true,
    },
  });

  const menu2_14 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_4.id,
      name: "Matcha Latte",
      description: "Creamy matcha green tea latte",
      price: 28000,
      isAvailable: true,
    },
  });

  const menu2_15 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_4.id,
      name: "Ramune",
      description: "Japanese marble soda",
      price: 20000,
      isAvailable: true,
    },
  });

  const menu2_16 = await prisma.menu.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      categoryId: merchantCategory2_4.id,
      name: "Calpis",
      description: "Sweet and tangy milk-based drink",
      price: 18000,
      isAvailable: true,
    },
  });

  // Create Menu Variants (at least 4 variants across menus)
  console.log("🔄 Creating menu variants...");

  // Variants for Nasi Rendang
  const variant1_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_1.id, name: "Regular", price: 35000 },
  });
  const variant1_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_1.id, name: "Large", price: 45000 },
  });
  const variant1_3 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_1.id, name: "Extra Large", price: 55000 },
  });
  const variant1_4 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu1_1.id,
      name: "Family Pack",
      price: 120000,
    },
  });

  // Variants for Nasi Ayam Pop
  const variant2_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_2.id, name: "Regular", price: 30000 },
  });
  const variant2_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_2.id, name: "Large", price: 40000 },
  });
  const variant2_3 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_2.id, name: "With Egg", price: 35000 },
  });
  const variant2_4 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_2.id, name: "Extra Spicy", price: 32000 },
  });

  // Variants for Es Teh Manis
  const variant3_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_5.id, name: "Small", price: 8000 },
  });
  const variant3_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_5.id, name: "Medium", price: 10000 },
  });
  const variant3_3 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_5.id, name: "Large", price: 12000 },
  });
  const variant3_4 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_5.id, name: "Extra Large", price: 15000 },
  });

  // Variants for Dragon Roll
  const variant4_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_1.id, name: "6 pcs", price: 85000 },
  });
  const variant4_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_1.id, name: "8 pcs", price: 105000 },
  });
  const variant4_3 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_1.id, name: "12 pcs", price: 150000 },
  });
  const variant4_4 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu2_1.id,
      name: "Party Platter (24 pcs)",
      price: 280000,
    },
  });

  // Variants for Salmon Sashimi
  const variant5_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_5.id, name: "5 pcs", price: 65000 },
  });
  const variant5_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_5.id, name: "10 pcs", price: 120000 },
  });
  const variant5_3 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_5.id, name: "15 pcs", price: 170000 },
  });
  const variant5_4 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_5.id, name: "20 pcs", price: 220000 },
  });

  // Variants for Tonkotsu Ramen
  const variant6_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_9.id, name: "Regular", price: 55000 },
  });
  const variant6_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_9.id, name: "Large", price: 70000 },
  });
  const variant6_3 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu2_9.id,
      name: "Extra Chashu",
      price: 75000,
    },
  });
  const variant6_4 = await prisma.menuVariant.create({
    data: {
      id: uuid(),
      menuId: menu2_9.id,
      name: "Combo with Gyoza",
      price: 85000,
    },
  });

  // Variants for other menus (single variants for simpler items)
  const variant7_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_9.id, name: "Regular", price: 5000 },
  });
  const variant8_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_13.id, name: "Regular", price: 18000 },
  });
  const variant9_1 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_13.id, name: "Hot", price: 15000 },
  });
  const variant9_2 = await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_13.id, name: "Iced", price: 18000 },
  });

  // Default variants for remaining Merchant 1 menus
  // menu1_3: Nasi Gulai Ikan
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_3.id, name: "Regular", price: 32000 },
  });
  // menu1_4: Nasi Dendeng Balado
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_4.id, name: "Regular", price: 38000 },
  });
  // menu1_6: Es Jeruk
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_6.id, name: "Regular", price: 12000 },
  });
  // menu1_7: Teh Tarik
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_7.id, name: "Regular", price: 15000 },
  });
  // menu1_8: Kopi Susu
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_8.id, name: "Regular", price: 15000 },
  });
  // menu1_10: Telur Balado
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_10.id, name: "Regular", price: 8000 },
  });
  // menu1_11: Kerupuk
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_11.id, name: "Regular", price: 3000 },
  });
  // menu1_12: Sayur Nangka
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_12.id, name: "Regular", price: 10000 },
  });
  // menu1_14: Kolak Pisang
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_14.id, name: "Regular", price: 12000 },
  });
  // menu1_15: Bubur Sumsum
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_15.id, name: "Regular", price: 10000 },
  });
  // menu1_16: Es Cendol
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu1_16.id, name: "Regular", price: 15000 },
  });

  // Default variants for remaining Merchant 2 menus
  // menu2_2: California Roll
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_2.id, name: "6 pcs", price: 55000 },
  });
  // menu2_3: Spicy Tuna Roll
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_3.id, name: "6 pcs", price: 65000 },
  });
  // menu2_4: Rainbow Roll
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_4.id, name: "6 pcs", price: 95000 },
  });
  // menu2_6: Tuna Sashimi
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_6.id, name: "5 pcs", price: 75000 },
  });
  // menu2_7: Mixed Sashimi
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_7.id, name: "Regular", price: 120000 },
  });
  // menu2_8: Octopus Sashimi
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_8.id, name: "5 pcs", price: 70000 },
  });
  // menu2_10: Shoyu Ramen
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_10.id, name: "Regular", price: 50000 },
  });
  // menu2_11: Miso Ramen
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_11.id, name: "Regular", price: 52000 },
  });
  // menu2_12: Spicy Tantanmen
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_12.id, name: "Regular", price: 58000 },
  });
  // menu2_14: Matcha Latte
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_14.id, name: "Regular", price: 28000 },
  });
  // menu2_15: Ramune
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_15.id, name: "Regular", price: 20000 },
  });
  // menu2_16: Calpis
  await prisma.menuVariant.create({
    data: { id: uuid(), menuId: menu2_16.id, name: "Regular", price: 18000 },
  });

  // Create Drivers (at least 4)
  console.log("🚗 Creating drivers...");
  const driver1 = await prisma.driver.create({
    data: {
      id: uuid(),
      userId: driverUser.id,
      plateNumber: "B 1234 XYZ",
      isAvailable: true,
    },
  });

  // Create additional driver users
  const driverUserData2 = await signUpUser(
    "driver2@example.com",
    "password123",
  );
  console.log(`   ✓ Driver 2 created: ${driverUserData2.id}`);
  const driverUser2 = await prisma.user.update({
    where: { id: driverUserData2.id },
    data: { role: "DRIVER", phoneNumber: "+6281234567895" },
  });

  const driverUserData3 = await signUpUser(
    "driver3@example.com",
    "password123",
  );
  console.log(`   ✓ Driver 3 created: ${driverUserData3.id}`);
  const driverUser3 = await prisma.user.update({
    where: { id: driverUserData3.id },
    data: { role: "DRIVER", phoneNumber: "+6281234567896" },
  });

  const driverUserData4 = await signUpUser(
    "driver4@example.com",
    "password123",
  );
  console.log(`   ✓ Driver 4 created: ${driverUserData4.id}`);
  const driverUser4 = await prisma.user.update({
    where: { id: driverUserData4.id },
    data: { role: "DRIVER", phoneNumber: "+6281234567897" },
  });

  const driver2 = await prisma.driver.create({
    data: {
      id: uuid(),
      userId: driverUser2.id,
      plateNumber: "B 5678 ABC",
      isAvailable: true,
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      id: uuid(),
      userId: driverUser3.id,
      plateNumber: "B 9012 DEF",
      isAvailable: false,
    },
  });

  const driver4 = await prisma.driver.create({
    data: {
      id: uuid(),
      userId: driverUser4.id,
      plateNumber: "B 3456 GHI",
      isAvailable: true,
    },
  });

  // Create Driver Locations (at least 4)
  console.log("📍 Creating driver locations...");
  await Promise.all([
    prisma.driverLocation.create({
      data: {
        driverId: driver1.id,
        latitude: -6.205,
        longitude: 106.845,
        recordedAt: new Date(),
      },
    }),
    prisma.driverLocation.create({
      data: {
        driverId: driver2.id,
        latitude: -6.21,
        longitude: 106.85,
        recordedAt: new Date(),
      },
    }),
    prisma.driverLocation.create({
      data: {
        driverId: driver3.id,
        latitude: -6.215,
        longitude: 106.84,
        recordedAt: new Date(),
      },
    }),
    prisma.driverLocation.create({
      data: {
        driverId: driver4.id,
        latitude: -6.2,
        longitude: 106.855,
        recordedAt: new Date(),
      },
    }),
  ]);

  // Create Promotions (at least 4)
  console.log("🎉 Creating promotions...");
  const promotion1 = await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "NEWUSER50",
      discountType: "PERCENT",
      discountValue: 50,
      maxDiscount: 30000,
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const promotion2 = await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "FLAT10K",
      discountType: "FLAT",
      discountValue: 10000,
      maxDiscount: 10000,
      expiredAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  const promotion3 = await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "WEEKEND25",
      discountType: "PERCENT",
      discountValue: 25,
      maxDiscount: 50000,
      expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  const promotion4 = await prisma.promotion.create({
    data: {
      id: uuid(),
      code: "FREESHIP",
      discountType: "FLAT",
      discountValue: 15000,
      maxDiscount: 15000,
      expiredAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  });

  // Create Orders (at least 4)
  console.log("📦 Creating orders...");
  const order1 = await prisma.order.create({
    data: {
      id: uuid(),
      userId: customerUser.id,
      merchantId: merchant1.id,
      driverId: driver1.id,
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
      driverId: driver2.id,
      status: "PREPARING",
      totalPrice: 150000,
      deliveryFee: 15000,
      paymentStatus: "SUCCESS",
    },
  });

  const order3 = await prisma.order.create({
    data: {
      id: uuid(),
      userId: customerUser.id,
      merchantId: merchant1.id,
      driverId: driver1.id,
      status: "COMPLETED",
      totalPrice: 65000,
      deliveryFee: 8000,
      paymentStatus: "SUCCESS",
    },
  });

  const order4 = await prisma.order.create({
    data: {
      id: uuid(),
      userId: customerUser.id,
      merchantId: merchant2.id,
      driverId: driver4.id,
      status: "ON_DELIVERY",
      totalPrice: 200000,
      deliveryFee: 12000,
      paymentStatus: "SUCCESS",
    },
  });

  // Create Order Items (at least 4)
  console.log("🛒 Creating order items...");
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        variantId: variant1_1.id,
        quantity: 2,
        price: 70000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        variantId: variant3_2.id,
        quantity: 2,
        price: 20000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        variantId: variant4_2.id,
        quantity: 1,
        price: 105000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        variantId: variant5_1.id,
        quantity: 1,
        price: 65000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order3.id,
        variantId: variant2_1.id,
        quantity: 2,
        price: 60000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order4.id,
        variantId: variant4_3.id,
        quantity: 1,
        price: 150000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order4.id,
        variantId: variant6_2.id,
        quantity: 1,
        price: 70000,
      },
    }),
  ]);

  // Create Order Status History (at least 4)
  console.log("📜 Creating order status histories...");
  await Promise.all([
    // Order 1 history
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
        status: "PREPARING",
        changedAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
        changedBy: merchantUser.id,
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
    // Order 2 history
    prisma.orderStatusHistory.create({
      data: {
        orderId: order2.id,
        status: "CREATED",
        changedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order2.id,
        status: "PAID",
        changedAt: new Date(Date.now() - 0.4 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order2.id,
        status: "PREPARING",
        changedAt: new Date(Date.now() - 0.3 * 60 * 60 * 1000),
        changedBy: merchantUser2.id,
      },
    }),
    // Order 3 history
    prisma.orderStatusHistory.create({
      data: {
        orderId: order3.id,
        status: "CREATED",
        changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order3.id,
        status: "COMPLETED",
        changedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        changedBy: driverUser.id,
      },
    }),
    // Order 4 history
    prisma.orderStatusHistory.create({
      data: {
        orderId: order4.id,
        status: "CREATED",
        changedAt: new Date(Date.now() - 0.2 * 60 * 60 * 1000),
        changedBy: customerUser.id,
      },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order4.id,
        status: "ON_DELIVERY",
        changedAt: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
        changedBy: driverUser4.id,
      },
    }),
  ]);

  // Create Payments (at least 4)
  console.log("💳 Creating payments...");
  const payment1 = await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order1.id,
      customerId: customerUser.id,
      merchantId: merchant1.id,
      provider: "MIDTRANS",
      paymentType: "gopay",
      transactionId: "TXN-001-" + Date.now(),
      amount: 90000,
      status: "SUCCESS",
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order2.id,
      customerId: customerUser.id,
      merchantId: merchant2.id,
      provider: "MIDTRANS",
      paymentType: "bank_transfer",
      transactionId: "TXN-002-" + Date.now(),
      amount: 165000,
      status: "SUCCESS",
    },
  });

  const payment3 = await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order3.id,
      customerId: customerUser.id,
      merchantId: merchant1.id,
      provider: "MIDTRANS",
      paymentType: "credit_card",
      transactionId: "TXN-003-" + Date.now(),
      amount: 73000,
      status: "SUCCESS",
    },
  });

  const payment4 = await prisma.payment.create({
    data: {
      id: uuid(),
      orderId: order4.id,
      customerId: customerUser.id,
      merchantId: merchant2.id,
      provider: "XENDIT",
      paymentType: "ovo",
      transactionId: "TXN-004-" + Date.now(),
      amount: 212000,
      status: "SUCCESS",
    },
  });

  // Create Payment Callbacks (at least 4)
  console.log("📞 Creating payment callbacks...");
  await Promise.all([
    prisma.paymentCallback.create({
      data: {
        paymentId: payment1.id,
        payload: {
          status_code: "200",
          transaction_status: "settlement",
          gross_amount: "90000",
        },
      },
    }),
    prisma.paymentCallback.create({
      data: {
        paymentId: payment2.id,
        payload: {
          status_code: "200",
          transaction_status: "settlement",
          gross_amount: "165000",
        },
      },
    }),
    prisma.paymentCallback.create({
      data: {
        paymentId: payment3.id,
        payload: {
          status_code: "200",
          transaction_status: "settlement",
          gross_amount: "73000",
        },
      },
    }),
    prisma.paymentCallback.create({
      data: {
        paymentId: payment4.id,
        payload: {
          status_code: "200",
          transaction_status: "settlement",
          gross_amount: "212000",
        },
      },
    }),
  ]);

  // Create Deliveries (at least 4)
  console.log("🚚 Creating deliveries...");
  await Promise.all([
    prisma.delivery.create({
      data: {
        orderId: order1.id,
        driverId: driver1.id,
        pickedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        distanceKm: 3.5,
      },
    }),
    prisma.delivery.create({
      data: {
        orderId: order3.id,
        driverId: driver1.id,
        pickedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        distanceKm: 2.8,
      },
    }),
    prisma.delivery.create({
      data: {
        orderId: order4.id,
        driverId: driver4.id,
        pickedAt: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() + 0.5 * 60 * 60 * 1000), // Expected delivery
        distanceKm: 4.2,
      },
    }),
  ]);

  // Create Order Promotions (at least 4)
  console.log("🏷️ Creating order promotions...");
  await Promise.all([
    prisma.orderPromotion.create({
      data: {
        orderId: order1.id,
        promotionId: promotion1.id,
        discountAmount: 30000,
      },
    }),
    prisma.orderPromotion.create({
      data: {
        orderId: order2.id,
        promotionId: promotion2.id,
        discountAmount: 10000,
      },
    }),
    prisma.orderPromotion.create({
      data: {
        orderId: order3.id,
        promotionId: promotion4.id,
        discountAmount: 8000,
      },
    }),
    prisma.orderPromotion.create({
      data: {
        orderId: order4.id,
        promotionId: promotion3.id,
        discountAmount: 50000,
      },
    }),
  ]);

  // Create Merchant Reviews (at least 4)
  console.log("⭐ Creating reviews...");
  await Promise.all([
    prisma.merchantReview.create({
      data: {
        userId: customerUser.id,
        merchantId: merchant1.id,
        rating: 5,
        comment: "Delicious food! The rendang was amazing.",
      },
    }),
    prisma.merchantReview.create({
      data: {
        userId: customerUser.id,
        merchantId: merchant1.id,
        rating: 4,
        comment: "Good portion, tasty food. A bit slow on delivery.",
      },
    }),
    prisma.merchantReview.create({
      data: {
        userId: customerUser.id,
        merchantId: merchant2.id,
        rating: 5,
        comment: "Best sushi in town! Super fresh.",
      },
    }),
    prisma.merchantReview.create({
      data: {
        userId: customerUser.id,
        merchantId: merchant2.id,
        rating: 4,
        comment: "Great ramen, will order again!",
      },
    }),
  ]);

  // Create Driver Reviews (at least 4)
  await Promise.all([
    prisma.driverReview.create({
      data: {
        userId: customerUser.id,
        driverId: driver1.id,
        rating: 5,
        comment: "Very fast delivery, friendly driver!",
      },
    }),
    prisma.driverReview.create({
      data: {
        userId: customerUser.id,
        driverId: driver2.id,
        rating: 4,
        comment: "Good service, arrived on time.",
      },
    }),
    prisma.driverReview.create({
      data: {
        userId: customerUser.id,
        driverId: driver1.id,
        rating: 5,
        comment: "Always reliable!",
      },
    }),
    prisma.driverReview.create({
      data: {
        userId: customerUser.id,
        driverId: driver4.id,
        rating: 4,
        comment: "Polite and professional.",
      },
    }),
  ]);

  // Create Carts (at least 4)
  console.log("🛒 Creating carts...");
  const cart1 = await prisma.cart.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      userId: customerUser.id,
      status: "ACTIVE",
      subtotal: 80000,
      notes: "Please make it extra spicy",
    },
  });

  // Create additional customer users for carts
  const customerUserData2 = await signUpUser(
    "customer2@example.com",
    "password123",
  );
  console.log(`   ✓ Customer 2 created: ${customerUserData2.id}`);
  const customerUser2 = await prisma.user.update({
    where: { id: customerUserData2.id },
    data: { role: "CUSTOMER", phoneNumber: "+6281234567898" },
  });

  const customerUserData3 = await signUpUser(
    "customer3@example.com",
    "password123",
  );
  console.log(`   ✓ Customer 3 created: ${customerUserData3.id}`);
  const customerUser3 = await prisma.user.update({
    where: { id: customerUserData3.id },
    data: { role: "CUSTOMER", phoneNumber: "+6281234567899" },
  });

  const cart2 = await prisma.cart.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      userId: customerUser2.id,
      status: "ACTIVE",
      subtotal: 170000,
      notes: "No wasabi please",
    },
  });

  const cart3 = await prisma.cart.create({
    data: {
      id: uuid(),
      merchantId: merchant1.id,
      userId: customerUser3.id,
      status: "CHECKOUT",
      subtotal: 45000,
    },
  });

  const cart4 = await prisma.cart.create({
    data: {
      id: uuid(),
      merchantId: merchant2.id,
      userId: customerUser.id,
      status: "EXPIRED",
      subtotal: 55000,
    },
  });

  // Create Cart Items (at least 4 per cart where applicable)
  console.log("🛍️ Creating cart items...");
  await Promise.all([
    // Cart 1 items
    prisma.cartItem.create({
      data: {
        cartId: cart1.id,
        menuName: "Nasi Rendang",
        variantId: variant1_1.id,
        basePrice: 35000,
        quantity: 2,
        itemTotal: 70000,
        notes: "Extra rendang sauce",
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart1.id,
        menuName: "Es Teh Manis",
        variantId: variant3_1.id,
        basePrice: 8000,
        quantity: 2,
        itemTotal: 16000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart1.id,
        menuName: "Perkedel",
        variantId: variant7_1.id,
        basePrice: 5000,
        quantity: 4,
        itemTotal: 20000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart1.id,
        menuName: "Es Campur",
        variantId: variant8_1.id,
        basePrice: 18000,
        quantity: 1,
        itemTotal: 18000,
      },
    }),
    // Cart 2 items
    prisma.cartItem.create({
      data: {
        cartId: cart2.id,
        menuName: "Dragon Roll",
        variantId: variant4_2.id,
        basePrice: 105000,
        quantity: 1,
        itemTotal: 105000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart2.id,
        menuName: "Salmon Sashimi",
        variantId: variant5_1.id,
        basePrice: 65000,
        quantity: 1,
        itemTotal: 65000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart2.id,
        menuName: "Green Tea",
        variantId: variant9_1.id,
        basePrice: 15000,
        quantity: 2,
        itemTotal: 30000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart2.id,
        menuName: "Tonkotsu Ramen",
        variantId: variant6_1.id,
        basePrice: 55000,
        quantity: 1,
        itemTotal: 55000,
      },
    }),
    // Cart 3 items
    prisma.cartItem.create({
      data: {
        cartId: cart3.id,
        menuName: "Nasi Ayam Pop",
        variantId: variant2_1.id,
        basePrice: 30000,
        quantity: 1,
        itemTotal: 30000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart3.id,
        menuName: "Es Teh Manis",
        variantId: variant3_2.id,
        basePrice: 10000,
        quantity: 1,
        itemTotal: 10000,
      },
    }),
    prisma.cartItem.create({
      data: {
        cartId: cart3.id,
        menuName: "Telur Balado",
        variantId: variant7_1.id,
        basePrice: 5000,
        quantity: 1,
        itemTotal: 5000,
      },
    }),
    // Cart 4 items (expired cart)
    prisma.cartItem.create({
      data: {
        cartId: cart4.id,
        menuName: "Tonkotsu Ramen",
        variantId: variant6_1.id,
        basePrice: 55000,
        quantity: 1,
        itemTotal: 55000,
      },
    }),
  ]);

  // Create Notifications (at least 4)
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
    prisma.notification.create({
      data: {
        userId: customerUser.id,
        type: "ORDER",
        message: "Your order is on the way! Driver is arriving soon.",
        isRead: false,
        createdAt: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: merchantUser2.id,
        type: "ORDER",
        message: "New order received! Prepare the Dragon Roll.",
        isRead: true,
        createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: driverUser.id,
        type: "ORDER",
        message: "New delivery assignment! Pick up from Warung Nasi Padang.",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customerUser2.id,
        type: "PROMO",
        message: "Weekend special! Use code WEEKEND25 for 25% off.",
        isRead: false,
        createdAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customerUser3.id,
        type: "Payment",
        message: "Payment successful! Your order is being prepared.",
        isRead: true,
        createdAt: new Date(Date.now() - 0.3 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - 10 Users (3 customers, 2 merchants, 4 drivers, 1 admin)");
  console.log("   - 10 Accounts with password: password123");
  console.log("   - 3 User Profiles");
  console.log("   - 2 User Addresses");
  console.log("   - 2 Merchants with operational hours");
  console.log("   - 8 Merchant Menu Categories (4 per merchant)");
  console.log("   - 6 Global Categories");
  console.log("   - 32 Menus (16 per merchant, 4 per category)");
  console.log("   - 32+ Menu Variants");
  console.log("   - 4 Drivers with locations");
  console.log("   - 4 Promotions");
  console.log("   - 4 Orders with items and status history");
  console.log("   - 4 Payments with callbacks");
  console.log("   - 3 Deliveries");
  console.log("   - 8 Reviews (4 merchant, 4 driver)");
  console.log("   - 4 Carts with items");
  console.log("   - 8 Notifications");
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

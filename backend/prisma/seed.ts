/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import { 
  PrismaClient, 
  User, 
  Merchant, 
  Driver, 
  Image, 
  Promotion, 
  Order,
  OrderStatus,
  Provider,
  NotificationType 
} from "@prisma/client";
import { v4 as uuid } from "uuid";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function shouldSkipSeeding(): Promise<boolean> {
  if (process.env.FORCE_SEED === "true") {
    console.log("🔄 FORCE_SEED is enabled - will reseed database\n");
    return false;
  }
  
  const userCount = await prisma.user.count();
  const merchantCount = await prisma.merchant.count();
  
  if (userCount > 0 && merchantCount > 0) {
    console.log(`📊 Database already has data (${userCount} users, ${merchantCount} merchants)`);
    console.log("⏭️  Skipping seed to preserve existing data");
    console.log("💡 Set FORCE_SEED=true to reseed\n");
    return true;
  }
  return false;
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const FOOD_IMAGES = {
  nasiRendang: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
  nasiPadang: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
  satay: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=800",
  friedRice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
  ramen: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
  sashimi: "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=800",
  tempura: "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=800",
  gyoza: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800",
  bento: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  pasta: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  lasagna: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
  chicken: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800",
  juice: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800",
  smoothie: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800",
  bubble: "https://images.unsplash.com/photo-1558857563-c0c67b28c4ad?w=800",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  ice: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
  donut: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
  bibimbap: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800",
  kimchi: "https://images.unsplash.com/photo-1583224964978-2d8c1c9e7c5e?w=800",
  kbbq: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
  padthai: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
  tomyum: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800",
  greencurry: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
};

async function main() {
  console.log("🌱 Starting comprehensive portfolio seed...");
  console.log("📡 Direct database seeding (no API dependency)\n");

  if (await shouldSkipSeeding()) {
    return;
  }

  console.log("🧹 Cleaning up existing data...");
  try {
    await prisma.messageReadReceipt.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatParticipant.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.supportTicket.deleteMany();
  } catch (e) {}
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
  console.log("   ✓ Database cleaned\n");

  console.log("📸 Creating images...");
  const imageMap: Record<string, string> = {};
  for (const [key, url] of Object.entries(FOOD_IMAGES)) {
    const img = await prisma.image.create({ data: { id: uuid(), imageUrl: url } });
    imageMap[key] = img.id;
  }
  const profileImages: Image[] = [];
  const profileUrls = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  ];
  for (const url of profileUrls) {
    const img = await prisma.image.create({ data: { id: uuid(), imageUrl: url } });
    profileImages.push(img);
  }
  console.log(`   ✓ ${Object.keys(imageMap).length + profileImages.length} images created\n`);

  console.log("👥 Creating users...");
  const hashedPassword = hashPassword("password123");

  const adminUser = await prisma.user.create({
    data: { id: uuid(), email: "admin@fooddelivery.com", emailVerified: true, role: "ADMIN", status: "ACTIVE", phoneNumber: "+6281234567800" },
  });
  await prisma.account.create({ data: { id: uuid(), userId: adminUser.id, accountId: adminUser.id, providerId: "credential", password: hashedPassword } });

  const customerData = [
    { email: "budi@gmail.com", phone: "+6281234567801", name: "Budi Santoso" },
    { email: "siti@gmail.com", phone: "+6281234567802", name: "Siti Rahayu" },
    { email: "andi@gmail.com", phone: "+6281234567803", name: "Andi Wijaya" },
    { email: "dewi@gmail.com", phone: "+6281234567804", name: "Dewi Lestari" },
    { email: "customer@example.com", phone: "+6281234567805", name: "Demo Customer" },
  ];
  const customers: User[] = [];
  for (let i = 0; i < customerData.length; i++) {
    const c = customerData[i];
    const user = await prisma.user.create({
      data: { id: uuid(), email: c.email, emailVerified: true, role: "CUSTOMER", status: "ACTIVE", phoneNumber: c.phone },
    });
    await prisma.account.create({ data: { id: uuid(), userId: user.id, accountId: user.id, providerId: "credential", password: hashedPassword } });
    await prisma.userProfile.create({
      data: { userId: user.id, fullName: c.name, imageId: profileImages[i].id, birthDate: new Date(`199${i}-0${i + 1}-1${i}`) },
    });
    customers.push(user);
  }

  const merchantData = [
    { email: "merchant.padang@gmail.com", phone: "+6281234567810" },
    { email: "merchant.sushi@gmail.com", phone: "+6281234567811" },
    { email: "merchant.pizza@gmail.com", phone: "+6281234567812" },
    { email: "merchant.burger@gmail.com", phone: "+6281234567813" },
    { email: "merchant.korean@gmail.com", phone: "+6281234567814" },
    { email: "merchant.thai@gmail.com", phone: "+6281234567815" },
    { email: "merchant@example.com", phone: "+6281234567816" },
  ];
  const merchantUsers: User[] = [];
  for (const m of merchantData) {
    const user = await prisma.user.create({
      data: { id: uuid(), email: m.email, emailVerified: true, role: "MERCHANT", status: "ACTIVE", phoneNumber: m.phone },
    });
    await prisma.account.create({ data: { id: uuid(), userId: user.id, accountId: user.id, providerId: "credential", password: hashedPassword } });
    merchantUsers.push(user);
  }

  const driverData = [
    { email: "driver.rudi@gmail.com", phone: "+6281234567820", plate: "B 1234 XYZ" },
    { email: "driver.eko@gmail.com", phone: "+6281234567821", plate: "B 5678 ABC" },
    { email: "driver.joko@gmail.com", phone: "+6281234567822", plate: "B 9012 DEF" },
    { email: "driver.bambang@gmail.com", phone: "+6281234567823", plate: "B 3456 GHI" },
    { email: "driver@example.com", phone: "+6281234567824", plate: "B 7890 JKL" },
  ];
  const driverUsers: User[] = [];
  const drivers: Driver[] = [];
  for (const d of driverData) {
    const user = await prisma.user.create({
      data: { id: uuid(), email: d.email, emailVerified: true, role: "DRIVER", status: "ACTIVE", phoneNumber: d.phone },
    });
    await prisma.account.create({ data: { id: uuid(), userId: user.id, accountId: user.id, providerId: "credential", password: hashedPassword } });
    driverUsers.push(user);
    const driver = await prisma.driver.create({
      data: { id: uuid(), userId: user.id, plateNumber: d.plate, isAvailable: true, rating: 4.5 + Math.random() * 0.5, approvalStatus: "APPROVED" },
    });
    drivers.push(driver);
    await prisma.driverLocation.create({
      data: { driverId: driver.id, latitude: -6.2 + Math.random() * 0.05, longitude: 106.84 + Math.random() * 0.05, recordedAt: new Date() },
    });
  }
  console.log(`   ✓ 1 Admin, ${customers.length} Customers, ${merchantUsers.length} Merchants, ${drivers.length} Drivers created\n`);

  console.log("📍 Creating addresses...");
  const addresses = [
    { userId: customers[0].id, label: "Rumah", lat: -6.2088, lng: 106.8456, addr: "Jl. Sudirman No. 123, Jakarta Pusat", isDefault: true },
    { userId: customers[0].id, label: "Kantor", lat: -6.1751, lng: 106.865, addr: "Jl. Thamrin No. 456, Jakarta Pusat", isDefault: false },
    { userId: customers[1].id, label: "Rumah", lat: -6.2297, lng: 106.6895, addr: "Jl. Kemanggisan Raya No. 78, Jakarta Barat", isDefault: true },
    { userId: customers[2].id, label: "Apartemen", lat: -6.2262, lng: 106.8007, addr: "Apartemen Green Park Tower A Lt. 15", isDefault: true },
    { userId: customers[3].id, label: "Kos", lat: -6.1934, lng: 106.822, addr: "Kost Putri Harmoni, Jl. Gajah Mada No. 50", isDefault: true },
    { userId: customers[4].id, label: "Home", lat: -6.2146, lng: 106.8451, addr: "Jl. MH Thamrin No. 1, Jakarta Pusat", isDefault: true },
  ];
  for (const a of addresses) {
    await prisma.userAddres.create({ data: { userId: a.userId, label: a.label, latitude: a.lat, longitude: a.lng, address: a.addr, isDefault: a.isDefault } });
  }
  console.log(`   ✓ ${addresses.length} addresses created\n`);

  console.log("🏪 Creating merchants (APPROVED)...");
  const merchantInfo = [
    { name: "Warung Nasi Padang Sederhana", desc: "Masakan Padang autentik dengan cita rasa khas Minang. Rendang, gulai, dan sambal lado yang bikin nagih!", lat: -6.200, lng: 106.840, rating: 4.8 },
    { name: "Sakura Sushi House", desc: "Fresh Japanese sushi, sashimi, and authentic ramen. All fish imported weekly from Tsukiji Market.", lat: -6.210, lng: 106.850, rating: 4.7 },
    { name: "Pizza Roma Authentic Italian", desc: "Wood-fired authentic Italian pizza with imported ingredients from Italy.", lat: -6.220, lng: 106.830, rating: 4.6 },
    { name: "Burger Bros Premium", desc: "100% Australian beef burgers with homemade sauces. Best fries in town!", lat: -6.190, lng: 106.860, rating: 4.5 },
    { name: "Seoul Kitchen 서울식당", desc: "Authentic Korean cuisine - Bibimbap, Korean BBQ, and homemade Kimchi. Halal certified.", lat: -6.205, lng: 106.835, rating: 4.7 },
    { name: "Thai Smile Kitchen", desc: "Authentic Thai street food - Tom Yum, Pad Thai, Green Curry. Spicy level adjustable!", lat: -6.215, lng: 106.845, rating: 4.6 },
    { name: "Kopi Nusantara Specialty Coffee", desc: "Premium Indonesian single-origin coffee. Specialty drinks and fresh juices.", lat: -6.198, lng: 106.852, rating: 4.9 },
  ];
  const merchants: Merchant[] = [];
  for (let i = 0; i < merchantInfo.length; i++) {
    const m = merchantInfo[i];
    const merchant = await prisma.merchant.create({
      data: { id: uuid(), ownerId: merchantUsers[i].id, name: m.name, description: m.desc, latitude: m.lat, longitude: m.lng, isOpen: true, rating: m.rating, approvalStatus: "APPROVED" },
    });
    merchants.push(merchant);
    for (let day = 0; day < 7; day++) {
      await prisma.merchantOperationalHour.create({
        data: { merchantId: merchant.id, dayOfWeek: day, openTime: day === 0 ? "10:00" : "08:00", closeTime: day >= 5 ? "23:00" : "22:00" },
      });
    }
  }
  console.log(`   ✓ ${merchants.length} merchants created (all APPROVED)\n`);

  console.log("📂 Creating categories...");
  const globalCategories = [
    { name: "Indonesian", desc: "Traditional Indonesian cuisine" },
    { name: "Japanese", desc: "Sushi, Ramen, and more" },
    { name: "Italian", desc: "Pizza, Pasta, and Italian favorites" },
    { name: "American", desc: "Burgers, Fries, and Fast Food" },
    { name: "Korean", desc: "Korean BBQ and traditional dishes" },
    { name: "Thai", desc: "Spicy Thai cuisine" },
    { name: "Beverages", desc: "Coffee, Tea, and Drinks" },
    { name: "Desserts", desc: "Sweet treats and desserts" },
  ];
  for (const c of globalCategories) {
    await prisma.category.create({ data: { id: uuid(), name: c.name, description: c.desc } });
  }
  console.log(`   ✓ ${globalCategories.length} global categories created\n`);

  console.log("🍽️ Creating menus...");
  const allVariants: Array<{ id: string; price: number; merchantId: string; menuName: string }> = [];

  const menuData = [
    {
      merchantId: merchants[0].id,
      categories: [
        { name: "Nasi Padang", menus: [
          { name: "Nasi Rendang", desc: "Nasi putih dengan rendang daging sapi empuk bumbu rempah", price: 35000, img: "nasiRendang" },
          { name: "Nasi Ayam Pop", desc: "Nasi dengan ayam goreng bumbu khas Padang", price: 30000, img: "nasiPadang" },
          { name: "Nasi Gulai Ikan", desc: "Nasi dengan ikan kakap gulai kuning segar", price: 32000, img: "nasiPadang" },
          { name: "Nasi Dendeng Balado", desc: "Nasi dengan dendeng sapi balado pedas manis", price: 38000, img: "satay" },
        ]},
        { name: "Lauk Pauk", menus: [
          { name: "Rendang Daging", desc: "Rendang daging sapi dimasak hingga kering", price: 25000, img: "nasiRendang" },
          { name: "Ayam Bakar Padang", desc: "Ayam bakar bumbu padang dengan sambal lado", price: 22000, img: "chicken" },
          { name: "Telur Balado", desc: "Telur rebus dengan sambal balado merah", price: 10000, img: "nasiPadang" },
        ]},
        { name: "Minuman", menus: [
          { name: "Es Teh Manis", desc: "Teh manis dingin segar", price: 8000, img: "tea" },
          { name: "Es Jeruk", desc: "Jus jeruk segar dengan es", price: 12000, img: "juice" },
          { name: "Teh Tarik", desc: "Teh tarik ala Malaysia creamy", price: 15000, img: "tea" },
        ]},
      ],
    },
    {
      merchantId: merchants[1].id,
      categories: [
        { name: "Sushi Rolls", menus: [
          { name: "Dragon Roll", desc: "Eel and cucumber topped with avocado", price: 85000, img: "sushi" },
          { name: "California Roll", desc: "Crab, avocado, cucumber inside-out roll", price: 55000, img: "sushi" },
          { name: "Spicy Tuna Roll", desc: "Fresh tuna with spicy mayo", price: 65000, img: "sushi" },
          { name: "Rainbow Roll", desc: "Assorted fresh fish over California roll", price: 95000, img: "sushi" },
        ]},
        { name: "Sashimi", menus: [
          { name: "Salmon Sashimi", desc: "Premium Norwegian salmon, 5 slices", price: 65000, img: "sashimi" },
          { name: "Tuna Sashimi", desc: "Bluefin tuna, 5 slices", price: 75000, img: "sashimi" },
          { name: "Mixed Sashimi", desc: "Chef's selection of fresh fish", price: 120000, img: "sashimi" },
        ]},
        { name: "Ramen", menus: [
          { name: "Tonkotsu Ramen", desc: "Rich pork bone broth with chashu", price: 55000, img: "ramen" },
          { name: "Miso Ramen", desc: "Fermented soybean paste broth", price: 50000, img: "ramen" },
          { name: "Spicy Tantanmen", desc: "Spicy sesame broth with minced pork", price: 58000, img: "ramen" },
        ]},
        { name: "Appetizers", menus: [
          { name: "Gyoza (6 pcs)", desc: "Pan-fried Japanese dumplings", price: 35000, img: "gyoza" },
          { name: "Tempura Set", desc: "Assorted tempura with dipping sauce", price: 45000, img: "tempura" },
        ]},
      ],
    },
    {
      merchantId: merchants[2].id,
      categories: [
        { name: "Pizza", menus: [
          { name: "Margherita", desc: "Classic tomato sauce, mozzarella, fresh basil", price: 75000, img: "pizza" },
          { name: "Pepperoni", desc: "Tomato sauce, mozzarella, premium pepperoni", price: 95000, img: "pizza" },
          { name: "Four Cheese", desc: "Mozzarella, gorgonzola, parmesan, ricotta", price: 105000, img: "pizza" },
          { name: "BBQ Chicken", desc: "BBQ sauce, grilled chicken, red onion", price: 98000, img: "pizza" },
        ]},
        { name: "Pasta", menus: [
          { name: "Spaghetti Carbonara", desc: "Creamy egg sauce with pancetta", price: 65000, img: "pasta" },
          { name: "Fettuccine Alfredo", desc: "Creamy parmesan sauce", price: 60000, img: "pasta" },
          { name: "Lasagna Bolognese", desc: "Layered pasta with meat sauce", price: 75000, img: "lasagna" },
        ]},
        { name: "Desserts", menus: [
          { name: "Tiramisu", desc: "Classic Italian coffee-flavored dessert", price: 45000, img: "cake" },
          { name: "Panna Cotta", desc: "Italian cream dessert with berry sauce", price: 40000, img: "cake" },
        ]},
      ],
    },
    {
      merchantId: merchants[3].id,
      categories: [
        { name: "Burgers", menus: [
          { name: "Classic Cheeseburger", desc: "Beef patty, cheddar, lettuce, tomato", price: 45000, img: "burger" },
          { name: "Double Bacon Burger", desc: "Double beef, crispy bacon, BBQ sauce", price: 75000, img: "burger" },
          { name: "Mushroom Swiss", desc: "Beef patty, sautéed mushrooms, Swiss cheese", price: 55000, img: "burger" },
          { name: "Crispy Chicken Burger", desc: "Crispy fried chicken, coleslaw, pickles", price: 48000, img: "chicken" },
        ]},
        { name: "Sides", menus: [
          { name: "French Fries", desc: "Crispy golden fries with seasoning", price: 20000, img: "fries" },
          { name: "Onion Rings", desc: "Crispy battered onion rings", price: 25000, img: "fries" },
          { name: "Cheese Fries", desc: "Fries topped with melted cheese", price: 30000, img: "fries" },
        ]},
        { name: "Drinks", menus: [
          { name: "Milkshake", desc: "Creamy vanilla, chocolate or strawberry", price: 28000, img: "smoothie" },
          { name: "Coca Cola", desc: "Ice cold Coca Cola", price: 15000, img: "juice" },
        ]},
      ],
    },
    {
      merchantId: merchants[4].id,
      categories: [
        { name: "Rice Bowls", menus: [
          { name: "Bibimbap", desc: "Mixed rice with vegetables, egg, gochujang", price: 45000, img: "bibimbap" },
          { name: "Bulgogi Rice", desc: "Marinated beef with rice and vegetables", price: 55000, img: "bibimbap" },
          { name: "Chicken Teriyaki Bowl", desc: "Grilled chicken with teriyaki sauce", price: 48000, img: "bento" },
        ]},
        { name: "Korean BBQ", menus: [
          { name: "Samgyeopsal", desc: "Grilled pork belly (200g) with sides", price: 85000, img: "kbbq" },
          { name: "Beef Galbi", desc: "Marinated beef short ribs (200g)", price: 120000, img: "kbbq" },
          { name: "Dakgalbi", desc: "Spicy stir-fried chicken with vegetables", price: 75000, img: "kbbq" },
        ]},
        { name: "Soups & Stews", menus: [
          { name: "Kimchi Jjigae", desc: "Spicy kimchi stew with pork and tofu", price: 45000, img: "kimchi" },
          { name: "Sundubu Jjigae", desc: "Soft tofu stew with seafood", price: 48000, img: "tomyum" },
        ]},
        { name: "Sides (Banchan)", menus: [
          { name: "Kimchi", desc: "Traditional fermented napa cabbage", price: 15000, img: "kimchi" },
          { name: "Tteokbokki", desc: "Spicy rice cakes in gochujang sauce", price: 28000, img: "kimchi" },
        ]},
      ],
    },
    {
      merchantId: merchants[5].id,
      categories: [
        { name: "Noodles", menus: [
          { name: "Pad Thai", desc: "Stir-fried rice noodles with shrimp and peanuts", price: 45000, img: "padthai" },
          { name: "Pad See Ew", desc: "Flat rice noodles with egg and broccoli", price: 42000, img: "padthai" },
          { name: "Drunken Noodles", desc: "Spicy stir-fried noodles with basil", price: 48000, img: "padthai" },
        ]},
        { name: "Curries", menus: [
          { name: "Green Curry", desc: "Coconut curry with Thai basil", price: 55000, img: "greencurry" },
          { name: "Red Curry", desc: "Spicy red curry with bamboo shoots", price: 55000, img: "greencurry" },
          { name: "Massaman Curry", desc: "Rich curry with potatoes and peanuts", price: 58000, img: "greencurry" },
        ]},
        { name: "Soups", menus: [
          { name: "Tom Yum Kung", desc: "Spicy and sour shrimp soup", price: 48000, img: "tomyum" },
          { name: "Tom Kha Gai", desc: "Coconut chicken soup with galangal", price: 45000, img: "tomyum" },
        ]},
        { name: "Rice Dishes", menus: [
          { name: "Basil Chicken Rice", desc: "Stir-fried chicken with holy basil", price: 40000, img: "friedRice" },
          { name: "Pineapple Fried Rice", desc: "Fried rice with pineapple and cashews", price: 48000, img: "friedRice" },
        ]},
      ],
    },
    {
      merchantId: merchants[6].id,
      categories: [
        { name: "Hot Coffee", menus: [
          { name: "Espresso", desc: "Double shot espresso", price: 22000, img: "coffee" },
          { name: "Cappuccino", desc: "Espresso with steamed milk foam", price: 32000, img: "coffee" },
          { name: "Latte", desc: "Espresso with steamed milk", price: 35000, img: "coffee" },
          { name: "Kopi Tubruk", desc: "Traditional Indonesian black coffee", price: 18000, img: "coffee" },
        ]},
        { name: "Iced Coffee", menus: [
          { name: "Iced Americano", desc: "Espresso with cold water and ice", price: 28000, img: "coffee" },
          { name: "Es Kopi Susu Gula Aren", desc: "Iced coffee with milk and palm sugar", price: 32000, img: "coffee" },
          { name: "Cold Brew", desc: "Slow-brewed cold coffee (12 hours)", price: 35000, img: "coffee" },
        ]},
        { name: "Non-Coffee", menus: [
          { name: "Matcha Latte", desc: "Japanese green tea with milk", price: 35000, img: "tea" },
          { name: "Brown Sugar Boba", desc: "Fresh milk with brown sugar and tapioca", price: 32000, img: "bubble" },
          { name: "Fresh Orange Juice", desc: "Freshly squeezed orange juice", price: 28000, img: "juice" },
        ]},
        { name: "Snacks", menus: [
          { name: "Croissant", desc: "Butter croissant, plain or chocolate", price: 25000, img: "donut" },
          { name: "Cheesecake", desc: "New York style cheesecake", price: 35000, img: "cake" },
        ]},
      ],
    },
  ];

  let totalMenus = 0;
  for (const merchantMenus of menuData) {
    for (const cat of merchantMenus.categories) {
      const category = await prisma.merchantMenuCategory.create({
        data: { id: uuid(), name: cat.name, merchantId: merchantMenus.merchantId },
      });
      for (const menu of cat.menus) {
        const createdMenu = await prisma.menu.create({
          data: {
            id: uuid(),
            merchantId: merchantMenus.merchantId,
            categoryId: category.id,
            name: menu.name,
            description: menu.desc,
            price: menu.price,
            isAvailable: true,
            imageId: imageMap[menu.img],
          },
        });
       
        const variant = await prisma.menuVariant.create({
          data: { id: uuid(), menuId: createdMenu.id, name: "Regular", price: menu.price },
        });
        allVariants.push({ id: variant.id, price: variant.price, merchantId: merchantMenus.merchantId, menuName: menu.name });
        
        if (menu.price >= 30000) {
          const largeVariant = await prisma.menuVariant.create({
            data: { id: uuid(), menuId: createdMenu.id, name: "Large", price: Math.round(menu.price * 1.3) },
          });
          allVariants.push({ id: largeVariant.id, price: largeVariant.price, merchantId: merchantMenus.merchantId, menuName: menu.name });
        }
        totalMenus++;
      }
    }
  }
  console.log(`   ✓ ${totalMenus} menus with variants created\n`);

  console.log("🎉 Creating promotions...");
  const promotions = [
    { code: "NEWUSER50", type: "PERCENT", value: 50, max: 30000, days: 90 },
    { code: "HEMAT25K", type: "FLAT", value: 25000, max: 25000, days: 60 },
    { code: "WEEKEND30", type: "PERCENT", value: 30, max: 50000, days: 30 },
    { code: "FREESHIP", type: "FLAT", value: 15000, max: 15000, days: 45 },
    { code: "PAYDAY20", type: "PERCENT", value: 20, max: 40000, days: 120 },
  ];
  const createdPromos: Promotion[] = [];
  for (const p of promotions) {
    const promo = await prisma.promotion.create({
      data: {
        id: uuid(),
        code: p.code,
        discountType: p.type as "PERCENT" | "FLAT",
        discountValue: p.value,
        maxDiscount: p.max,
        expiredAt: new Date(Date.now() + p.days * 24 * 60 * 60 * 1000),
      },
    });
    createdPromos.push(promo);
  }
  console.log(`   ✓ ${promotions.length} promotions created\n`);

  console.log("📦 Creating orders...");
  const orderStatuses = ["COMPLETED", "COMPLETED", "COMPLETED", "PREPARING", "ON_DELIVERY", "PAID", "COMPLETED", "READY"];
  const createdOrders: Order[] = [];

  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    const merchantIndex = i % merchants.length;
    const merchant = merchants[merchantIndex];
    const status = orderStatuses[i % orderStatuses.length];
    const driver = ["ON_DELIVERY", "COMPLETED", "READY"].includes(status) ? drivers[i % drivers.length] : null;
    const merchantVariants = allVariants.filter(v => v.merchantId === merchant.id);

    const orderDate = new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000));
    const itemCount = 1 + Math.floor(Math.random() * 3);
    let totalPrice = 0;

    const order = await prisma.order.create({
      data: {
        id: uuid(),
        userId: customer.id,
        merchantId: merchant.id,
        driverId: driver?.id,
        status: status as OrderStatus,
        totalPrice: 0,
        deliveryFee: 8000 + Math.floor(Math.random() * 7000),
        paymentStatus: ["COMPLETED", "ON_DELIVERY", "PAID", "PREPARING", "READY"].includes(status) ? "SUCCESS" : "PENDING",
        createdAt: orderDate,
      },
    });

    for (let j = 0; j < itemCount && j < merchantVariants.length; j++) {
      const variant = merchantVariants[j % merchantVariants.length];
      const qty = 1 + Math.floor(Math.random() * 2);
      const price = variant.price * qty;
      totalPrice += price;
      await prisma.orderItem.create({
        data: { orderId: order.id, variantId: variant.id, quantity: qty, price },
      });
    }

    await prisma.order.update({ where: { id: order.id }, data: { totalPrice } });

    await prisma.orderStatusHistory.create({
      data: { orderId: order.id, status: "CREATED", changedAt: orderDate, changedBy: customer.id },
    });
    if (status !== "CREATED") {
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: "PAID", changedAt: new Date(orderDate.getTime() + 5 * 60 * 1000), changedBy: customer.id },
      });
    }
    if (["PREPARING", "READY", "ON_DELIVERY", "COMPLETED"].includes(status)) {
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: "PREPARING", changedAt: new Date(orderDate.getTime() + 10 * 60 * 1000), changedBy: merchantUsers[merchantIndex].id },
      });
    }
    if (["READY", "ON_DELIVERY", "COMPLETED"].includes(status)) {
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: "READY", changedAt: new Date(orderDate.getTime() + 25 * 60 * 1000), changedBy: merchantUsers[merchantIndex].id },
      });
    }
    if (status === "COMPLETED") {
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: "COMPLETED", changedAt: new Date(orderDate.getTime() + 45 * 60 * 1000), changedBy: driver?.userId || customer.id },
      });
    }

    if (order.paymentStatus === "SUCCESS") {
      const payment = await prisma.payment.create({
        data: {
          id: uuid(),
          orderId: order.id,
          customerId: customer.id,
          merchantId: merchant.id,
          provider: ["MIDTRANS", "XENDIT", "PAKASIR"][Math.floor(Math.random() * 3)] as Provider,
          paymentType: ["gopay", "ovo", "dana", "bank_transfer"][Math.floor(Math.random() * 4)],
          transactionId: `TXN-${Date.now()}-${i}`,
          amount: totalPrice + (order.deliveryFee || 0),
          status: "SUCCESS",
        },
      });
      await prisma.paymentCallback.create({
        data: { paymentId: payment.id, payload: { status_code: "200", transaction_status: "settlement" } },
      });
    }

    if (["COMPLETED", "ON_DELIVERY"].includes(status) && driver) {
      await prisma.delivery.create({
        data: {
          orderId: order.id,
          driverId: driver.id,
          pickedAt: new Date(orderDate.getTime() + 30 * 60 * 1000),
          deliveredAt: status === "COMPLETED"
            ? new Date(orderDate.getTime() + 50 * 60 * 1000)
            : new Date(Date.now() + 15 * 60 * 1000),
          distanceKm: 2 + Math.random() * 5,
        },
      });
    }

    if (Math.random() > 0.5) {
      const promo = createdPromos[Math.floor(Math.random() * createdPromos.length)];
      await prisma.orderPromotion.create({
        data: { orderId: order.id, promotionId: promo.id, discountAmount: Math.min(promo.maxDiscount, Math.floor(totalPrice * 0.2)) },
      });
    }

    createdOrders.push(order);
  }
  console.log(`   ✓ ${createdOrders.length} orders with payments created\n`);

  console.log("⭐ Creating reviews...");
  const merchantReviewComments = [
    "Makanan enak banget! Pasti order lagi.",
    "Porsi banyak, harga terjangkau. Recommended!",
    "Rasanya enak, cepat sampai.",
    "Best food in town! Must try!",
    "Authentic taste, just like homemade!",
    "Packaging rapi, makanan masih hangat.",
  ];
  const driverReviewComments = [
    "Driver ramah dan cepat!",
    "Pengantaran tepat waktu.",
    "Good service, friendly driver.",
    "Sangat profesional!",
  ];

  for (const merchant of merchants) {
    for (let i = 0; i < 3; i++) {
      await prisma.merchantReview.create({
        data: {
          userId: customers[i % customers.length].id,
          merchantId: merchant.id,
          rating: 4 + Math.floor(Math.random() * 2),
          comment: merchantReviewComments[Math.floor(Math.random() * merchantReviewComments.length)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        },
      });
    }
  }

  for (const driver of drivers) {
    for (let i = 0; i < 2; i++) {
      await prisma.driverReview.create({
        data: {
          userId: customers[i % customers.length].id,
          driverId: driver.id,
          rating: 4 + Math.floor(Math.random() * 2),
          comment: driverReviewComments[Math.floor(Math.random() * driverReviewComments.length)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        },
      });
    }
  }
  console.log(`   ✓ ${merchants.length * 3} merchant reviews, ${drivers.length * 2} driver reviews created\n`);

  console.log("🛒 Creating active carts...");
  for (let i = 0; i < 3; i++) {
    const customer = customers[i];
    const merchant = merchants[i];
    const merchantVariants = allVariants.filter(v => v.merchantId === merchant.id);
    let subtotal = 0;

    const cart = await prisma.cart.create({
      data: { id: uuid(), merchantId: merchant.id, userId: customer.id, status: "ACTIVE", subtotal: 0, notes: i === 0 ? "Tolong extra pedas ya" : undefined },
    });

    for (let j = 0; j < 2 && j < merchantVariants.length; j++) {
      const variant = merchantVariants[j];
      const qty = 1 + Math.floor(Math.random() * 2);
      const itemTotal = variant.price * qty;
      subtotal += itemTotal;
      await prisma.cartItem.create({
        data: { cartId: cart.id, menuName: variant.menuName, variantId: variant.id, basePrice: variant.price, quantity: qty, itemTotal },
      });
    }

    await prisma.cart.update({ where: { id: cart.id }, data: { subtotal } });
  }
  console.log(`   ✓ 3 active carts created\n`);

  console.log("🔔 Creating notifications...");
  const notifications = [
    { type: "PROMO", message: "🎉 Promo Spesial! Gunakan kode NEWUSER50 untuk diskon 50%!" },
    { type: "PROMO", message: "🔥 Weekend Sale! Diskon 30% semua menu. Kode: WEEKEND30" },
    { type: "ORDER", message: "📦 Pesanan Anda sedang disiapkan oleh merchant." },
    { type: "ORDER", message: "🚗 Driver sedang menuju lokasi Anda!" },
    { type: "ORDER", message: "✅ Pesanan telah selesai. Terima kasih!" },
    { type: "Payment", message: "💰 Pembayaran berhasil! Pesanan sedang diproses." },
  ];

  for (const customer of customers) {
    for (let i = 0; i < 2; i++) {
      const notif = notifications[Math.floor(Math.random() * notifications.length)];
      await prisma.notification.create({
        data: {
          userId: customer.id,
          type: notif.type as NotificationType,
          message: notif.message,
          isRead: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        },
      });
    }
  }
  console.log(`   ✓ ${customers.length * 2} notifications created\n`);

  console.log("═".repeat(50));
  console.log("✅ SEED COMPLETED SUCCESSFULLY!");
  console.log("═".repeat(50));
  console.log("\n📋 Summary:");
  console.log(`   👤 Users: 1 Admin + ${customers.length} Customers + ${merchantUsers.length} Merchants + ${drivers.length} Drivers`);
  console.log(`   🏪 Merchants: ${merchants.length} (all APPROVED)`);
  console.log(`   🍽️  Menus: ${totalMenus} with variants`);
  console.log(`   📦 Orders: ${createdOrders.length}`);
  console.log(`   🎉 Promotions: ${promotions.length}`);
  console.log(`   ⭐ Reviews: ${merchants.length * 3} merchant + ${drivers.length * 2} driver`);
  console.log("\n🔑 Login Credentials (password: password123):");
  console.log("   Admin:    admin@fooddelivery.com");
  console.log("   Customer: customer@example.com / budi@gmail.com");
  console.log("   Merchant: merchant@example.com");
  console.log("   Driver:   driver@example.com");
  console.log("");
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

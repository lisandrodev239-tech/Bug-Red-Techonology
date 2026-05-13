import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bugred.com" },
    update: {},
    create: {
      name: "Admin",
      lastname: "BugRed",
      email: "admin@bugred.com",
      password: adminPassword,
      phone: "1122334455",
      address: "Av. Principal 123",
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      name: "Usuario",
      lastname: "Demo",
      email: "user@test.com",
      password: userPassword,
      phone: "5566778899",
      address: "Calle Secundaria 456",
      role: "user",
    },
  });

  const productImages: Record<string, string> = {
    motherboard: "https://placehold.co/400x400/1a1a2e/eaeaea?text=Motherboard",
    cpu: "https://placehold.co/400x400/16213e/eaeaea?text=CPU",
    gpu: "https://placehold.co/400x400/0f3460/eaeaea?text=GPU",
    ram: "https://placehold.co/400x400/533483/eaeaea?text=RAM",
    cabinet: "https://placehold.co/400x400/e94560/eaeaea?text=Gabinete",
    monitor: "https://placehold.co/400x400/1a1a2e/eaeaea?text=Monitor",
  };

  const products = [
    { name: "Motherboard ASUS ROG Strix Z790-E", category: "motherboard", brand: "ASUS", model: "Z790-E", specs: '{"socket":"LGA1700","chipset":"Z790","ram":"DDR5"}', stock: 5, price: 450000, description: "Motherboard gaming ASUS Z790 con WiFi 6E y DDR5" },
    { name: "Motherboard Gigabyte B760M DS3H", category: "motherboard", brand: "Gigabyte", model: "B760M", specs: '{"socket":"LGA1700","chipset":"B760","ram":"DDR5"}', stock: 8, price: 150000, description: "Motherboard B760M ideal para builds mid-range" },
    { name: "CPU Intel Core i5-14600K", category: "cpu", brand: "Intel", model: "i5-14600K", specs: '{"cores":"14","threads":"20","baseClock":"3.5GHz","maxClock":"5.3GHz"}', stock: 10, price: 320000, description: "Procesador Intel 14ª gen con rendimiento gaming excepcional" },
    { name: "CPU AMD Ryzen 7 7800X3D", category: "cpu", brand: "AMD", model: "Ryzen 7 7800X3D", specs: '{"cores":"8","threads":"16","baseClock":"4.2GHz","maxClock":"5.0GHz"}', stock: 7, price: 380000, description: "El mejor procesador para gaming con tecnología 3D V-Cache" },
    { name: "GPU NVIDIA RTX 4060", category: "gpu", brand: "NVIDIA", model: "RTX 4060", specs: '{"vram":"8GB GDDR6","architecture":"Ada Lovelace"}', stock: 6, price: 350000, description: "Tarjeta gráfica ideal para gaming 1080p/1440p" },
    { name: "GPU AMD Radeon RX 7800 XT", category: "gpu", brand: "AMD", model: "RX 7800 XT", specs: '{"vram":"16GB GDDR6","architecture":"RDNA 3"}', stock: 4, price: 520000, description: "Potente GPU para gaming 1440p y 4K" },
    { name: "RAM Kingston Fury 16GB DDR5", category: "ram", brand: "Kingston", model: "Fury Beast", specs: '{"capacity":"16GB","type":"DDR5","speed":"5600MHz"}', stock: 15, price: 65000, description: "Módulo DDR5 de alto rendimiento" },
    { name: "RAM Corsair Vengeance 32GB DDR4", category: "ram", brand: "Corsair", model: "Vengeance LPX", specs: '{"capacity":"32GB","type":"DDR4","speed":"3600MHz"}', stock: 12, price: 85000, description: "Kit DDR4 confiable para gaming y productividad" },
    { name: "Gabinete NZXT H5 Flow", category: "cabinet", brand: "NZXT", model: "H5 Flow", specs: '{"type":"mid-tower","color":"black"}', stock: 6, price: 120000, description: "Gabinete con excelente flujo de aire" },
    { name: "Gabinete Corsair 4000D Airflow", category: "cabinet", brand: "Corsair", model: "4000D", specs: '{"type":"mid-tower","color":"white"}', stock: 4, price: 135000, description: "Gabinete premium con panel de vidrio templado" },
    { name: "Monitor Samsung Odyssey G5 27\"", category: "monitor", brand: "Samsung", model: "Odyssey G5", specs: '{"size":"27","resolution":"2560x1440","refreshRate":"165Hz","panel":"VA"}', stock: 8, price: 350000, description: "Monitor gaming curvo 1440p 165Hz" },
    { name: "Monitor LG UltraGear 24\"", category: "monitor", brand: "LG", model: "UltraGear 24GN600", specs: '{"size":"24","resolution":"1920x1080","refreshRate":"144Hz","panel":"IPS"}', stock: 10, price: 180000, description: "Monitor gaming 1080p 144Hz IPS" },
  ].map((p) => ({ ...p, imageUrl: productImages[p.category] }));

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  const order = await prisma.order.create({
    data: {
      userId: (await prisma.user.findFirstOrThrow({ where: { email: "user@test.com" } })).id,
      serviceType: "reparacion",
      deviceType: "notebook",
      brand: "HP",
      model: "Pavilion 15",
      problemDescription: "No enciende, solo muestra pantalla negra",
      status: "en_progreso",
      priority: "alta",
      estimatedPrice: 25000,
    },
  });

  await prisma.repair.create({
    data: {
      orderId: order.id,
      technicianId: admin.id,
      diagnostic: "Fallo en el módulo de memoria RAM",
      repairStatus: "en_reparacion",
    },
  });

  await prisma.transaction.create({
    data: {
      type: "ingreso",
      category: "reparacion",
      description: "Reparación notebook HP Pavilion 15",
      amount: 25000,
      createdById: admin.id,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

// Membuat instance Prisma Client secara global
// Penting untuk mencegah inisialisasi berulang saat development
// Ini adalah pola standar Prisma untuk Node.js di lingkungan development
const prisma = new PrismaClient();

// Memastikan bahwa hanya ada satu instance PrismaClient
// di lingkungan development (mencegah error 'already connected')
// @ts-ignore
if (process.env.NODE_ENV === "development" && !global.prisma) {
  // @ts-ignore
  global.prisma = prisma;
}

// @ts-ignore
export default global.prisma || prisma;

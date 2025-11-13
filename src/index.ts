import dotenv from "dotenv";
dotenv.config(); // Memuat variabel dari .env

import express, { type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./auth/auth.routes.ts"; // Import Router Auth

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// --- Middleware CORS (Wajib untuk komunikasi Frontend-Backend)
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
// --- End CORS

// Middleware dasar
app.use(express.json());

// --- Cek Konfigurasi
if (!JWT_SECRET) {
  console.error(
    "🚨 Peringatan: JWT_SECRET belum diatur di .env. Harap tambahkan SECRET!"
  );
}

// --- ROUTE UTAMA ---

// Endpoint Tes
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "FinBoard Backend API is running successfully!" });
});

// ROUTE AUTHENTIKASI (Pemisahan Router)
// Semua endpoint Auth akan diawali dengan /api/v1/auth
app.use("/api/v1/auth", authRouter);

// Mulai Server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(
    `Database URL: ${
      process.env.DATABASE_URL ? "Ditemukan" : "TIDAK DITEMUKAN"
    }`
  );
});

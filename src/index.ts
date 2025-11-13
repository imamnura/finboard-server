import dotenv from "dotenv";
dotenv.config(); // Memuat variabel dari .env
import express, { type Request, type Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001; // Gunakan port 3001 agar tidak bentrok dengan Next.js (3000)

// Middleware dasar
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "FinBoard Backend API is running successfully!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(
    `Database URL: ${
      process.env.DATABASE_URL ? "Ditemukan" : "TIDAK DITEMUKAN"
    }`
  );
});

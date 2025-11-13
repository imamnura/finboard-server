import type { Request, Response } from "express";
import { authService } from "./auth.service.ts";
import prisma from "../utils/prisma.ts";

// --- Interface untuk tipe data Request Body
interface RegisterBody {
  email?: string;
  password?: string;
  name?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

// --- Controller Handlers
export const authController = {
  async register(req: Request<{}, {}, RegisterBody>, res: Response) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, dan nama wajib diisi." });
    }

    try {
      const { user, token } = await authService.registerUser(
        email,
        password,
        name
      );
      // Kirim data pengguna dan token JWT
      return res.status(201).json({
        message: "Registrasi berhasil",
        user,
        token,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("terdaftar")) {
        return res.status(409).json({ message: error.message }); // Conflict
      }
      console.error("Error saat registrasi:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan server saat registrasi." });
    }
  },

  async login(req: Request<{}, {}, LoginBody>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi." });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Email atau password salah." });
      }

      const isPasswordValid = await authService.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email atau password salah." });
      }

      // Hapus password dari objek sebelum membuat token/mengirim response
      const { password: _, ...userData } = user;

      // Buat token sesi
      const token = authService.generateToken(userData);

      return res.status(200).json({
        message: "Login berhasil.",
        user: userData,
        token,
      });
    } catch (error) {
      console.error("Error saat login:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan server saat login." });
    }
  },
};

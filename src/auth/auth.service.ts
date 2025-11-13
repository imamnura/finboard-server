import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.ts";

// Pastikan JWT_SECRET ada di .env Anda
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// --- Interface untuk tipe data
interface AuthData {
  id: string;
  email: string;
  role: string;
}

export const authService = {
  /**
   * Meng-hash password yang masuk
   * @param password Password plain text
   * @returns Password yang sudah di-hash
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },
  /**
   * Membandingkan password yang dimasukkan dengan hash di database
   * @param password Password plain text
   * @param hash Password hash dari database
   * @returns Boolean hasil perbandingan
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
  /**
   * Membuat JSON Web Token (JWT) untuk sesi pengguna
   * @param data Data pengguna yang akan dienkripsi dalam token
   * @returns JWT token
   */
  async generateToken(data: AuthData): Promise<string> {
    // Data yang disimpan dalam payload token
    const payload = {
      id: data.id,
      email: data.email,
      role: data.role,
    };
    // Token kedaluwarsa dalam 7 hari (Wajib dalam aplikasi profesional)
    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
    return token;
  },

  //  Registrasi Pengguna Baru
  async registerUser(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email sudah terdaftar. Gunakan email lain.");
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // Role default: USER
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Buat token setelah registrasi berhasil
    const token = await this.generateToken(newUser);
    return { user: newUser, token };
  },
};

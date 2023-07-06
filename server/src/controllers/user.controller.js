import { v4 as uuidv4 } from "uuid";
import { pool } from "../db/db.js";
import { hash, compare } from "bcrypt";
import { SignJWT } from "jose";
import { config } from "dotenv";
config();

export const register = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    const uuid = uuidv4();
    const userExists = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const hashedPassword = await hash(password, 10);
    if (userExists[0].length > 0) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    } else {
      await pool.query(
        "INSERT INTO users (id_users, name, lastname, email, password, role) VALUES (?,?,?,?,?,?)",
        [uuid, name, lastname, email, hashedPassword, 0]
      );
      res.status(200).json({ msg: "Usuario creado correctamente" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user[0].length > 0) {
      const match = await compare(password, user[0][0].password);
      if (match) {
        const jwtConstructor = new SignJWT({
          id: user[0][0].id_users,
        });
        const encoder = new TextEncoder();
        const jwt = jwtConstructor
          .setProtectedHeader({
            alg: "HS256",
            type: "JWT",
          })
          .setIssuedAt()
          .setExpirationTime("1d")
          .sign(encoder.encode(process.env.SECRET));
        const access = await jwt;
        res.status(200).json({ access });
      } else {
        res.status(400).json({ msg: "Contraseña incorrecta" });
      }
    } else {
      res.status(400).json({ msg: "El usuario no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req;
    const { filename } = req.file;
    const user = await pool.query(
      "SELECT name, lastname, email, profileimg, role FROM users WHERE id_users = ?",
      [id]
    );
    if (user[0].length > 0) {
      await pool.query("UPDATE users SET profileimg = ? WHERE id_users = ?", [
        id,
        filename,
      ]);
      res
        .status(200)
        .json({ msg: "Imagen de perfil actualizada correctamente" });
    } else {
      res.status(400).json({ msg: "El usuario no existe" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

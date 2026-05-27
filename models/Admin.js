import client from "../db/connection.js";
import * as bcrypt from "bcrypt";

export class Admin {
  static async findById(id) {
    const result = await client.queryObject("SELECT * FROM admins WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const result = await client.queryObject("SELECT * FROM admins WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async authenticate(email, password) {
    const admin = await this.findByEmail(email);
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return null;

    return admin;
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password);
    const result = await client.queryObject(
      `INSERT INTO admins (email, password)
       VALUES ($1, $2)
       RETURNING *`,
      [data.email, hashedPassword]
    );
    return result.rows[0];
  }
}

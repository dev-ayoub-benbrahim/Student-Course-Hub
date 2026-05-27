import client from "../db/connection.js";
import * as bcrypt from "bcrypt";

export class Staff {
  static async findAll() {
    const result = await client.queryObject("SELECT * FROM staff ORDER BY name");
    return result.rows;
  }

  static async findById(id) {
    const result = await client.queryObject("SELECT * FROM staff WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const result = await client.queryObject("SELECT * FROM staff WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async authenticate(email, password) {
    const staff = await this.findByEmail(email);
    if (!staff) return null;

    const isValid = await bcrypt.compare(password, staff.password);
    if (!isValid) return null;

    return staff;
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password);
    const result = await client.queryObject(
      `INSERT INTO staff (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.email, hashedPassword]
    );
    return result.rows[0];
  }

  static async getLedModules(staffId) {
    const result = await client.queryObject(
      `SELECT * FROM modules
       WHERE module_leader_id = $1
       ORDER BY code`,
      [staffId]
    );
    return result.rows;
  }

  static async getProgrammes(staffId) {
    const result = await client.queryObject(
      `SELECT DISTINCT p.*, COUNT(DISTINCT m.id) as module_count
       FROM programmes p
       JOIN programme_modules pm ON p.id = pm.programme_id
       JOIN modules m ON m.id = pm.module_id
       WHERE m.module_leader_id = $1
       GROUP BY p.id
       ORDER BY p.title`,
      [staffId]
    );
    return result.rows;
  }
}

import client from "../db/connection.ts";

export class Module {
  static async findAll(filters: any = {}) {
    const query = `SELECT m.*, s.name as module_leader_name, s.email as module_leader_email 
                   FROM modules m 
                   LEFT JOIN staff s ON m.module_leader_id = s.id 
                   ORDER BY m.code`;
    const result = await client.queryObject(query);
    return result.rows;
  }

  static async findById(id: number) {
    const result = await client.queryObject(
      `SELECT m.*, s.name as module_leader_name, s.email as module_leader_email 
       FROM modules m 
       LEFT JOIN staff s ON m.module_leader_id = s.id 
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: any) {
    const result = await client.queryObject(
      `INSERT INTO modules (code, title, credits, description, module_leader_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.code, data.title, data.credits, data.description, data.module_leader_id]
    );
    return result.rows[0];
  }

  static async update(id: number, data: any) {
    const result = await client.queryObject(
      `UPDATE modules 
       SET code = $1, title = $2, credits = $3, description = $4, module_leader_id = $5
       WHERE id = $6
       RETURNING *`,
      [data.code, data.title, data.credits, data.description, data.module_leader_id, id]
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    await client.queryObject("DELETE FROM programme_modules WHERE module_id = $1", [id]);
    await client.queryObject("DELETE FROM modules WHERE id = $1", [id]);
  }

  static async getProgrammes(moduleId: number) {
    const result = await client.queryObject(
      `SELECT p.*, pm.year 
       FROM programmes p
       JOIN programme_modules pm ON p.id = pm.programme_id
       WHERE pm.module_id = $1
       ORDER BY p.title`,
      [moduleId]
    );
    return result.rows;
  }
}
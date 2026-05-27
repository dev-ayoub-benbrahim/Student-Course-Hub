import client from "../db/connection.ts";

export class Programme {
  static async findAll(filters: any = {}) {
    let query = `SELECT p.*,
      s.name as programme_leader_name,
      s.email as programme_leader_email,
      (SELECT COUNT(*) FROM programme_modules pm WHERE pm.programme_id = p.id) as module_count
      FROM programmes p
      LEFT JOIN staff s ON p.programme_leader_id = s.id
      WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.level) {
      query += ` AND p.level = $${paramIndex}`;
      params.push(filters.level);
      paramIndex++;
    }

    if (filters.published !== undefined) {
      query += ` AND p.published = $${paramIndex}`;
      params.push(filters.published);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
      paramIndex += 2;
    }

    query += " ORDER BY p.title";

    const result = await client.queryObject(query, params);
    return result.rows;
  }

  static async findById(id: number) {
    const result = await client.queryObject(
      `SELECT p.*, s.name as programme_leader_name, s.email as programme_leader_email 
       FROM programmes p 
       LEFT JOIN staff s ON p.programme_leader_id = s.id 
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: any) {
    const result = await client.queryObject(
      `INSERT INTO programmes (title, level, description, programme_leader_id, image_url, published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.title, data.level, data.description, data.programme_leader_id, data.image_url, data.published]
    );
    return result.rows[0];
  }

  static async update(id: number, data: any) {
    const result = await client.queryObject(
      `UPDATE programmes
       SET title = $1, level = $2, description = $3, programme_leader_id = $4, image_url = $5, published = $6
       WHERE id = $7
       RETURNING *`,
      [data.title, data.level, data.description, data.programme_leader_id, data.image_url, data.published ?? true, id]
    );
    return result.rows[0];
  }

  static async setPublished(id: number, published: boolean) {
    await client.queryObject(
      "UPDATE programmes SET published = $1 WHERE id = $2",
      [published, id]
    );
  }

  static async delete(id: number) {
    await client.queryObject("DELETE FROM programme_modules WHERE programme_id = $1", [id]);
    await client.queryObject("DELETE FROM student_interests WHERE programme_id = $1", [id]);
    await client.queryObject("DELETE FROM programmes WHERE id = $1", [id]);
  }

  static async getModules(programmeId: number) {
    const result = await client.queryObject(
      `SELECT m.*, pm.year, s.name as module_leader_name, s.email as module_leader_email
       FROM modules m
       JOIN programme_modules pm ON m.id = pm.module_id
       LEFT JOIN staff s ON m.module_leader_id = s.id
       WHERE pm.programme_id = $1
       ORDER BY pm.year, m.code`,
      [programmeId]
    );
    return result.rows;
  }

  static async getInterestedCount(programmeId: number) {
    const result = await client.queryObject(
      `SELECT COUNT(*) as count 
       FROM student_interests 
       WHERE programme_id = $1`,
      [programmeId]
    );
    return parseInt((result.rows[0] as any).count) || 0;
  }

  static async getInterestedStudents(programmeId: number) {
    const result = await client.queryObject(
      `SELECT s.*, si.registered_at 
       FROM students s
       JOIN student_interests si ON s.id = si.student_id
       WHERE si.programme_id = $1
       ORDER BY si.registered_at DESC`,
      [programmeId]
    );
    return result.rows;
  }

  static async assignModule(programmeId: number, moduleId: number, year: number) {
    await client.queryObject(
      `INSERT INTO programme_modules (programme_id, module_id, year)
       VALUES ($1, $2, $3)
       ON CONFLICT (programme_id, module_id) DO UPDATE SET year = $3`,
      [programmeId, moduleId, year]
    );
  }

  static async removeModule(programmeId: number, moduleId: number) {
    await client.queryObject(
      `DELETE FROM programme_modules 
       WHERE programme_id = $1 AND module_id = $2`,
      [programmeId, moduleId]
    );
  }
}
import client from "../db/connection.ts";

export class Student {
  static async findAll() {
    const result = await client.queryObject("SELECT * FROM students ORDER BY name");
    return result.rows;
  }

  static async findById(id: number) {
    const result = await client.queryObject("SELECT * FROM students WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string) {
    const result = await client.queryObject("SELECT * FROM students WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async create(data: any) {
    const result = await client.queryObject(
      `INSERT INTO students (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.email]
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    await client.queryObject("DELETE FROM student_interests WHERE student_id = $1", [id]);
    await client.queryObject("DELETE FROM students WHERE id = $1", [id]);
  }

  static async findAllWithProgrammes(studentId: number) {
    const result = await client.queryObject(
      `SELECT p.*, si.registered_at 
       FROM programmes p
       JOIN student_interests si ON p.id = si.programme_id
       WHERE si.student_id = $1
       ORDER BY si.registered_at DESC`,
      [studentId]
    );
    return result.rows;
  }

  static async hasInterest(studentId: number, programmeId: number) {
    const result = await client.queryObject(
      `SELECT * FROM student_interests 
       WHERE student_id = $1 AND programme_id = $2`,
      [studentId, programmeId]
    );
    return result.rows.length > 0;
  }

  static async registerInterest(studentId: number, programmeId: number) {
    await client.queryObject(
      `INSERT INTO student_interests (student_id, programme_id, registered_at)
       VALUES ($1, $2, NOW())`,
      [studentId, programmeId]
    );
  }

  static async withdrawInterest(studentId: number, programmeId: number) {
    await client.queryObject(
      `DELETE FROM student_interests
       WHERE student_id = $1 AND programme_id = $2`,
      [studentId, programmeId]
    );
  }

  static async findAllWithInterestSummary() {
    const result = await client.queryObject(
      `SELECT s.id, s.name, s.email, s.created_at,
         COUNT(si.programme_id) AS interest_count,
         COALESCE(string_agg(p.title, ', ' ORDER BY p.title), '') AS interested_programmes
       FROM students s
       LEFT JOIN student_interests si ON s.id = si.student_id
       LEFT JOIN programmes p ON si.programme_id = p.id
       GROUP BY s.id, s.name, s.email, s.created_at
       ORDER BY s.name`
    );
    return result.rows;
  }
}
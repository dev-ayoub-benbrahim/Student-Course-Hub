import { Client } from "postgres";

const client = new Client({
  user: "postgres",
  password: "ayoubess",
  database: "student_course_hub",
  hostname: "localhost",
  port: 5432,
});

await client.connect();

export default client;

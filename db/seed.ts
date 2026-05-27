import client from "./connection.ts";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

console.log("Starting seed...");

// Clear existing data
await client.queryArray("DELETE FROM student_interests");
await client.queryArray("DELETE FROM programme_modules");
await client.queryArray("DELETE FROM students");
await client.queryArray("DELETE FROM modules");
await client.queryArray("DELETE FROM programmes");
await client.queryArray("DELETE FROM staff");
await client.queryArray("DELETE FROM admins");

console.log("Cleared existing data");

// Seed staff
const staff = [
  { name: "Dr. Sarah Johnson", email: "s.johnson@dmu.ac.uk" },
  { name: "Prof. James Taylor", email: "j.taylor@dmu.ac.uk" },
  { name: "Dr. Emily Williams", email: "e.williams@dmu.ac.uk" },
  { name: "Dr. Michael Brown", email: "m.brown@dmu.ac.uk" },
  { name: "Prof. Lisa Davis", email: "l.davis@dmu.ac.uk" },
  { name: "Dr. David Wilson", email: "d.wilson@dmu.ac.uk" },
];

const staffPassword = await hash("staff123");
const staffIds = [];

for (const s of staff) {
  const result = await client.queryObject(
    "INSERT INTO staff (name, email, password) VALUES ($1, $2, $3) RETURNING id",
    [s.name, s.email, staffPassword]
  );
  staffIds.push((result.rows[0] as any).id);
}

console.log("Seeded staff");

// Seed programmes
const programmes = [
  {
    title: "BSc Computer Science",
    level: "undergraduate",
    description: "Comprehensive computer science programme covering software development, algorithms, and system design.",
    programme_leader_id: staffIds[0],
    image_url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop&auto=format",
  },
  {
    title: "BSc Cybersecurity",
    level: "undergraduate",
    description: "Specialized programme in cybersecurity, ethical hacking, and network security.",
    programme_leader_id: staffIds[1],
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format",
  },
  {
    title: "BSc Web Development",
    level: "undergraduate",
    description: "Modern web development technologies including frontend, backend, and full-stack development.",
    programme_leader_id: staffIds[2],
    image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format",
  },
  {
    title: "MSc Artificial Intelligence",
    level: "postgraduate",
    description: "Advanced AI programme covering machine learning, deep learning, and natural language processing.",
    programme_leader_id: staffIds[3],
    image_url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop&auto=format",
  },
  {
    title: "MSc Data Science",
    level: "postgraduate",
    description: "Master data analysis, visualization, and big data technologies for business insights.",
    programme_leader_id: staffIds[4],
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format",
  },
  {
    title: "MSc Web Development",
    level: "postgraduate",
    description: "Advanced web technologies, cloud computing, and modern development practices.",
    programme_leader_id: staffIds[5],
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&auto=format",
  },
];

const programmeIds = [];

for (const p of programmes) {
  const result = await client.queryObject(
    "INSERT INTO programmes (title, level, description, programme_leader_id, image_url, published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [p.title, p.level, p.description, p.programme_leader_id, p.image_url, true]
  );
  programmeIds.push((result.rows[0] as any).id);
}

console.log("Seeded programmes");

// Seed modules
const modules = [
  { code: "CTEC3451", title: "Development Project", credits: 30, description: "Final year individual development project", module_leader_id: staffIds[0] },
  { code: "IMAT3104", title: "Machine Learning", credits: 15, description: "Supervised and unsupervised learning algorithms", module_leader_id: staffIds[3] },
  { code: "IMAT3611", title: "Deep Learning", credits: 15, description: "Neural networks and deep learning architectures", module_leader_id: staffIds[3] },
  { code: "CTEC3110", title: "Secure Programming", credits: 15, description: "Security best practices and secure coding", module_leader_id: staffIds[1] },
  { code: "CTEC3911", title: "Ethical Hacking", credits: 15, description: "Penetration testing and ethical hacking techniques", module_leader_id: staffIds[1] },
  { code: "IMAT2204", title: "Databases and Web Apps", credits: 15, description: "Database design and web application development", module_leader_id: staffIds[2] },
  { code: "CTEC2121", title: "Data Structures", credits: 15, description: "Advanced data structures and algorithms", module_leader_id: staffIds[0] },
  { code: "CTEC2907", title: "Big Data", credits: 15, description: "Big data technologies and distributed systems", module_leader_id: staffIds[4] },
  { code: "CTEC3451M", title: "MSc Development Project", credits: 90, description: "Advanced research and development project", module_leader_id: staffIds[5] },
  { code: "CTEC3705", title: "Web Development", credits: 15, description: "Modern web development with frameworks", module_leader_id: staffIds[2] },
  { code: "CTEC3401", title: "Cloud Computing", credits: 15, description: "Cloud platforms and distributed systems", module_leader_id: staffIds[5] },
  { code: "IMAT3906", title: "Natural Language Processing", credits: 15, description: "NLP techniques and applications", module_leader_id: staffIds[3] },
  { code: "IMAT3907", title: "Computer Vision", credits: 15, description: "Image processing and computer vision", module_leader_id: staffIds[3] },
  { code: "CTEC3701", title: "Mobile App Development", credits: 15, description: "iOS and Android development", module_leader_id: staffIds[2] },
];

const moduleIds = [];

for (const m of modules) {
  const result = await client.queryObject(
    "INSERT INTO modules (code, title, credits, description, module_leader_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [m.code, m.title, m.credits, m.description, m.module_leader_id]
  );
  moduleIds.push((result.rows[0] as any).id);
}

console.log("Seeded modules");

// Link programmes and modules
const programmeModules = [
  { programme_id: programmeIds[0], module_id: moduleIds[0], year: 3 },
  { programme_id: programmeIds[0], module_id: moduleIds[6], year: 2 },
  { programme_id: programmeIds[0], module_id: moduleIds[9], year: 2 },
  { programme_id: programmeIds[0], module_id: moduleIds[5], year: 2 },
  { programme_id: programmeIds[1], module_id: moduleIds[3], year: 2 },
  { programme_id: programmeIds[1], module_id: moduleIds[4], year: 3 },
  { programme_id: programmeIds[1], module_id: moduleIds[6], year: 2 },
  { programme_id: programmeIds[2], module_id: moduleIds[5], year: 2 },
  { programme_id: programmeIds[2], module_id: moduleIds[9], year: 3 },
  { programme_id: programmeIds[2], module_id: moduleIds[13], year: 3 },
  { programme_id: programmeIds[3], module_id: moduleIds[8], year: 1 },
  { programme_id: programmeIds[3], module_id: moduleIds[1], year: 1 },
  { programme_id: programmeIds[3], module_id: moduleIds[2], year: 1 },
  { programme_id: programmeIds[3], module_id: moduleIds[11], year: 1 },
  { programme_id: programmeIds[3], module_id: moduleIds[12], year: 1 },
  { programme_id: programmeIds[4], module_id: moduleIds[8], year: 1 },
  { programme_id: programmeIds[4], module_id: moduleIds[1], year: 1 },
  { programme_id: programmeIds[4], module_id: moduleIds[7], year: 1 },
  { programme_id: programmeIds[5], module_id: moduleIds[8], year: 1 },
  { programme_id: programmeIds[5], module_id: moduleIds[9], year: 1 },
  { programme_id: programmeIds[5], module_id: moduleIds[10], year: 1 },
];

for (const pm of programmeModules) {
  await client.queryArray(
    "INSERT INTO programme_modules (programme_id, module_id, year) VALUES ($1, $2, $3)",
    [pm.programme_id, pm.module_id, pm.year]
  );
}

console.log("Linked programmes and modules");

// Seed students
const students = [
  { name: "Alice Smith", email: "alice@student.dmu.ac.uk" },
  { name: "Bob Johnson", email: "bob@student.dmu.ac.uk" },
  { name: "Charlie Brown", email: "charlie@student.dmu.ac.uk" },
  { name: "Diana Prince", email: "diana@student.dmu.ac.uk" },
  { name: "Eve Wilson", email: "eve@student.dmu.ac.uk" },
];

const studentIds = [];

for (const s of students) {
  const result = await client.queryObject(
    "INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id",
    [s.name, s.email]
  );
  studentIds.push((result.rows[0] as any).id);
}

console.log("Seeded students");

// Seed student interests
await client.queryArray(
  "INSERT INTO student_interests (student_id, programme_id, registered_at) VALUES ($1, $2, NOW())",
  [studentIds[0], programmeIds[0]]
);
await client.queryArray(
  "INSERT INTO student_interests (student_id, programme_id, registered_at) VALUES ($1, $2, NOW())",
  [studentIds[1], programmeIds[1]]
);
await client.queryArray(
  "INSERT INTO student_interests (student_id, programme_id, registered_at) VALUES ($1, $2, NOW())",
  [studentIds[2], programmeIds[3]]
);

console.log("Seeded student interests");

// Seed admin
const adminPassword = await hash("admin123");
await client.queryArray(
  "INSERT INTO admins (email, password) VALUES ($1, $2)",
  ["admin@dmu.ac.uk", adminPassword]
);

console.log("Seeded admin");
console.log("\nSeed complete!");
console.log("Admin: admin@dmu.ac.uk / admin123");
console.log("Staff: any staff email / staff123");

Deno.exit(0);
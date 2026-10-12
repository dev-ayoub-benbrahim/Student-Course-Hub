# Student Course Hub:

A full-stack MVC application for university programme management and student interest registration, demonstrating modern web development practices, security architecture, and responsive design.

---

## Project Overview

Student Course Hub is a role-based web application where students can browse university programmes, explore modules, and register their interests; staff manage their assigned programmes and modules; and admins have full control over programmes, modules, and student data.

The application implements a complete Model-View-Controller (MVC) architecture with session-based authentication, data validation, and multiple layers of security—demonstrating production-ready code suitable for professional evaluation.


---

## Key Features

### Security & Validation
- **SQL Injection Prevention:** Parameterized queries with `$1` placeholders across all database operations
- **XSS Prevention:** Input sanitization converting dangerous HTML characters to safe entities
- **Password Security:** Bcrypt hashing with salt for secure credential storage
- **Data Validation:** Schema-based validation with composable validator functions
- **Session Management:** HttpOnly cookies prevent JavaScript access; session IDs stored server-side

### Architecture
- **MVC Pattern:** Clear separation between Models (data), Controllers (logic), Views (presentation)
- **Middleware Pipeline:** Authentication, security, and flash message middleware
- **RESTful Routes:** Organized routing by feature (student, admin, staff, auth)
- **Hybrid Rendering:** Server-side rendering for SEO + client-side updates for speed

### Front-End
- **Responsive Design:** CSS Grid with `auto-fill` and `minmax()` for automatic column layout
- **Container Queries:** Components respond to their own width, not just viewport
- **Accessibility:** Semantic HTML, ARIA labels, visible focus states, proper colour contrast
- **Modern CSS:** Custom properties, CSS variables for maintainability, mobile-first approach

### User Experience
- **Flash Messages:** Immediate feedback for user actions (success, error, warning, info)
- **Live Search:** Debounced fetch-based search with DOM updates
- **Async Interest Registration:** Form submission without page reload
- **Error Handling:** Graceful fallbacks and inline validation error messages

---

## Technical Implementation

### Parameterized Queries

Separates SQL code from user input to prevent injection:

```javascript
static async findById(id) {
  const result = await client.queryObject(
    `SELECT * FROM programmes WHERE id = $1`,
    [id]  // Value passed separately
  );
  return result.rows[0] || null;
}
```

### Input Sanitization

Converts dangerous HTML characters to safe entities:

```javascript
export function sanitizeInput(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
```

### Password Hashing

Bcrypt with automatic salt generation:

```javascript
static async authenticate(email, password) {
  const admin = await this.findByEmail(email);
  if (!admin) return null;
  
  const isValid = await bcrypt.compare(password, admin.password);
  return isValid ? admin : null;
}
```

### Session Security

HttpOnly flag prevents JavaScript access:

```javascript
await ctx.cookies.set("session_id", sessionId, {
  httpOnly: true,    // Protects from XSS
  maxAge: 60 * 60 * 24  // 24-hour expiration
});
```

### Data Model

7 relational tables with proper constraints: `admins`, `staff`, `programmes`, `modules`, `programme_modules`, `students`, `student_interests`. Each table enforces referential integrity and data constraints, with indexes on frequently queried columns for performance.

---

## Learning Outcomes Demonstrated

### Routing & MVC Pattern
- Implemented a complete MVC architecture with clear separation of concerns
- Demonstrated how routing directs requests to the correct controller
- Showed how controllers orchestrate models and views

### Security
- **SQL Injection Prevention:** Parameterized queries using `$1` placeholders
- **XSS Prevention:** Input sanitization of user-submitted data
- **Authentication:** Session-based login with bcrypt password hashing
- **Authorization:** Role-based access control (Admin, Staff, Student)
- **Secure Cookies:** HttpOnly flag prevents XSS access to session IDs

### Data Validation
- Schema-based validation with composable validator functions
- Per-field error messages for user feedback
- Validation at point of entry (controllers) before data processing

### Front-End Design
- **Responsive Design:** CSS Grid with automatic column calculation
- **Container Queries:** Modern CSS for component-level responsiveness
- **Accessibility:** Semantic HTML, ARIA labels, visible focus states
- **Usability:** Fast feedback, live search, async form submission

### Database Design
- Relational schema with proper primary/foreign keys
- Normalized tables (7 tables, no redundancy)
- Constraints enforcing data integrity (CHECK, UNIQUE, NOT NULL)

---

## Getting Started

### Prerequisites
- Deno 2.8.0+
- PostgreSQL 12+ (running locally)
- Node.js 18+ (for bcrypt)

### Installation

1. Create the database in PostgreSQL
```sql
CREATE DATABASE student_course_hub;
```

2. Configure database connection in `db/connection.ts`
```typescript
const dbConfig = {
  user: "postgres",
  password: "your_postgres_password",
  database: "student_course_hub",
  hostname: "127.0.0.1",
  port: 5432,
};
```

3. Install dependencies
```bash
deno cache --lock=deno.lock main.js
```

4. Set up database (creates schema & seeds data)
```bash
deno task seed
```

5. Start the development server
```bash
deno task dev
```

The application will be available at **http://localhost:8000**

### Test Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@dmu.ac.uk | admin123 |
| Staff | dr.smith@dmu.ac.uk | staff123 |
| Student | (public access) | (no login) |

### Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Deno 2.8.0 | Secure JavaScript runtime |
| Framework | Oak | Web framework & routing |
| Database | PostgreSQL | Relational data storage |
| Auth | Bcrypt | Password hashing |
| Frontend | HTML/CSS/JavaScript | Semantic markup, responsive design |

---

**Author:** Ayoub Ben Brahim  
**GitHub:** [@dev-ayoub-benbrahim](https://github.com/dev-ayoub-benbrahim)  
**LinkedIn:** [ayoub-ben-brahim-846aa6387](https://www.linkedin.com/in/ayoub-ben-brahim-846aa6387)

-- Drop existing tables
DROP TABLE IF EXISTS student_interests CASCADE;
DROP TABLE IF EXISTS programme_modules CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS programmes CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create staff table
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create admins table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create programmes table
CREATE TABLE programmes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('undergraduate', 'postgraduate')),
  description TEXT,
  programme_leader_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  image_url VARCHAR(500),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create modules table
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  description TEXT,
  module_leader_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create programme_modules junction table
CREATE TABLE programme_modules (
  programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT 1 CHECK (year >= 1 AND year <= 5),
  PRIMARY KEY (programme_id, module_id)
);

-- Create students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student_interests junction table
CREATE TABLE student_interests (
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, programme_id)
);

-- Create indexes for better performance
CREATE INDEX idx_programmes_level ON programmes(level);
CREATE INDEX idx_programmes_published ON programmes(published);
CREATE INDEX idx_modules_code ON modules(code);
CREATE INDEX idx_student_interests_programme ON student_interests(programme_id);
CREATE INDEX idx_programme_modules_programme ON programme_modules(programme_id);
CREATE INDEX idx_programme_modules_module ON programme_modules(module_id);
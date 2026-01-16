import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "your_password",
  database: "ecommerce_db",
  port: 5432,
});

export default pool;

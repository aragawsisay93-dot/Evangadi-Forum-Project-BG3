// // db/dbConfig.js
// import mysql from "mysql2/promise";

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // ✅ make default export so controllers can do: import db from ...
// export default pool;

// export async function testDBConnection() {
//   const conn = await pool.getConnection();
//   conn.release();
//   return true;
// }

// db/dbConfig.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 🚨 no localhost fallback
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // ✅ Recommended for Hostinger
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

// 🔎 DB health check helper
export async function testDBConnection() {
  const conn = await pool.getConnection();
  conn.release();
  return true;
}

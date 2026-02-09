import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

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

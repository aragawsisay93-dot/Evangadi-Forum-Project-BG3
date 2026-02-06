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
// import mysql from "mysql2/promise";

// // ============================
// // MySQL connection pool
// // ============================
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT || 3306),

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,

//   // ✅ helps avoid dropped connections on cloud hosts
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });

// // ✅ default export so controllers can do: import db from ...
// export default pool;

// // ============================
// // DB health check
// // ============================
// export async function testDBConnection() {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     await conn.ping(); // ✅ actually test connectivity
//     return true;
//   } catch (err) {
//     console.error("❌ Database connection error:", err.message);
//     throw err;
//   } finally {
//     if (conn) conn.release();
//   }
// }

import mysql from "mysql2/promise";

// ============================
// MySQL connection pool (Railway)
// ============================
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export pool
export default pool;

// ============================
// DB health check
// ============================
export async function testDBConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    return true;
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

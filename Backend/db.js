require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Connecté à PostgreSQL (Neon)");
});

pool.on("error", (err) => {
  console.error("❌ Erreur PostgreSQL :", err.message);
});

module.exports = pool;
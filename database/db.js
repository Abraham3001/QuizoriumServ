const { Sequelize } = require("sequelize");

let dbUrl = process.env.DATABASE_URL;

// Si Render te diera un scheme raro, lo normalizamos
if (dbUrl) {
  dbUrl = dbUrl.replace(/^dpg-postgresql:\/\//, "postgresql://");
  dbUrl = dbUrl.replace(/^postgres:\/\//, "postgresql://");
}

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

module.exports = sequelize;

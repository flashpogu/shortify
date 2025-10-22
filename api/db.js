import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://shortener_4jag_user:mwx81aAAqmP8z6XnytwPJiGTnTiEaGeP@dpg-d3sao93uibrs73eq6eu0-a.singapore-postgres.render.com/shortener_4jag",
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

export default pool;

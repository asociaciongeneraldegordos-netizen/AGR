const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const { rows } = await client.query('SELECT "Nombre", "Peso" FROM "Usuarios" ORDER BY "Peso" DESC NULLS LAST, "Nombre" ASC');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    try { await client.end(); } catch {}
  }
};

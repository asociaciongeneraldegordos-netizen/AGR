const { Client } = require('pg');
const bcrypt = require('bcryptjs');

function parseBody(event) {
  const ctype = (event.headers && (event.headers['content-type'] || event.headers['Content-Type'])) || '';
  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString() : (event.body || '');
  if (ctype.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  if (ctype.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    return Object.fromEntries(params.entries());
  }
  // Fallback: try JSON first then querystring
  try { return JSON.parse(raw); } catch {}
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { nombre, correo, peso, contrasena } = parseBody(event);

  if (!nombre || !correo || !contrasena) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos obligatorios' }) };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const hash = await bcrypt.hash(contrasena, 10);
    const pesoInt = peso ? parseInt(peso, 10) : null;

    await client.query(
      'INSERT INTO "Usuarios" ("Nombre", "Correo", "Peso", "PasswordHash") VALUES ($1, $2, $3, $4)',
      [nombre, correo, pesoInt, hash]
    );

    // If it's a classic form POST, redirect back with ok=1
    const wantsHTML = !((event.headers['accept'] || '').includes('application/json'));
    if (wantsHTML) {
      return {
        statusCode: 303,
        headers: { Location: '/Login/register.html?ok=1' },
        body: ''
      };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    const status = /duplicate/i.test(msg) ? 409 : 500;
    return { statusCode: status, body: JSON.stringify({ error: msg }) };
  } finally {
    try { await client.end(); } catch {}
  }
};

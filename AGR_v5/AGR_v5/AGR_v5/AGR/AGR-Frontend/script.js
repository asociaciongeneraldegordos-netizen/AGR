function mostrar(seccion) {
  document.getElementById('inicio').classList.add('hidden');
  document.getElementById('reglas').classList.add('hidden');
  document.getElementById(seccion).classList.remove('hidden');
}

function filtrarReglas() {
  const filtro = document.getElementById('buscador').value.toLowerCase();
  const reglas = document.querySelectorAll('#reglas-lista div');
  reglas.forEach(regla => {
    regla.style.display = regla.textContent.toLowerCase().includes(filtro) ? 'block' : 'none';
  });
}

// ======== CRUD via Netlify Functions (Neon) ========

// Insertar nuevo usuario desde JS (opcional; el formulario HTML ya POSTea a /register)
async function agregarMiembro(nombre, peso, correo, contrasena) {
  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ nombre, peso, correo, contrasena })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    await obtenerMiembros(); // refresca leaderboard
  } catch (err) {
    console.error('Error insertando en Neon:', err);
  }
}

// Obtener lista de miembros (Nombre, Peso) desde función serverless
async function obtenerMiembros() {
  try {
    const res = await fetch('/members');
    if (!res.ok) throw new Error('Error HTTP ' + res.status);
    const miembros = await res.json();
    renderLeaderboard(miembros);
  } catch (err) {
    console.error('Error consultando Neon:', err);
  }
}


// Insertar nuevo usuario
async function agregarMiembro(nombre, peso, correo, passwordHash) {
  try {
    await window.sql`
      INSERT INTO "Usuarios" ("Nombre", "Correo", "Peso", "PasswordHash")
      VALUES (${nombre}, ${correo}, ${peso}, ${passwordHash})
    `;
    console.log("Usuario insertado en Neon!");
    await obtenerMiembros(); // refresca leaderboard
  } catch (err) {
    console.error("Error insertando en Neon:", err);
  }
}

// Consultar usuarios ordenados por peso
async function obtenerMiembros() {
  try {
    const filas = await window.sql`
      SELECT "Id", "Nombre", "Peso"
      FROM "Usuarios"
      ORDER BY "Peso" DESC
    `;
    renderLeaderboard(filas);
  } catch (err) {
    console.error("Error consultando Neon:", err);
  }
}

// Renderizar leaderboard
function renderLeaderboard(members) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  members.forEach((m, idx) => {
    const tr = document.createElement("tr");
    const pos = document.createElement("td");
    const nom = document.createElement("td");
    const pes = document.createElement("td");
    pos.textContent = String(idx + 1);
    nom.textContent = m.Nombre || "";
    pes.textContent = (m.Peso != null ? m.Peso : "") + " kg";
    tr.appendChild(pos);
    tr.appendChild(nom);
    tr.appendChild(pes);
    tbody.appendChild(tr);
  });
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ok") === "1") {
      console.log("Registro agregado al leaderboard.");
    }
  } catch (e) {}
  obtenerMiembros(); // carga datos reales de Neon al inicio
});

// Exponer funciones si se necesitan globalmente
window.AGR = Object.assign(window.AGR || {}, { agregarMiembro, obtenerMiembros });
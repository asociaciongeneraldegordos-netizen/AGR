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

// ======== CRUD via Netlify Functions ========

// Insertar nuevo usuario (usa la function /register)
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
    console.log("Registro agregado al leaderboard.");
    await obtenerMiembros(); // refresca leaderboard
  } catch (err) {
    console.error('Error insertando en Neon vía Netlify:', err);
  }
}

// Obtener lista de miembros desde la function /members
async function obtenerMiembros() {
  try {
    const res = await fetch('/members');
    if (!res.ok) throw new Error('Error HTTP ' + res.status);
    const miembros = await res.json();
    renderLeaderboard(miembros);
  } catch (err) {
    console.error('Error consultando Neon vía Netlify:', err);
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
  obtenerMiembros(); // carga datos al inicio desde Netlify Functions
});

// Exponer funciones si se necesitan globalmente
window.AGR = Object.assign(window.AGR || {}, { agregarMiembro, obtenerMiembros });
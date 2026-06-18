/* ================================================
   BRUMA CAFÉ — api.js
   js/api.js — COMPARTIDO
   ================================================ */

const BASE = 'http://localhost:8081';

/* ── Sesión ── */
function getToken()    { return sessionStorage.getItem('token'); }
function getRol()      { return sessionStorage.getItem('rol'); }
function getUsuario()  { return sessionStorage.getItem('usuario'); }
function setToken(t)   { sessionStorage.setItem('token', t); }
function setRol(r)     { sessionStorage.setItem('rol', r); }
function setUsuario(n) { sessionStorage.setItem('usuario', n); }

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

/* ── Cabeceras ── */
function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  };
}

/* ── Fetch base ── */
async function api(method, path, body = null) {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  if (res.status === 401) { cerrarSesion(); return; }
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Error en el servidor');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ── AUTH — Luana ── */
async function login(username, password) {
  const res = await fetch(BASE + '/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Usuario o contraseña incorrectos');
  return res.json();
}

/* ── USUARIOS — Luana ── */
const Usuarios = {
  listar:     ()      => api('GET',    '/usuarios'),
  ver:        (id)    => api('GET',    `/usuarios/${id}`),
  crear:      (data)  => api('POST',   '/usuarios', data),
  actualizar: (id, d) => api('PUT',    `/usuarios/${id}`, d),
  eliminar:   (id)    => api('DELETE', `/usuarios/${id}`),
};

/* ── PRODUCTOS — Nicole ── */
const Productos = {
  listar:          ()        => api('GET',    '/productos'),
  ver:             (id)      => api('GET',    `/productos/${id}`),
  crear:           (data)    => api('POST',   '/productos', data),
  actualizar:      (id, d)   => api('PUT',    `/productos/${id}`, d),
  actualizarStock: (id, qty) => api('PUT',    `/productos/${id}/stock?stock=${qty}`),
  eliminar:        (id)      => api('DELETE', `/productos/${id}`),
};

/* ── VENTAS — Alelhy ── */
const Ventas = {
  listar:    ()     => api('GET',  '/ventas'),
  ver:       (id)   => api('GET',  `/ventas/${id}`),
  registrar: (data) => api('POST', '/ventas', data),
  anular:    (id)   => api('PUT',  `/ventas/${id}/anular`),
};

/* ── CAJA — Alelhy ── */
const Caja = {
  estado:       ()           => api('GET',  '/caja/estado'),
  movimientos:  ()           => api('GET',  '/caja/movimientos'),
  abrir:        (monto)      => api('POST', `/caja/abrir?montoInicial=${monto}`),
  cerrar:       ()           => api('POST', '/caja/cerrar'),
  registrarGasto: (monto, desc) =>
    api('POST', `/caja/gasto?monto=${monto}&descripcion=${encodeURIComponent(desc)}`),
};

/* ── COMPRAS — Karla ── */
const Compras = {
  listar: ()     => api('GET',  '/compras'),
  ver:    (id)   => api('GET',  `/compras/${id}`),
  crear:  (data) => api('POST', '/compras', data),
};

/* ── PROVEEDORES — Karla ── */
const Proveedores = {
  listar:     ()      => api('GET',    '/proveedores'),
  crear:      (data)  => api('POST',   '/proveedores', data),
  actualizar: (id, d) => api('PUT',    `/proveedores/${id}`, d),
  eliminar:   (id)    => api('DELETE', `/proveedores/${id}`),
};

/* ── GASTOS — Mell ── */
const Gastos = {
  listar:   ()     => api('GET',    '/gastos'),
  fijos:    ()     => api('GET',    '/gastos/fijos'),
  crear:    (data) => api('POST',   '/gastos', data),
  anular:   (id)   => api('PUT',    `/gastos/anular/${id}`),
  eliminar: (id)   => api('DELETE', `/gastos/${id}`),
};

/* ── REPORTES — Mell ── */
const Reportes = {
  totalGastos:  ()  => api('GET', '/reportes/gastos'),
  totalFijos:   ()  => api('GET', '/reportes/gastos-fijos'),
  porMetodo:    (m) => api('GET', `/reportes/metodo/${m}`),
  ventasHoy:    ()  => api('GET', '/reportes/ventas/hoy'),
  ventasSemana: ()  => api('GET', '/reportes/ventas/semana'),
};
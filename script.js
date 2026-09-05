/* ---------- DATOS DE LA CARTA ----------
   Verificado en Google Maps (sección "Destacadas") e Instagram/prensa el
   05-09-2026: nombres y categorías reales. No hay carta con precios
   confirmada (sin PDF, sin menú online con tarifas) — por eso ningún
   item trae precio ('p'); se muestra "Consultar" en vez de inventar un
   número. Cada item admite opcionalmente 'img' con una foto real. */
const MENU = {
  cafe: {
    label: 'Café',
    groups: [{ title: 'Café tostado propio', items: [
      { n: 'Espresso', d: 'Grano tostado con menos de una semana de anticipación' },
      { n: 'Americano' },
      { n: 'Cappuccino' },
      { n: 'Latte', img: 'fotos/barra-cafe.jpg' },
      { n: 'Latte con Quequito de Zanahoria', d: 'Uno de los destacados reales de la casa' },
      { n: 'Café frapé' },
      { n: 'Agregado leche sin lactosa, soya o arroz', v: 1, d: 'Todas las preparaciones admiten cambio de leche' },
    ]}]
  },
  pasteleria: {
    label: 'Pastelería',
    groups: [
      { title: 'Clásicos', items: [
        { n: 'Golden Pie', d: 'Destacado real de la carta', img: 'fotos/vitrina.jpg' },
        { n: 'Medialuna Rellena Con Crema Pastelera' },
        { n: 'Donas' },
      ]},
      { title: 'Para todos', items: [
        { n: 'Queques veganos', v: 1 },
        { n: 'Pasteles sin azúcar' },
        { n: 'Carrot cake sin gluten', v: 1 },
      ]}
    ]
  },
  sandwiches: {
    label: 'Sándwiches y Ensaladas',
    groups: [{ title: 'Para almorzar', items: [
      { n: 'Sándwich de salmón', d: '"Exquisito", según reseñas reales de Google' },
      { n: 'Sándwiches (opción vegetariana disponible)', v: 1 },
      { n: 'Ensaladas' },
    ]}]
  },
  te: {
    label: 'Té e Infusiones',
    /* Único rubro con precios 100% confirmados: fotografiados directo
       de la pizarra de precios del local el 05-09-2026. */
    table: true,
    sizes: ['S · 200ml', 'M · 300ml', 'L · 400ml', 'XL · 500ml'],
    rows: [
      ['Té Chai', 1850, 1950, 2150, 2350],
      ['Té Negro', 1750, 1850, 2050, 2250],
      ['Té Blanco', 1750, 1850, 2050, 2250],
      ['Té Rojo', 1750, 1850, 2050, 2250],
      ['Té Oolong', 1750, 1850, 2050, 2250],
      ['Té Jazmín', 1750, 1850, 2050, 2250],
      ['Té Verde', 1750, 1850, 2050, 2250],
      ['Matcha Latte', 2400, 2550, 2950, 3150],
      ['Chai Latte', 2200, 2450, 2700, 3050],
    ]
  }
};

const money = n => n ? '$' + n.toLocaleString('es-CL') : 'Consultar';

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');
const catKeys = Object.keys(MENU);

catKeys.forEach((key, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i===0 ? ' active':'');
  tab.textContent = MENU[key].label;
  tab.addEventListener('click', () => showTab(key));
  tab.dataset.key = key;
  tabsEl.appendChild(tab);

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i===0 ? ' active':'');
  panel.id = 'panel-' + key;

  if(MENU[key].table){
    const hint = document.createElement('p');
    hint.className = 'price-table-hint';
    hint.textContent = 'Desliza para ver todos los tamaños →';
    panel.appendChild(hint);
    const wrap = document.createElement('div');
    wrap.className = 'price-table-wrap';
    const table = document.createElement('table');
    table.className = 'price-table';
    const thead = document.createElement('tr');
    thead.innerHTML = '<th></th>' + MENU[key].sizes.map(s => `<th>${s}</th>`).join('');
    table.appendChild(thead);
    MENU[key].rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="name">${row[0]}</td>` + row.slice(1).map(p => `<td class="mono">${money(p)}</td>`).join('');
      table.appendChild(tr);
    });
    wrap.appendChild(table);
    panel.appendChild(wrap);
    const note = document.createElement('p');
    note.className = 'menu-note';
    note.textContent = 'Precios confirmados en el local (pizarra de tés) — el único rubro de la carta con tarifa oficial.';
    panel.appendChild(note);
    panelsEl.appendChild(panel);
    return;
  }

  MENU[key].groups.forEach(group => {
    if(group.title && MENU[key].groups.length > 1){
      const h = document.createElement('div');
      h.style.cssText = 'font-family:"IBM Plex Mono",monospace;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--oxblood);margin:28px 0 12px;font-weight:700;';
      h.textContent = group.title;
      panel.appendChild(h);
    }
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.addEventListener('click', () => openModal(item));

      if(item.img){
        const photo = document.createElement('div');
        photo.className = 'menu-item-photo';
        const photoImg = document.createElement('img');
        photoImg.src = item.img;
        photoImg.alt = item.n;
        photo.appendChild(photoImg);
        row.appendChild(photo);
      }

      const textWrap = document.createElement('div');
      textWrap.className = 'menu-item-text';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = item.n;
      textWrap.appendChild(nameSpan);

      if(item.v){
        const vegTag = document.createElement('span');
        vegTag.className = 'veg-tag';
        vegTag.textContent = 'INFO';
        textWrap.appendChild(vegTag);
      }

      if(item.d){
        const descDiv = document.createElement('div');
        descDiv.className = 'desc';
        descDiv.textContent = item.d;
        textWrap.appendChild(descDiv);
      }

      const priceDiv = document.createElement('div');
      priceDiv.className = 'price mono';
      priceDiv.textContent = money(item.p);

      row.appendChild(textWrap);
      row.appendChild(priceDiv);
      grid.appendChild(row);
    });
    panel.appendChild(grid);
  });
  panelsEl.appendChild(panel);
});

function showTab(key){
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

/* ---------- MODAL PRODUCTO ---------- */
let currentItem = null;
function openModal(item){
  currentItem = item;
  document.getElementById('modalName').textContent = item.n;
  document.getElementById('modalPrice').textContent = money(item.p);
  document.getElementById('modalDesc').textContent = item.d || 'Preparado del día en Café del 10.';
  const photoWrap = document.getElementById('modalPhoto');
  if(item.img){
    photoWrap.innerHTML = '';
    const photoImg = document.createElement('img');
    photoImg.src = item.img;
    photoImg.alt = item.n;
    photoWrap.appendChild(photoImg);
    photoWrap.style.display = 'block';
  } else {
    photoWrap.style.display = 'none';
  }
  toggleModal(true);
}
document.getElementById('modalAddBtn').addEventListener('click', () => {
  addToCart(currentItem);
  toggleModal(false);
  toggleCart(true);
});
function toggleModal(open){ document.getElementById('modalOverlay').classList.toggle('open', open); }

/* ---------- CARRITO ---------- */
let cart = [];
function addToCart(item){
  const existing = cart.find(c => c.n === item.n);
  if(existing){ existing.qty++; } else { cart.push({...item, qty:1}); }
  renderCart();
}
function changeQty(name, delta){
  const line = cart.find(c => c.n === name);
  if(!line) return;
  line.qty += delta;
  if(line.qty <= 0) cart = cart.filter(c => c.n !== name);
  renderCart();
}
function renderCart(){
  const linesEl = document.getElementById('cartLines');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const totalQty = cart.reduce((s,c) => s + c.qty, 0);
  countEl.textContent = totalQty;
  if(cart.length === 0){
    linesEl.innerHTML = '<p class="cart-empty">Todavía no agregaste nada.</p>';
    totalEl.textContent = 'A consultar';
    return;
  }
  linesEl.innerHTML = '';
  cart.forEach(line => {
    const div = document.createElement('div');
    div.className = 'cart-line';
    div.innerHTML = `
      <div>
        <div class="name">${line.n}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" data-name="${line.n}" data-delta="-1">−</button>
          <span class="mono">${line.qty}</span>
          <button class="qty-btn" data-name="${line.n}" data-delta="1">+</button>
        </div>
      </div>
      <div class="price mono">${money(line.p)}</div>
    `;
    linesEl.appendChild(div);
  });
  totalEl.textContent = 'A consultar';
  linesEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => changeQty(btn.dataset.name, parseInt(btn.dataset.delta)));
  });
}
document.getElementById('cartBtn').addEventListener('click', () => toggleCart(true));
document.getElementById('cartCloseBtn').addEventListener('click', () => toggleCart(false));
function toggleCart(open){ document.getElementById('cartOverlay').classList.toggle('open', open); }

document.getElementById('modalCloseBtn').addEventListener('click', () => toggleModal(false));
[document.getElementById('cartOverlay'), document.getElementById('modalOverlay')].forEach(ov => {
  ov.addEventListener('click', (e) => { if(e.target === ov) ov.classList.remove('open'); });
});

/* ---------- NAV MÓVIL Y NAVEGACIÓN POR PESTAÑAS ---------- */
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

const panels = document.querySelectorAll('.tab-panel');
function goToTab(tabId){
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('navLinks').classList.remove('open');
}

document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToTab(el.dataset.tab);
  });
});

/* ---------- INDICADOR ABIERTO/CERRADO EN VIVO
   Lun-Mié 7:30-19:45, Jue-Vie 8:00-19:45, Sáb-Dom cerrado ---------- */
function updateOpenStatus(dotId, textId){
  const dot = document.getElementById(dotId);
  const text = document.getElementById(textId);
  if(!dot || !text) return;
  const now = new Date();
  const day = now.getDay(); // 0 dom ... 6 sáb
  const minutes = now.getHours()*60 + now.getMinutes();
  let isOpen = false;
  if(day >= 1 && day <= 3){ isOpen = minutes >= (7*60+30) && minutes < (19*60+45); }
  else if(day === 4 || day === 5){ isOpen = minutes >= (8*60) && minutes < (19*60+45); }
  text.textContent = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
  dot.classList.toggle('closed', !isOpen);
}
updateOpenStatus('statusDot', 'statusText');
updateOpenStatus('statusDot2', 'statusText2');

/* ---------- PANTALLA DE CARGA (rápida, <1s) ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 350);
});

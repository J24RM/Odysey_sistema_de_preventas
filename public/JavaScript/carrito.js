let csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
const loader = document.getElementById('page-loader');

function actualizarSubtotal() {
  const filas = document.getElementsByClassName('product-row');
  let subtotal = 0;
  let totalQty = 0;

  for (let i = 0; i < filas.length; i++) {
    const precio = parseFloat(filas[i].dataset.precio);
    const input = document.getElementById('qty-' + filas[i].dataset.id);
    const qty = parseInt(input.value) || 0;

    subtotal += precio * qty;
    totalQty += qty;
  }


  document.getElementById('subtotal-display').textContent =
    '$ ' + subtotal.toLocaleString('es-MX');

  let total = subtotal * 1.16;

  document.getElementById('total-display').textContent =
    '$ ' + total.toLocaleString('es-MX');


  document.getElementById('qty-display').textContent =
    'Cantidad de productos: ' + totalQty;
}

// Boton
async function cambiarCantidad(idProducto, delta) {
  const input = document.getElementById('qty-' + idProducto);
  let cantidadActual = parseInt(input.value) || 1;

  const nuevaCantidad = cantidadActual + delta;
  if (nuevaCantidad < 1) return;

  await enviarCantidad(idProducto, nuevaCantidad);
}

// Texto
async function inputCantidad(idProducto) {
  const input = document.getElementById('qty-' + idProducto);
  let cantidad = parseInt(input.value);

  if (!cantidad || cantidad < 1) cantidad = 1;

  await enviarCantidad(idProducto, cantidad);
}

async function enviarCantidad(idProducto, cantidad) {
  const input = document.getElementById('qty-' + idProducto);

  const res = await fetch('/cart/items/' + idProducto, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'csrf-token': csrfToken
    },
    body: JSON.stringify({ cantidad_ingresada: cantidad }),
  });

  const data = await res.json();

  if (data.csrfToken) csrfToken = data.csrfToken;

  if (data.cartCount !== undefined) {
          
        actualizarCartBadge(data.cartCount);
  }

  if (!res.ok) {
    mostrarError('No se pudo actualizar el producto');
    return;
  }

  if (data.eliminado) {
    const nombre = document.getElementById('nombre-' + idProducto).textContent;
    mostrarEliminado(nombre, idProducto);
    document.getElementById('row-' + idProducto).remove();
  } else {
    const precio = parseFloat(document.getElementById('row-' + idProducto).dataset.precio);

    input.value = data.nuevaCantidad;

    document.getElementById('price-' + idProducto).textContent =
      '$ ' + (precio * data.nuevaCantidad).toLocaleString('es-MX');
  }

  actualizarSubtotal();
}

async function eliminarProducto(idProducto) {
  const res = await fetch('/cart/items/' + idProducto, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'csrf-token': csrfToken
      },
    body: JSON.stringify({ cantidad_ingresada: 0 }),
  });

  const data = await res.json();

  if (data.csrfToken) csrfToken = data.csrfToken;

  if (!res.ok) {
            mostrarError('No se pudo eliminar el producto');
            return;
  }

  if (data.eliminado) {
  const nombre = document.getElementById('nombre-' + idProducto).textContent;
  mostrarEliminado(nombre, idProducto);
  actualizarSubtotal();
}
}

function mostrarEliminado(nombre, idProducto) {
  const aviso = document.createElement('div');
  aviso.id = 'aviso-' + idProducto;
  aviso.className = 'text-sm text-gray-600 py-3 px-4 bg-white rounded-xl border border-gray-200 mb-2';
  aviso.innerHTML = `<a href='cliente/product/${idProducto}' class='text-blue-500 underline'> ${nombre}</a>  fue eliminado del carrito.`;

  document.getElementById('row-' + idProducto).replaceWith(aviso);
}

// Error
function mostrarError(mensaje) {
    const contenedor = document.getElementById('error-container');
    contenedor.textContent = mensaje;
    contenedor.classList.remove('hidden');
    setTimeout(() => contenedor.classList.add('hidden'), 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarSubtotal();
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
        mostrarError(decodeURIComponent(params.get('error')));
        window.history.replaceState({}, '', '/cart');
    }
});

function showLoader() {
  loader.style.opacity = '1';
  loader.style.pointerEvents = 'all';
}

function hideLoader() {
  loader.style.opacity = '0';
  loader.style.pointerEvents = 'none';
}

document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
    if (!link) return;
      if (
          link.target === '_blank' ||
          link.href.startsWith('javascript') ||
          link.href.includes('#') ||    
          link.getAttribute('onclick')
    ) return;
  showLoader();
});

document.addEventListener('submit', function(e) {
  showLoader();
});

window.addEventListener('pageshow', hideLoader);
window.addEventListener('load', hideLoader);


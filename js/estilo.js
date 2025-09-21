document.addEventListener('DOMContentLoaded', () => {
  console.log("Bienvenido a Sacude Tech 🚀 (JS cargado)");

  // Buscar el modal (soporta varios nombres que usamos antes)
  const modal = document.getElementById('imgModal')
             || document.getElementById('lightbox')
             || document.querySelector('.modal')
             || document.querySelector('.lightbox');

  // Buscar la imagen dentro del modal si existe
  let modalImg = document.getElementById('modalImg')
              || document.getElementById('lightbox-img')
              || (modal ? modal.querySelector('img') : null);

  // Botón de cerrar dentro del modal
  const closeBtn = modal ? (modal.querySelector('.close') || modal.querySelector('.close-btn')) : null;

  // Todas las imágenes ampliables
  const zoomables = Array.from(document.querySelectorAll('.zoomable'));

  if (!modal) {
    console.error('ERROR: No se encontró el elemento modal en el DOM. Asegurate de tener un <div id="imgModal" class="modal">...</div>');
    return;
  }

  if (zoomables.length === 0) {
    console.warn('AVISO: No se encontraron imágenes con la clase .zoomable');
  }

  // Si no existe una <img> dentro del modal, la creamos para mayor compatibilidad
  if (!modalImg) {
    modalImg = document.createElement('img');
    modalImg.id = 'modalImg';
    modalImg.className = 'modal-content';
    modal.appendChild(modalImg);
  }

  let currentIndex = -1;
  const ANIM_MS = 260; // debe concordar con tu CSS de transición/animación

  function openAt(index) {
    const img = zoomables[index];
    if (!img) return;
    const src = img.dataset.full || img.src;
    modalImg.src = src;
    modalImg.alt = img.alt || '';
    // mostrar modal
    modal.style.display = 'flex';
    // forzar frame para poder animar con clase
    requestAnimationFrame(() => modal.classList.add('open'));
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // esperar animación antes de ocultar
    setTimeout(() => {
      modal.style.display = 'none';
      modalImg.src = '';
      currentIndex = -1;
    }, ANIM_MS + 20);
  }

  // Abrir al click en cada imagen
  zoomables.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openAt(i);
    });
  });

  // Cerrar con el botón X si existe
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  } else {
    console.warn('Aviso: el modal no tiene botón .close, el cierre por clic fuera/ESC sigue activo.');
  }

  // Cerrar si clickeás fuera de la imagen (en el fondo del modal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Teclado: Esc = cerrar, flechas = navegar
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < zoomables.length - 1) openAt(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) openAt(currentIndex - 1);
    }
  });

});

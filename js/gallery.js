/**
 * Portfolio Screenshot Gallery / Lightbox
 * Abderrahmane Imlouli Portfolio
 * 
 * Features:
 *  - Modal lightbox with prev/next navigation
 *  - Thumbnail strip
 *  - Counter (n / total)
 *  - Keyboard navigation (← → Escape)
 *  - Click-outside to close
 *  - Touch/swipe support on mobile
 *  - Background scroll lock while open
 *  - Lazy loading
 */

(function () {
  'use strict';

  /* ─── Build modal DOM once ─────────────────────────── */
  const modal = document.createElement('div');
  modal.id = 'gallery-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Screenshot gallery');
  modal.innerHTML = `
    <div class="gm-backdrop"></div>
    <div class="gm-container">
      <button class="gm-close" aria-label="Close gallery">✕</button>
      <div class="gm-main">
        <button class="gm-nav gm-prev" aria-label="Previous screenshot">&#8249;</button>
        <div class="gm-image-wrap">
          <img class="gm-img" src="" alt="" loading="lazy" />
        </div>
        <button class="gm-nav gm-next" aria-label="Next screenshot">&#8250;</button>
      </div>
      <div class="gm-meta">
        <span class="gm-counter"></span>
        <span class="gm-caption"></span>
      </div>
      <div class="gm-thumbs"></div>
    </div>
  `;
  document.body.appendChild(modal);

  /* ─── State ─────────────────────────────────────────── */
  let currentImages = [];
  let currentIndex  = 0;

  /* ─── DOM refs ──────────────────────────────────────── */
  const $backdrop  = modal.querySelector('.gm-backdrop');
  const $container = modal.querySelector('.gm-container');
  const $img       = modal.querySelector('.gm-img');
  const $prev      = modal.querySelector('.gm-prev');
  const $next      = modal.querySelector('.gm-next');
  const $counter   = modal.querySelector('.gm-counter');
  const $caption   = modal.querySelector('.gm-caption');
  const $thumbs    = modal.querySelector('.gm-thumbs');
  const $close     = modal.querySelector('.gm-close');

  /* ─── Open / Close ──────────────────────────────────── */
  function openGallery(images, startIndex) {
    currentImages = images;
    currentIndex  = startIndex || 0;
    renderThumbStrip();
    goTo(currentIndex);
    modal.classList.add('gm-active');
    document.body.style.overflow = 'hidden';
    $close.focus();
  }

  function closeGallery() {
    modal.classList.remove('gm-active');
    document.body.style.overflow = '';
    $img.src = '';
  }

  /* ─── Navigation ────────────────────────────────────── */
  function goTo(idx) {
    const total = currentImages.length;
    currentIndex = ((idx % total) + total) % total;
    const item   = currentImages[currentIndex];

    $img.classList.add('gm-img-loading');
    $img.src = item.src;
    $img.alt = item.caption || 'Screenshot';
    $img.onload = () => $img.classList.remove('gm-img-loading');

    $counter.textContent = `${currentIndex + 1} / ${total}`;
    $caption.textContent  = item.caption || '';

    /* Highlight active thumbnail */
    $thumbs.querySelectorAll('.gm-thumb').forEach((t, i) => {
      t.classList.toggle('gm-thumb-active', i === currentIndex);
    });

    /* Show/hide nav arrows */
    $prev.style.visibility = total > 1 ? 'visible' : 'hidden';
    $next.style.visibility = total > 1 ? 'visible' : 'hidden';
  }

  /* ─── Thumb strip ───────────────────────────────────── */
  function renderThumbStrip() {
    $thumbs.innerHTML = '';
    if (currentImages.length <= 1) return;

    currentImages.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'gm-thumb';
      btn.setAttribute('aria-label', `View screenshot ${i + 1}`);
      const img = document.createElement('img');
      img.src     = item.src;
      img.alt     = item.caption || `Screenshot ${i + 1}`;
      img.loading = 'lazy';
      btn.appendChild(img);
      btn.addEventListener('click', () => goTo(i));
      $thumbs.appendChild(btn);
    });
  }

  /* ─── Events ────────────────────────────────────────── */
  $prev.addEventListener('click', () => goTo(currentIndex - 1));
  $next.addEventListener('click', () => goTo(currentIndex + 1));
  $close.addEventListener('click', closeGallery);
  $backdrop.addEventListener('click', closeGallery);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('gm-active')) return;
    if (e.key === 'Escape')      closeGallery();
    if (e.key === 'ArrowLeft')   goTo(currentIndex - 1);
    if (e.key === 'ArrowRight')  goTo(currentIndex + 1);
  });

  /* ─── Touch / swipe ─────────────────────────────────── */
  let touchStartX = 0;
  $container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  $container.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
  }, { passive: true });

  /* ─── Public API ─────────────────────────────────────── */
  window.PortfolioGallery = {
    open: openGallery,
    close: closeGallery
  };

  /* ─── Wire up gallery trigger buttons ──────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-gallery]');
    if (!btn) return;
    const galleryId    = btn.getAttribute('data-gallery');
    const startIndex   = parseInt(btn.getAttribute('data-gallery-index') || '0', 10);
    const galleryItems = [];

    document.querySelectorAll(`[data-gallery-item="${galleryId}"]`).forEach(el => {
      galleryItems.push({
        src:     el.getAttribute('data-src'),
        caption: el.getAttribute('data-caption') || ''
      });
    });

    if (galleryItems.length) openGallery(galleryItems, startIndex);
  });

})();

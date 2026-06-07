// ===== Mobile-Menü =====
const burger = document.getElementById('burger');
const mainnav = document.getElementById('mainnav');
burger?.addEventListener('click', () => mainnav.classList.toggle('open'));

// ===== Bestseller-Carousel =====
const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function scrollAmount() {
  const card = track?.querySelector('.product');
  if (!card) return 320;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 22;
  return card.getBoundingClientRect().width + gap;
}
prevBtn?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
nextBtn?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

// ===== Warenkorb-Zähler =====
const cartBadge = document.getElementById('cartBadge');
let cartCount = 0;
document.querySelectorAll('.addbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    cartBadge.textContent = cartCount;
    btn.textContent = '✓';
    setTimeout(() => (btn.textContent = '🛒'), 900);
  });
});

// ===== Newsletter (Demo) =====
document.querySelector('.newsletter__form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  if (input.value) {
    input.value = '';
    input.placeholder = 'Danke! Du bist angemeldet ✓';
  }
});

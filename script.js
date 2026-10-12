const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dot')];
const heroIndex = document.querySelector('.hero-index');
let activeSlide = 0;
let slideTimer;

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === activeSlide));
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
    dot.setAttribute('aria-selected', i === activeSlide ? 'true' : 'false');
  });
  heroIndex.textContent = `0${activeSlide + 1} / 0${slides.length}`;
}

function restartSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => setSlide(activeSlide + 1), 6500);
}

dots.forEach((dot) => dot.addEventListener('click', () => { setSlide(Number(dot.dataset.slideTo)); restartSlider(); }));
restartSlider();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const cartDrawer = document.querySelector('.cart-drawer');
const cartBackdrop = document.querySelector('.cart-backdrop');
const cartItems = document.querySelector('.cart-items');
const cartEmpty = document.querySelector('.cart-empty');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total');
const cart = [];
const money = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

function renderCart() {
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-item"><div><p>${item.name}</p><small>1 sản phẩm</small></div><div><p>${money(item.price)}</p><button type="button" data-remove="${index}">Xóa</button></div></div>`).join('');
  cartEmpty.style.display = cart.length ? 'none' : 'flex';
  cartCount.textContent = cart.length;
  cartTotal.textContent = money(cart.reduce((total, item) => total + item.price, 0));
  cartItems.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}

function toggleCart(open) {
  cartDrawer.classList.toggle('open', open);
  cartBackdrop.classList.toggle('show', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
}

document.querySelectorAll('[data-cart-open]').forEach((button) => button.addEventListener('click', () => toggleCart(true)));
document.querySelector('.close-cart').addEventListener('click', () => toggleCart(false));
cartBackdrop.addEventListener('click', () => toggleCart(false));
document.querySelectorAll('.quick-add').forEach((button) => button.addEventListener('click', () => {
  cart.push({ name: button.dataset.product, price: Number(button.dataset.price) });
  renderCart();
  showToast(`${button.dataset.product} đã được thêm vào giỏ hàng.`);
}));
document.querySelector('.checkout-button').addEventListener('click', () => showToast(cart.length ? 'Cảm ơn bạn — thanh toán sẽ được kết nối ở bước tiếp theo.' : 'Giỏ hàng đang trống.'));

const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));

document.querySelectorAll('.category-pill').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.category-pill').forEach((pill) => pill.classList.toggle('active', pill === button));
  document.querySelectorAll('.product-card').forEach((card) => {
    card.style.display = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter ? '' : 'none';
  });
}));

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const note = document.querySelector('#form-note');
  note.textContent = 'Cảm ơn bạn — VHB sẽ gửi những điều thật nhẹ nhàng đến inbox của bạn.';
  note.style.color = '#f0b6b2';
  event.target.reset();
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => observer.observe(section));

renderCart();

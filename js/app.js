/**
 * Chapter & Verse Bookstore - Main Application
 */
(function () {
  'use strict';

  // --- State ---
  let cart = [];
  let activeFilter = 'all';
  let searchQuery = '';

  // --- DOM References ---
  const featuredGrid = document.querySelector('.book-grid');
  const catalogGrid = document.querySelector('.catalog-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('book-search');
  const noResults = document.querySelector('.no-results');
  const cartBtn = document.querySelector('.cart-btn');
  const cartCount = document.querySelector('.cart-count');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsEl = document.querySelector('.cart-items');
  const cartTotalEl = document.querySelector('.cart-total-amount');
  const cartCheckout = document.querySelector('.cart-checkout');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const newsletterForm = document.querySelector('.newsletter-form');

  // --- Render Helpers ---

  function createStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '\u2605';
    if (half) stars += '\u00BD';
    return stars + ` (${rating})`;
  }

  function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${Math.random() * 0.3}s`;

    card.innerHTML = `
      <div class="book-cover" style="background-color: ${book.color}">
        ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ''}
      </div>
      <div class="book-info">
        <span class="book-genre">${book.genre}</span>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-rating" aria-label="Rating: ${book.rating} out of 5">${createStars(book.rating)}</div>
        <div class="book-bottom">
          <span class="book-price">$${book.price.toFixed(2)}</span>
          <button class="add-to-cart" data-id="${book.id}" aria-label="Add ${book.title} to cart">Add to Cart</button>
        </div>
      </div>
    `;

    return card;
  }

  // --- Rendering ---

  function renderFeatured() {
    const featured = BOOKS.filter(b => b.featured);
    featuredGrid.innerHTML = '';
    featured.forEach(book => {
      featuredGrid.appendChild(createBookCard(book));
    });
  }

  function renderCatalog() {
    let filtered = BOOKS;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.genre === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }

    catalogGrid.innerHTML = '';

    if (filtered.length === 0) {
      noResults.hidden = false;
    } else {
      noResults.hidden = true;
      filtered.forEach(book => {
        catalogGrid.appendChild(createBookCard(book));
      });
    }
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      cartCheckout.disabled = true;
    } else {
      cartItemsEl.innerHTML = '';
      cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <div class="cart-item-color" style="background-color: ${item.color}"></div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.title} from cart">&times;</button>
        `;
        cartItemsEl.appendChild(el);
      });
      cartCheckout.disabled = false;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
    cartCount.setAttribute('aria-label', `${cart.length} items in cart`);
  }

  // --- Toast ---

  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // --- Cart Actions ---

  function addToCart(bookId) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;

    cart.push({ ...book });
    renderCart();
    showToast(`"${book.title}" added to cart`);
  }

  function removeFromCart(bookId) {
    const idx = cart.findIndex(item => item.id === bookId);
    if (idx !== -1) {
      const title = cart[idx].title;
      cart.splice(idx, 1);
      renderCart();
      showToast(`"${title}" removed from cart`);
    }
  }

  function openCart() {
    cartSidebar.classList.add('active');
    cartSidebar.setAttribute('aria-hidden', 'false');
    cartOverlay.classList.add('active');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cartClose.focus();
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    cartSidebar.setAttribute('aria-hidden', 'true');
    cartOverlay.classList.remove('active');
    cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartBtn.focus();
  }

  // --- Event Listeners ---

  // Delegate add-to-cart clicks
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      const id = parseInt(addBtn.dataset.id, 10);
      addToCart(id);
    }

    const removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id, 10);
      removeFromCart(id);
    }
  });

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.dataset.filter;
      renderCatalog();
    });
  });

  // Search
  let searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = this.value.trim();
      renderCatalog();
    }, 250);
  });

  // Cart open/close
  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
      closeCart();
    }
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    primaryNav.classList.toggle('open');
  });

  // Close mobile nav on link click
  primaryNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    });
  });

  // Newsletter form
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
      showToast('Thanks for subscribing!');
      this.reset();
    }
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- Initialize ---
  renderFeatured();
  renderCatalog();
  renderCart();
})();

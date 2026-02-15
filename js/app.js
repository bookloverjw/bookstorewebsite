/**
 * Chapter & Verse Bookstore - Main Application
 */
(function () {
  'use strict';

  // --- Cart Persistence ---
  const CART_KEY = 'cv_cart';
  const THEME_KEY = 'cv_theme';

  function loadCart() {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // localStorage unavailable
    }
  }

  // --- State ---
  let cart = loadCart();
  let activeFilter = 'all';
  let activeFormat = 'all';
  let searchQuery = '';
  let currentSort = 'rating-desc';
  let currentPage = 1;
  let perPage = 8;

  // --- DOM References ---
  const featuredGrid = document.querySelector('.book-grid');
  const catalogGrid = document.querySelector('.catalog-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const formatBtns = document.querySelectorAll('.format-btn');
  const searchInput = document.getElementById('book-search');
  const sortSelect = document.getElementById('book-sort');
  const perPageSelect = document.getElementById('per-page');
  const noResults = document.querySelector('.no-results');
  const catalogShowing = document.querySelector('.catalog-showing');
  const paginationNav = document.querySelector('.pagination');
  const paginationPrev = document.querySelector('.pagination-prev');
  const paginationNext = document.querySelector('.pagination-next');
  const paginationInfo = document.querySelector('.pagination-info');
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
  const themeToggle = document.querySelector('.theme-toggle');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close');

  // --- Dark Mode ---
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }

  initTheme();
  themeToggle.addEventListener('click', toggleTheme);

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
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${book.title} by ${book.author} - $${book.price.toFixed(2)}`);
    card.dataset.bookId = book.id;
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

  function sortBooks(books, sortKey) {
    var sorted = books.slice();
    switch (sortKey) {
      case 'price-asc':
        sorted.sort(function (a, b) { return a.price - b.price; });
        break;
      case 'price-desc':
        sorted.sort(function (a, b) { return b.price - a.price; });
        break;
      case 'title-asc':
        sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
        break;
      case 'title-desc':
        sorted.sort(function (a, b) { return b.title.localeCompare(a.title); });
        break;
      case 'rating-desc':
        sorted.sort(function (a, b) { return b.rating - a.rating; });
        break;
      default:
        break;
    }
    return sorted;
  }

  function getFilteredBooks() {
    let filtered = BOOKS;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.genre === activeFilter);
    }

    if (activeFormat !== 'all') {
      filtered = filtered.filter(b => b.format === activeFormat);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }

    return sortBooks(filtered, currentSort);
  }

  function renderCatalog() {
    var filtered = getFilteredBooks();
    var totalFiltered = filtered.length;

    catalogGrid.innerHTML = '';

    if (totalFiltered === 0) {
      noResults.hidden = false;
      catalogShowing.textContent = '';
      paginationNav.hidden = true;
    } else {
      noResults.hidden = true;

      var totalPages;
      var pageItems;
      if (perPage === 'all' || perPage >= totalFiltered) {
        totalPages = 1;
        currentPage = 1;
        pageItems = filtered;
      } else {
        totalPages = Math.ceil(totalFiltered / perPage);
        if (currentPage > totalPages) currentPage = totalPages;
        var start = (currentPage - 1) * perPage;
        var end = start + perPage;
        pageItems = filtered.slice(start, end);
      }

      pageItems.forEach(function (book) {
        catalogGrid.appendChild(createBookCard(book));
      });

      // Update "Showing X-Y of Z" text
      if (totalPages > 1) {
        var startNum = (currentPage - 1) * perPage + 1;
        var endNum = Math.min(currentPage * perPage, totalFiltered);
        catalogShowing.textContent = 'Showing ' + startNum + '\u2013' + endNum + ' of ' + totalFiltered + ' books';
      } else {
        catalogShowing.textContent = 'Showing ' + totalFiltered + ' book' + (totalFiltered !== 1 ? 's' : '');
      }

      // Update pagination controls
      if (totalPages > 1) {
        paginationNav.hidden = false;
        paginationInfo.textContent = 'Page ' + currentPage + ' of ' + totalPages;
        paginationPrev.disabled = currentPage <= 1;
        paginationNext.disabled = currentPage >= totalPages;
      } else {
        paginationNav.hidden = true;
      }
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

    cart.push({ id: book.id, title: book.title, price: book.price, color: book.color });
    saveCart();
    renderCart();
    showToast(`"${book.title}" added to cart`);
  }

  function removeFromCart(bookId) {
    const idx = cart.findIndex(item => item.id === bookId);
    if (idx !== -1) {
      const title = cart[idx].title;
      cart.splice(idx, 1);
      saveCart();
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

  // --- Book Detail Modal ---

  function openBookModal(bookId) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('modal-cover').style.backgroundColor = book.color;
    document.getElementById('modal-genre').textContent = book.genre;
    document.getElementById('modal-title').textContent = book.title;
    document.getElementById('modal-author').textContent = `by ${book.author}`;
    document.getElementById('modal-rating').innerHTML = createStars(book.rating);
    document.getElementById('modal-description').textContent = book.description;
    document.getElementById('modal-price').textContent = `$${book.price.toFixed(2)}`;

    // Meta info
    const metaEl = document.getElementById('modal-meta');
    metaEl.innerHTML = `
      <span><strong>${book.pages}</strong> Pages</span>
      <span><strong>${book.published}</strong> Published</span>
      <span><strong>${book.isbn}</strong> ISBN</span>
    `;

    // Add to cart button
    const modalAddBtn = document.getElementById('modal-add-to-cart');
    modalAddBtn.onclick = function () {
      addToCart(book.id);
    };

    // Reviews
    const reviewsEl = document.getElementById('modal-reviews');
    reviewsEl.innerHTML = '<h3>Reader Reviews</h3>';
    if (book.reviews && book.reviews.length > 0) {
      book.reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.innerHTML = `
          <div class="review-header">
            <span class="review-name">${review.name}</span>
            <span class="review-rating">${'\u2605'.repeat(review.rating)} (${review.rating}/5)</span>
          </div>
          <p class="review-text">${review.text}</p>
        `;
        reviewsEl.appendChild(reviewDiv);
      });
    }

    // Related books (same genre, different book)
    const relatedEl = document.getElementById('modal-related');
    const relatedGrid = relatedEl.querySelector('.modal-related-grid');
    const related = BOOKS.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 4);
    relatedEl.innerHTML = '<h3>You Might Also Like</h3><div class="modal-related-grid"></div>';
    const grid = relatedEl.querySelector('.modal-related-grid');

    related.forEach(rel => {
      const card = document.createElement('div');
      card.className = 'related-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${rel.title}`);
      card.dataset.bookId = rel.id;
      card.innerHTML = `
        <div class="related-cover" style="background-color: ${rel.color}"></div>
        <div class="related-title">${rel.title}</div>
        <div class="related-author">${rel.author}</div>
      `;
      card.addEventListener('click', function () {
        openBookModal(rel.id);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openBookModal(rel.id);
        }
      });
      grid.appendChild(card);
    });

    // Show modal
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- Event Listeners ---

  // Delegate clicks
  document.addEventListener('click', function (e) {
    // Add to cart (stop propagation to prevent opening modal)
    const addBtn = e.target.closest('.add-to-cart');
    if (addBtn) {
      e.stopPropagation();
      const id = parseInt(addBtn.dataset.id, 10);
      addToCart(id);
      return;
    }

    const removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      const id = parseInt(removeBtn.dataset.id, 10);
      removeFromCart(id);
      return;
    }

    // Book card click opens modal
    const bookCard = e.target.closest('.book-card');
    if (bookCard && bookCard.dataset.bookId) {
      const id = parseInt(bookCard.dataset.bookId, 10);
      openBookModal(id);
      return;
    }
  });

  // Book card keyboard activation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const bookCard = e.target.closest('.book-card');
      if (bookCard && bookCard.dataset.bookId && e.target === bookCard) {
        e.preventDefault();
        const id = parseInt(bookCard.dataset.bookId, 10);
        openBookModal(id);
      }
    }
  });

  // Modal close
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  // Filter buttons (genre)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.dataset.filter;
      currentPage = 1;
      renderCatalog();
    });
  });

  // Format filter buttons
  formatBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      formatBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeFormat = this.dataset.format;
      currentPage = 1;
      renderCatalog();
    });
  });

  // Sort
  sortSelect.addEventListener('change', function () {
    currentSort = this.value;
    currentPage = 1;
    renderCatalog();
  });

  // Per-page
  perPageSelect.addEventListener('change', function () {
    perPage = this.value === 'all' ? 'all' : parseInt(this.value, 10);
    currentPage = 1;
    renderCatalog();
  });

  // Pagination
  paginationPrev.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      renderCatalog();
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }
  });

  paginationNext.addEventListener('click', function () {
    currentPage++;
    renderCatalog();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });

  // Search
  let searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = this.value.trim();
      currentPage = 1;
      renderCatalog();
    }, 250);
  });

  // Cart open/close
  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalOverlay.classList.contains('active')) {
        closeModal();
      } else if (cartSidebar.classList.contains('active')) {
        closeCart();
      }
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

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        // SW registration failed silently
      });
    });
  }

  // --- Initialize ---
  renderFeatured();
  renderCatalog();
  renderCart();
})();

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Page Load & Layout', () => {
  test('loads homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Chapter & Verse Bookstore');
  });

  test('displays the hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    await expect(page.locator('#hero-heading')).toContainText('Discover Your Next');
  });

  test('displays navigation links', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('.nav-link');
    await expect(navLinks).toHaveCount(4);
  });

  test('displays the featured section with staff picks', async ({ page }) => {
    await page.goto('/');
    const featured = page.locator('#featured');
    await expect(featured).toBeVisible();
    const cards = featured.locator('.book-card');
    await expect(cards).toHaveCount(4);
  });

  test('displays the full catalog with all books', async ({ page }) => {
    await page.goto('/');
    const catalog = page.locator('#catalog');
    await expect(catalog).toBeVisible();
    // Default is 8 per page; select "Show all" to see all 16
    await page.selectOption('#per-page', 'all');
    const cards = catalog.locator('.book-card');
    await expect(cards).toHaveCount(16);
  });
});

test.describe('Genre Filtering', () => {
  test('filters books by fiction genre', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-filter="fiction"]');
    const cards = page.locator('#catalog .book-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(16);
    // All visible cards should have fiction genre
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.book-genre')).toContainText('fiction');
    }
  });

  test('filters books by sci-fi genre', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-filter="sci-fi"]');
    const cards = page.locator('#catalog .book-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.book-genre')).toContainText('sci-fi');
    }
  });

  test('shows all books when "All" filter is clicked', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#per-page', 'all');
    await page.click('[data-filter="mystery"]');
    const filteredCount = await page.locator('#catalog .book-card').count();
    expect(filteredCount).toBeLessThan(16);

    await page.click('[data-filter="all"]');
    const allCount = await page.locator('#catalog .book-card').count();
    expect(allCount).toBe(16);
  });

  test('active filter button gets highlighted', async ({ page }) => {
    await page.goto('/');
    const fictionBtn = page.locator('[data-filter="fiction"]');
    await fictionBtn.click();
    await expect(fictionBtn).toHaveClass(/active/);
    await expect(page.locator('[data-filter="all"]')).not.toHaveClass(/active/);
  });
});

test.describe('Search', () => {
  test('searches books by title', async ({ page }) => {
    await page.goto('/');
    await page.fill('#book-search', 'Midnight');
    await page.waitForTimeout(300); // debounce
    const cards = page.locator('#catalog .book-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.book-title')).toContainText('Midnight Library');
  });

  test('searches books by author', async ({ page }) => {
    await page.goto('/');
    await page.fill('#book-search', 'Andy Weir');
    await page.waitForTimeout(300);
    const cards = page.locator('#catalog .book-card');
    await expect(cards).toHaveCount(2); // The Martian + Project Hail Mary
  });

  test('shows no results message for unmatched search', async ({ page }) => {
    await page.goto('/');
    await page.fill('#book-search', 'xyznonexistent');
    await page.waitForTimeout(300);
    const noResults = page.locator('.no-results');
    await expect(noResults).toBeVisible();
  });

  test('clearing search shows all books again', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#per-page', 'all');
    await page.fill('#book-search', 'Midnight');
    await page.waitForTimeout(300);
    await expect(page.locator('#catalog .book-card')).toHaveCount(1);

    await page.fill('#book-search', '');
    await page.waitForTimeout(300);
    await expect(page.locator('#catalog .book-card')).toHaveCount(16);
  });
});

test.describe('Shopping Cart', () => {
  test('opens cart sidebar when cart button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('.cart-btn');
    await expect(page.locator('.cart-sidebar')).toHaveClass(/active/);
  });

  test('closes cart with close button', async ({ page }) => {
    await page.goto('/');
    await page.click('.cart-btn');
    await expect(page.locator('.cart-sidebar')).toHaveClass(/active/);
    await page.click('.cart-close');
    await expect(page.locator('.cart-sidebar')).not.toHaveClass(/active/);
  });

  test('closes cart with Escape key', async ({ page }) => {
    await page.goto('/');
    await page.click('.cart-btn');
    await expect(page.locator('.cart-sidebar')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.cart-sidebar')).not.toHaveClass(/active/);
  });

  test('adds a book to cart', async ({ page }) => {
    await page.goto('/');
    const firstAddBtn = page.locator('.add-to-cart').first();
    await firstAddBtn.click();
    await expect(page.locator('.cart-count')).toHaveText('1');
  });

  test('shows toast notification after adding to cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('.add-to-cart').first().click();
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('added to cart');
  });

  test('removes a book from cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('.add-to-cart').first().click();
    await expect(page.locator('.cart-count')).toHaveText('1');

    await page.click('.cart-btn');
    await page.click('.cart-item-remove');
    await expect(page.locator('.cart-count')).toHaveText('0');
    await expect(page.locator('.cart-empty')).toBeVisible();
  });

  test('calculates cart total correctly', async ({ page }) => {
    await page.goto('/');
    // Add first two books from featured
    await page.locator('#featured .add-to-cart').nth(0).click();
    await page.locator('#featured .add-to-cart').nth(1).click();
    await expect(page.locator('.cart-count')).toHaveText('2');

    await page.click('.cart-btn');
    const totalText = await page.locator('.cart-total-amount').textContent();
    // Total should be a valid dollar amount > 0
    const total = parseFloat(totalText.replace('$', ''));
    expect(total).toBeGreaterThan(0);
  });

  test('persists cart across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.locator('.add-to-cart').first().click();
    await expect(page.locator('.cart-count')).toHaveText('1');

    await page.reload();
    await expect(page.locator('.cart-count')).toHaveText('1');
  });
});

test.describe('Book Detail Modal', () => {
  test('opens modal when clicking a book card', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('.modal-title')).not.toBeEmpty();
  });

  test('modal shows book description', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    await expect(page.locator('.modal-description')).not.toBeEmpty();
  });

  test('modal shows reader reviews', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    const reviews = page.locator('.review');
    await expect(reviews).toHaveCount(2);
  });

  test('modal shows related books', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    const related = page.locator('.related-card');
    const count = await related.count();
    expect(count).toBeGreaterThan(0);
  });

  test('modal shows meta info (pages, year, ISBN)', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    const meta = page.locator('.modal-meta');
    await expect(meta).toContainText('Pages');
    await expect(meta).toContainText('Published');
    await expect(meta).toContainText('ISBN');
  });

  test('closes modal with close button', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.click('.modal-close');
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('closes modal with Escape key', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('can add to cart from modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    await page.click('#modal-add-to-cart');
    await expect(page.locator('.cart-count')).toHaveText('1');
  });

  test('clicking a related book updates the modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('.book-card').first().click();
    const firstTitle = await page.locator('.modal-title').textContent();

    await page.locator('.related-card').first().click();
    const secondTitle = await page.locator('.modal-title').textContent();
    expect(firstTitle).not.toBe(secondTitle);
  });
});

test.describe('Dark Mode', () => {
  test('toggles dark mode on click', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('persists dark mode preference after reload', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('toggles back to light mode', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Newsletter Form', () => {
  test('shows toast on successful subscription', async ({ page }) => {
    await page.goto('/');
    await page.fill('#newsletter-email', 'test@example.com');
    await page.click('.newsletter-form button[type="submit"]');
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('subscribing');
  });

  test('clears the form after submission', async ({ page }) => {
    await page.goto('/');
    await page.fill('#newsletter-email', 'test@example.com');
    await page.click('.newsletter-form button[type="submit"]');
    await expect(page.locator('#newsletter-email')).toHaveValue('');
  });
});

test.describe('SEO & Accessibility', () => {
  test('has meta description', async ({ page }) => {
    await page.goto('/');
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /Chapter & Verse/);
  });

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Chapter & Verse/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  });

  test('has JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const data = JSON.parse(content);
    expect(data['@type']).toBe('BookStore');
    expect(data.name).toBe('Chapter & Verse Bookstore');
  });

  test('has skip-to-content link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('footer address links to Google Maps', async ({ page }) => {
    await page.goto('/');
    const addressLink = page.locator('footer address a[href*="maps.google"]');
    await expect(addressLink).toBeVisible();
  });

  test('footer phone number is a tel: link', async ({ page }) => {
    await page.goto('/');
    const telLink = page.locator('footer a[href^="tel:"]');
    await expect(telLink).toBeVisible();
    await expect(telLink).toContainText('(555) 123-4567');
  });

  test('footer email is a mailto: link', async ({ page }) => {
    await page.goto('/');
    const mailLink = page.locator('footer a[href^="mailto:"]');
    await expect(mailLink).toBeVisible();
  });
});

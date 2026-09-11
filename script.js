/* =========================================================
   Volta Muscle — SCRIPT.JS
   Vanilla JavaScript only. No frameworks, no build step.
   Sections:
   1. Product data
   2. State + localStorage helpers
   3. Product rendering + filtering + search
   4. Wishlist
   5. Cart (drawer, quantities, totals, persistence)
   6. Checkout modal + validation + order confirmation
   7. Contact form validation
   8. Navigation (mobile menu, search bar, smooth scroll, sticky effects)
   9. Toast notifications
   10. Init
   ========================================================= */

/* ---------------------------------------------------------
   1. PRODUCT DATA
   Edit this array to change products, prices, images, etc.
   category must be one of: equipment | wear | footwear | supplements | accessories
--------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "p1",
    name: "Adjustable Dumbbells",
    category: "equipment",
    price: 850,
    desc: "Space-saving dumbbell set, adjustable from 2.5kg to 24kg per side.",
    img: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    badge: "sale"
  },
  {
    id: "p2",
    name: "Resistance Bands Set",
    category: "equipment",
    price: 250,
    desc: "5-piece latex resistance bands for strength and mobility training.",
    img: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    badge: "new"
  },
  {
    id: "p3",
    name: "Training Gloves",
    category: "accessories",
    price: 150,
    desc: "Breathable padded gloves with wrist support for heavy lifts.",
    img: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=600&auto=format&fit=crop",
    rating: 4.3,
    badge: ""
  },
  {
    id: "p4",
    name: "Gym Shaker Bottle",
    category: "accessories",
    price: 120,
    desc: "600ml leak-proof shaker with mixing ball for smooth protein shakes.",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    badge: ""
  },
  {
    id: "p5",
    name: "Training Shoes",
    category: "footwear",
    price: 650,
    desc: "Lightweight cross-training shoes with stable flat sole for lifting.",
    img: "https://images.unsplash.com/photo-1517260911058-3c65cb4c1a2e?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    badge: "new"
  },
  {
    id: "p6",
    name: "Gym T-Shirt",
    category: "wear",
    price: 280,
    desc: "Moisture-wicking performance tee built for high-intensity sessions.",
    img: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=600&auto=format&fit=crop",
    rating: 4.4,
    badge: ""
  },
  {
    id: "p7",
    name: "Gym Bag",
    category: "accessories",
    price: 350,
    desc: "Durable duffel bag with separate shoe compartment, 40L capacity.",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    badge: ""
  },
  {
    id: "p8",
    name: "Yoga Mat",
    category: "equipment",
    price: 220,
    desc: "Non-slip 6mm cushioned mat for yoga, stretching and floor work.",
    img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    badge: "sale"
  },
  {
    id: "p9",
    name: "Whey Protein 2kg",
    category: "supplements",
    price: 480,
    desc: "25g protein per serving to support muscle recovery and growth.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    badge: "sale"
  },
  {
    id: "p10",
    name: "Running Shoes",
    category: "footwear",
    price: 590,
    desc: "Responsive cushioned running shoes for road and treadmill miles.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    badge: ""
  },
  {
    id: "p11",
    name: "Gym Leggings",
    category: "wear",
    price: 260,
    desc: "Squat-proof high-waist leggings with side pocket for essentials.",
    img: "https://images.unsplash.com/photo-1506629905607-53a5c2371c8b?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    badge: "new"
  },
  {
    id: "p12",
    name: "Weightlifting Belt",
    category: "equipment",
    price: 320,
    desc: "Genuine leather belt for core stability on heavy compound lifts.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    badge: ""
  }
];

const DELIVERY_FEE = 30;

/* ---------------------------------------------------------
   2. STATE + LOCALSTORAGE HELPERS
--------------------------------------------------------- */
let cart = loadFromStorage("fitshop_cart", []);
let wishlist = loadFromStorage("fitshop_wishlist", []);
let currentFilter = "all";
let currentSearch = "";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveCart() {
  localStorage.setItem("fitshop_cart", JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem("fitshop_wishlist", JSON.stringify(wishlist));
}

/* ---------------------------------------------------------
   3. PRODUCT RENDERING + FILTERING + SEARCH
--------------------------------------------------------- */
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const filterBar = document.getElementById("filterBar");

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function getFilteredProducts() {
  return PRODUCTS.filter((product) => {
    const matchesCategory = currentFilter === "all" || product.category === currentFilter;
    const matchesSearch =
      currentSearch === "" ||
      product.name.toLowerCase().includes(currentSearch) ||
      product.category.toLowerCase().includes(currentSearch) ||
      product.desc.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const products = getFilteredProducts();
  productGrid.innerHTML = "";

  if (products.length === 0) {
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;

  products.forEach((product, index) => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.animationDelay = `${Math.min(index, 8) * 0.05}s`;

    card.innerHTML = `
      <div class="product-media">
        ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badge === "sale" ? "Sale" : "New"}</span>` : ""}
        <button class="wishlist-btn ${isWishlisted ? "active" : ""}" data-id="${product.id}" aria-label="Toggle wishlist">
          <svg viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
            <path d="M20.8 4.6c-1.9-1.6-4.7-1.4-6.4.4L12 7.4l-2.4-2.4c-1.7-1.8-4.5-2-6.4-.4-2.1 1.8-2.2 5-.3 6.9L12 21l9.1-9.5c1.9-1.9 1.8-5.1-.3-6.9z"/>
          </svg>
        </button>
        <img src="${product.img}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <span class="product-cat">${categoryLabel(product.category)}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-rating"><span class="stars">${starString(product.rating)}</span> ${product.rating}</div>
        <div class="product-footer">
          <span class="product-price">GH₵${product.price.toLocaleString()}</span>
          <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function categoryLabel(cat) {
  const labels = {
    equipment: "Gym Equipment",
    wear: "Gym Wear",
    footwear: "Footwear",
    supplements: "Supplements",
    accessories: "Accessories"
  };
  return labels[cat] || cat;
}

// Category filter buttons (in the Shop section)
filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  [...filterBar.children].forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
});

// "Shop Now" buttons inside category cards -> filter products + scroll to shop
document.querySelectorAll(".shop-category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    currentFilter = filter;
    [...filterBar.children].forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

// Delegate Add to Cart + wishlist heart clicks from the product grid
productGrid.addEventListener("click", (e) => {
  const cartBtn = e.target.closest(".add-cart-btn");
  const wishBtn = e.target.closest(".wishlist-btn");

  if (cartBtn) {
    addToCart(cartBtn.dataset.id);
  }
  if (wishBtn) {
    toggleWishlist(wishBtn.dataset.id);
  }
});

/* ---------------------------------------------------------
   4. WISHLIST
--------------------------------------------------------- */
const wishlistDrawer = document.getElementById("wishlistDrawer");
const wishlistBody = document.getElementById("wishlistBody");
const wishlistCount = document.getElementById("wishlistCount");

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (index === -1) {
    wishlist.push(productId);
    showToast(`Added to wishlist ❤️`);
  } else {
    wishlist.splice(index, 1);
    showToast(`Removed from wishlist`);
  }
  saveWishlist();
  updateWishlistUI();
  renderProducts(); // refresh heart state on cards
}

function updateWishlistUI() {
  wishlistCount.textContent = wishlist.length;
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  if (wishlist.length ===0) {
    wishlistBody.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6c-1.9-1.6-4.7-1.4-6.4.4L12 7.4l-2.4-2.4c-1.7-1.8-4.5-2-6.4-.4-2.1 1.8-2.2 5-.3 6.9L12 21l9.1-9.5c1.9-1.9 1.8-5.1-.3-6.9z"/></svg>
        <p>Your wishlist is empty.</p>
      </div>`;
    return;
  }

  wishlistBody.innerHTML = wishlist
    .map((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return "";
      return `
        <div class="wishlist-item">
          <img src="${product.img}" alt="${product.name}">
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">GH₵${product.price.toLocaleString()}</div>
          </div>
          <div class="wishlist-item-actions">
            <button class="add-cart-btn" data-id="${product.id}" data-action="wish-add">Add to Cart</button>
            <button class="btn-link" data-id="${product.id}" data-action="wish-remove">Remove</button>
          </div>
        </div>`;
    })
    .join("");
}

wishlistBody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === "wish-add") {
    addToCart(id);
  } else if (btn.dataset.action === "wish-remove") {
    toggleWishlist(id);
  }
});

/* ---------------------------------------------------------
   5. CART
--------------------------------------------------------- */
const cartDrawer = document.getElementById("cartDrawer");
const cartBody = document.getElementById("cartBody");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartTotal = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Item removed from cart");
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  showToast("Cart cleared");
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function formatCurrency(amount) {
  return `GH₵${amount.toLocaleString()}`;
}

function updateCartUI() {
  cartCount.textContent = getTotalItems();
  renderCartDrawer();

  const subtotal = getSubtotal();
  const delivery = cart.length ? DELIVERY_FEE : 0;
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartDelivery.textContent = formatCurrency(delivery);
  cartTotal.textContent = formatCurrency(subtotal + delivery);

  document.getElementById("cartFooter").style.display = cart.length ? "block" : "none";
}

function renderCartDrawer() {
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        <p>Your cart is empty.</p>
        <button class="btn btn-primary" id="startShoppingBtn">Start Shopping</button>
      </div>`;
    const startBtn = document.getElementById("startShoppingBtn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        closeDrawer(cartDrawer);
        document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
      });
    }
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.price)}</div>
          <div class="qty-control">
            <button data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-id="${item.id}" aria-label="Increase quantity">&plus;</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove" data-id="${item.id}" aria-label="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>`
    )
    .join("");
}

cartBody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === "inc") changeQty(id, 1);
  if (action === "dec") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

document.getElementById("clearCartBtn").addEventListener("click", () => {
  if (cart.length) clearCart();
});

document.getElementById("continueShoppingBtn").addEventListener("click", () => closeDrawer(cartDrawer));

/* Drawer open/close helpers */
function openDrawer(drawer) {
  closeAllDrawers();
  drawer.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeDrawer(drawer) {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}
function closeAllDrawers() {
  cartDrawer.classList.remove("open");
  wishlistDrawer.classList.remove("open");
}

document.getElementById("cartToggle").addEventListener("click", () => openDrawer(cartDrawer));
document.getElementById("cartClose").addEventListener("click", () => closeDrawer(cartDrawer));
document.getElementById("wishlistToggle").addEventListener("click", () => openDrawer(wishlistDrawer));
document.getElementById("wishlistClose").addEventListener("click", () => closeDrawer(wishlistDrawer));
overlay.addEventListener("click", () => {
  closeDrawer(cartDrawer);
  closeDrawer(wishlistDrawer);
});

/* ---------------------------------------------------------
   6. CHECKOUT MODAL + VALIDATION + CONFIRMATION
--------------------------------------------------------- */
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutFormWrap = document.getElementById("checkoutFormWrap");
const orderConfirmation = document.getElementById("orderConfirmation");
const checkoutSummary = document.getElementById("checkoutSummary");

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }
  closeDrawer(cartDrawer);
  openModal(checkoutOverlay);
  renderCheckoutSummary();
});

document.getElementById("checkoutClose").addEventListener("click", () => closeModal(checkoutOverlay));
checkoutOverlay.addEventListener("click", (e) => {
  if (e.target === checkoutOverlay) closeModal(checkoutOverlay);
});

function openModal(modalOverlay) {
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeModal(modalOverlay) {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

function renderCheckoutSummary() {
  const subtotal = getSubtotal();
  const delivery = DELIVERY_FEE;
  checkoutSummary.innerHTML = `
    <div class="cart-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    <div class="cart-row"><span>Delivery</span><span>${formatCurrency(delivery)}</span></div>
    <div class="cart-row cart-total"><span>Total</span><span>${formatCurrency(subtotal + delivery)}</span></div>
  `;
}

// Field validators
const validators = {
  fullName: (v) => v.trim().length >= 3,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: (v) => /^[0-9+\s-]{9,15}$/.test(v.trim()),
  address: (v) => v.trim().length >= 5,
  region: (v) => v.trim().length > 0
};
const errorMessages = {
  fullName: "Please enter your full name (min 3 characters).",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number.",
  address: "Please enter your delivery address.",
  region: "Please select your region."
};

function validateField(id) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(id + "Error");
  const isValid = validators[id](field.value);
  field.closest(".form-row").classList.toggle("invalid", !isValid);
  errorEl.textContent = isValid ? "" : errorMessages[id];
  return isValid;
}

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fieldsToCheck = ["fullName", "email", "phone", "address", "region"];
  const results = fieldsToCheck.map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    showToast("Please fix the errors in the form");
    return;
  }

  const payment = checkoutForm.querySelector('input[name="payment"]:checked').value;
  const orderNo = generateOrderNumber();

  document.getElementById("orderNumber").textContent = orderNo;
  checkoutFormWrap.hidden = true;
  orderConfirmation.hidden = false;

  // Clear the cart after successful checkout
  clearCart();
  checkoutForm.reset();
  document.querySelector('input[name="payment"][value="MTN Mobile Money"]').checked = true;
});

function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FS-${random}`;
}

document.getElementById("closeConfirmationBtn").addEventListener("click", () => {
  closeModal(checkoutOverlay);
  // Reset modal back to the form view for next time
  setTimeout(() => {
    checkoutFormWrap.hidden = false;
    orderConfirmation.hidden = true;
  }, 300);
});

/* ---------------------------------------------------------
   7. CONTACT FORM VALIDATION
--------------------------------------------------------- */
const contactForm = document.getElementById("contactForm");
const contactValidators = {
  cName: (v) => v.trim().length >= 2,
  cEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  cMessage: (v) => v.trim().length >= 10
};
const contactErrors = {
  cName: "Please enter your name.",
  cEmail: "Please enter a valid email address.",
  cMessage: "Message should be at least 10 characters."
};

function validateContactField(id) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(id + "Error");
  const isValid = contactValidators[id](field.value);
  field.closest(".form-row").classList.toggle("invalid", !isValid);
  errorEl.textContent = isValid ? "" : contactErrors[id];
  return isValid;
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ids = ["cName", "cEmail", "cMessage"];
  const allValid = ids.map(validateContactField).every(Boolean);

  if (!allValid) {
    showToast("Please fix the errors in the form");
    return;
  }

  showToast("Message sent! We'll get back to you soon.");
  contactForm.reset();
});

/* ---------------------------------------------------------
   8. NAVIGATION: mobile menu, search bar, smooth scroll, sticky shadow
--------------------------------------------------------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Close mobile menu after clicking a link (smooth scroll handled natively via CSS)
navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// Search bar toggle
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const searchToggle = document.getElementById("searchToggle");
const searchClose = document.getElementById("searchClose");

searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("open");
  if (searchBar.classList.contains("open")) {
    setTimeout(() => searchInput.focus(), 200);
  }
});
searchClose.addEventListener("click", () => {
  searchBar.classList.remove("open");
  searchInput.value = "";
  currentSearch = "";
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.trim().toLowerCase();
  // Searching should show results regardless of active category filter
  currentFilter = "all";
  [...filterBar.children].forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
  renderProducts();
  if (currentSearch) {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  }
});

/* ---------------------------------------------------------
   9. TOAST NOTIFICATIONS
--------------------------------------------------------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------------------------------------------------
   Legal modal (Privacy Policy / Terms) — simple placeholder content
--------------------------------------------------------- */
const legalOverlay = document.getElementById("legalOverlay");
const legalTitle = document.getElementById("legalTitle");
const legalBody = document.getElementById("legalBody");

document.getElementById("privacyLink").addEventListener("click", (e) => {
  e.preventDefault();
  legalTitle.textContent = "Privacy Policy";
  legalBody.textContent = "FitShop respects your privacy. This demo store does not process real payments or share personal data with third parties. Any information entered is used only to simulate the checkout experience.";
  openModal(legalOverlay);
});
document.getElementById("termsLink").addEventListener("click", (e) => {
  e.preventDefault();
  legalTitle.textContent = "Terms & Conditions";
  legalBody.textContent = "This is a front-end demonstration store. Prices, stock and orders are simulated for showcase purposes only and do not reflect real transactions.";
  openModal(legalOverlay);
});
document.getElementById("legalClose").addEventListener("click", () => closeModal(legalOverlay));
legalOverlay.addEventListener("click", (e) => {
  if (e.target === legalOverlay) closeModal(legalOverlay);
});

/* ---------------------------------------------------------
   10. INIT
--------------------------------------------------------- */
function init() {
  renderProducts();
  updateCartUI();
  updateWishlistUI();
}

document.addEventListener("DOMContentLoaded", init);

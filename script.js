// ==== Product Definitions ====
const PRODUCTS = [
  { name: "Denim Jacket", price: 35 },
  { name: "Dress", price: 50 },
  { name: "Sneakers", price: 45 },
  { name: "Crystal Earrings", price: 10 },
  { name: "Sun Hat", price: 20 },
  { name: "Curly Wig", price: 30 },
  { name: "Straight Wig", price: 25 },
  { name: "Heels", price: 50 },
];

// ==== Toast Notifications ====
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ==== Cart Badge ====
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalQty;
}

// ==== Add to Cart ====
function orderProduct(name, price = null) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const found = PRODUCTS.find(p => p.name === name);
  const actualPrice = price || (found ? found.price : 0);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price: actualPrice, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  showToast(`${name} added to cart!`);
}

// ==== Render Cart ====
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalText = document.getElementById("cart-total");
  const checkoutLink = document.getElementById("checkout");

  if (!container || !totalText || !checkoutLink) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} × <span class="quantity">${item.quantity}</span> = <strong>$${itemTotal.toFixed(2)}</strong></p>
      </div>
      <div class="cart-item-actions">
        <button class="btn" onclick="updateQuantity(${i}, -1)">-</button>
        <button class="btn" onclick="updateQuantity(${i}, 1)">+</button>
        <button class="remove-btn" onclick="removeItem(${i})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalText.textContent = `Total: $${total.toFixed(2)}`;

  if (cart.length > 0) {
    const summary = cart.map(i => `${i.name} (x${i.quantity})`).join(", ");
    checkoutLink.href = `https://wa.me/2340000000000?text=${encodeURIComponent(
      `I want to order: ${summary}. Total: $${total.toFixed(2)}`
    )}`;

    const buttonWrap = document.createElement("div");
    buttonWrap.className = "cart-buttons";

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Cart";
    clearBtn.className = "btn danger";
    clearBtn.onclick = clearCart;

    buttonWrap.appendChild(clearBtn);
    container.appendChild(buttonWrap);
  } else {
    container.innerHTML = "<p>Your cart is empty.</p>";
    checkoutLink.href = "#";
  }

  updateCartBadge();
}

// ==== Cart Modifications ====
function updateQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const removed = cart.splice(index, 1)[0];
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`${removed.name} removed`);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
  showToast("Cart cleared");
}

// ==== Search Suggestions ====
function setupSearch() {
  const input = document.getElementById("search");
  const suggestions = document.getElementById("suggestions");
  if (!input || !suggestions) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = "";
    if (!query) return suggestions.style.display = "none";

    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(query));
    if (matches.length === 0) return suggestions.style.display = "none";

    matches.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p.name;
      li.className = "suggestion-item";
      li.onclick = () => {
        input.value = p.name;
        suggestions.style.display = "none";
      };
      suggestions.appendChild(li);
    });
    suggestions.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.style.display = "none";
    }
  });
}

// ==== Initialization ====
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setupSearch();
  if (document.getElementById("cart-items")) renderCart();
});

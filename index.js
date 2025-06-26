let products = [];
const cart = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts();
    });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty.");
    } else {
      alert("Thank you for your purchase!");
      for (let key in cart) delete cart[key];
      updateCart();
      removeCartBorders(); 
    }
  });
});

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Apply chocolate border if in cart
    if (cart[product.id]) {
      card.classList.add("in-cart");
    }

    card.innerHTML = `
  <img src="${product.image.image}" alt="${product.name}" />
  <h3>${product.name}</h3>
  <p>${product.category}</p>
  <div class="price">$${product.price.toFixed(2)}</div>
  <button onclick="addToCart(${product.id})">🛒 Add to Cart</button>
`;

    productList.appendChild(card);
  });
}

function removeCartBorders() {
  const cards = document.querySelectorAll('.product-card.in-cart');
  cards.forEach(card => card.classList.remove('in-cart'));
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 1 };
  } else {
    cart[productId].quantity += 1;
  }

  // Apply chocolate border without re-render
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    if (card.innerText.includes(product.name)) {
      card.classList.add("in-cart");
    }
  });

  updateCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  Object.values(cart).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(
      2
    )}
      <button onclick="removeFromCart(${item.id})">×</button>
    `;
    cartItems.appendChild(li);

    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartCount.textContent = count;
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

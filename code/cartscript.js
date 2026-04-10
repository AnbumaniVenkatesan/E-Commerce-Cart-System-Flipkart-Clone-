// =====================
// SLIDER — only on index.html
// =====================
if (document.getElementById("slider")) {

  const slider = document.getElementById("slider");
  const slides = document.querySelectorAll(".slide");
  const dotsWrap = document.getElementById("dots");

  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      goTo(i);
      restartAuto();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll("button");

  function updateDots() {
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function slideWidth() {
    const gap = 22;
    return slides[0].offsetWidth + gap;
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slider.scrollTo({ left: index * slideWidth(), behavior: "smooth" });
    updateDots();
  }

  function startAuto() {
    timer = setInterval(() => goTo(index + 1), 3000);
  }

  function restartAuto() {
    clearInterval(timer);
    startAuto();
  }

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", () => startAuto());

  updateDots();
  startAuto();
}


// =====================
// SAFE CART READER
// =====================
function getCart() {
  try {
    let data = JSON.parse(localStorage.getItem("cart"));
    if (!Array.isArray(data)) {
      localStorage.setItem("cart", JSON.stringify([]));
      return [];
    }
    return data;
  } catch (e) {
    localStorage.setItem("cart", JSON.stringify([]));
    return [];
  }
}


// =====================
// ADD TO CART — shirt.html
// =====================
function addcart(name, price, image) {
  let cart = getCart();

  // Prevent duplicates
  let exists = cart.find(item => item.name === name && item.image === image);
  if (exists) {
    alert("Item is already in your cart!");
    return;
  }

  // quantity starts at 1 when first added
  cart.push({ name: name, price: price, image: image, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}


// =====================
// INCREASE QUANTITY
// =====================
function increaseQty(i) {
  let cart = getCart();
  cart[i].quantity += 1;               // add 1 to quantity
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();                         // re-render without full page reload
}


// =====================
// DECREASE QUANTITY
// =====================
function decreaseQty(i) {
  let cart = getCart();
  if (cart[i].quantity > 1) {
    cart[i].quantity -= 1;             // subtract 1 only if more than 1
  } else {
    // if quantity reaches 0, remove item from cart
    cart.splice(i, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();                         // re-render without full page reload
}


// =====================
// REMOVE FROM CART
// =====================
function removeFromCart(i) {
  let cart = getCart();
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}


// =====================
// RENDER CART — builds the cart UI
// =====================
function renderCart() {
  let cart = getCart();
  let container = document.getElementById("cart-items");
  let emptyCart = document.querySelector(".empty-cart");
  let priceBox = document.getElementById("price-details");
  let cartWrapper = document.querySelector(".cart-container");

  // Clear current content before re-rendering
  container.innerHTML = "";
  priceBox.innerHTML = "";

  // Hide both sections first
  emptyCart.style.display = "none";
  cartWrapper.style.display = "none";

  if (cart.length === 0) {

    // Show empty cart
    emptyCart.style.display = "block";

  } else {

    // Show cart layout
    cartWrapper.style.display = "flex";

    let total = 0;

    cart.forEach((item, i) => {

      // quantity defaults to 1 for old cart items that don't have it
      let qty = item.quantity || 1;
      let itemTotal = item.price * qty;
      total += itemTotal;

      container.innerHTML += `
        <div style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid #ddd;">
          
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <img src="${item.image}" width="100" style="border-radius:10px; object-fit:cover;">

            <!-- QUANTITY CONTROLS — shown below the image -->
            <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
              <button 
                onclick="decreaseQty(${i})"
                style="width:28px; height:28px; font-size:18px; background:#eee; border:1px solid #ccc; border-radius:5px; cursor:pointer; line-height:1;">
                −
              </button>

              <span style="font-size:16px; font-weight:bold; min-width:20px; text-align:center;">
                ${qty}
              </span>

              <button 
                onclick="increaseQty(${i})"
                style="width:28px; height:28px; font-size:18px; background:#eee; border:1px solid #ccc; border-radius:5px; cursor:pointer; line-height:1;">
                +
              </button>
            </div>
          </div>

          <!-- ITEM DETAILS -->
          <div>
            <h3>${item.name}</h3>
            <p style="margin:4px 0; color:gray;">₹${itemTotal}</p>
            <button
              onclick="removeFromCart(${i})"
              style="margin-top:8px; padding:5px 15px; background:#ff4d4d; color:white; border:none; border-radius:8px; cursor:pointer;">
              Remove
            </button>
          </div>

        </div>
      `;
    });

    let discount = ((5 / 100) * total).toFixed(2);
    let finalAmount = (total - discount).toFixed(2);

    priceBox.innerHTML = `
      <h3 style="margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">Price Details</h3>
      <p style="margin-bottom:10px;">MRP Total &nbsp;&nbsp;&nbsp;&nbsp; : ₹${total}</p>
      <p style="margin-bottom:10px; color:green;">Discount (5%) : - ₹${discount}</p>
      <hr style="margin:10px 0;">
      <h2 style="margin-bottom:15px;">Final: ₹${finalAmount}</h2>
      <button style="width:100%; padding:10px; background:#fb641b; color:white; border:none; border-radius:5px; font-size:16px; cursor:pointer;">
        Place Order
      </button>
      <p style="margin-top:15px; font-size:12px; color:gray; text-align:center;">
        ✅ Safe and Secure Payments.<br>Easy returns. 100% Authentic products.
      </p>
    `;
  }
}


// =====================
// CART PAGE — only runs on cart.html
// =====================
if (document.getElementById("cart-items")) {
  renderCart(); // kick off the cart display
}
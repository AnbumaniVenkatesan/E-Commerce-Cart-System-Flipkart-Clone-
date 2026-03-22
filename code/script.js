if (document.getElementById="slider") {
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
    slider.scrollTo({
      left: index * slideWidth(),
      behavior: "smooth"
    });
    updateDots();
  }

  function startAuto() {
    timer = setInterval(() => {
      goTo(index + 1);
    }, 3000);
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
// FIX 2: Add to cart with duplicate check
// =====================
function addcart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if item already exists in cart
  let exists = cart.find(item => item.name === name && item.image === image);
  if (exists) {
    alert("Item is already in your cart!");
    return;
  }

  cart.push({ name: name, price: price, image: image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}


// =====================
// FIX 3: Remove from cart by index
// =====================
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove 1 item at that position
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Refresh the cart page to reflect changes
}


// =====================
// FIX 1: Only run cart logic if cart-items exists (cart.html)
// =====================
if (document.getElementById("cart-items")) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let container = document.getElementById("cart-items");
  let emptyCart = document.querySelector(".empty-cart");
  let priceBox = document.getElementById("price-details");

  if (cart.length === 0) {

    // Show empty cart image and message
    emptyCart.style.display = "flex";

    // Hide items and price box
    container.style.display = "none";
    priceBox.style.display = "none";

  } else {

    // Hide empty cart
    emptyCart.style.display = "none";

    let total = 0;

    // FIX 3: Added Remove button to each cart item
    cart.forEach((item, i) => {
      total += item.price;

      container.innerHTML += `
        <div style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid #ddd;">
          <img src="${item.image}" width="100" style="border-radius:10px;">
          <div>
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button 
              onclick="removeFromCart(${i})" 
              style="margin-top:8px; padding:5px 15px; background:#ff4d4d; color:white; border:none; border-radius:8px; cursor:pointer;">
              Remove
            </button>
          </div>
        </div>
      `;
    });

    // FIX 5: Use toFixed(2) to avoid floating point decimal issues
    let discount = ((5 / 100) * total).toFixed(2);
    let finalAmount = (total - discount).toFixed(2);

    // Show price details
    priceBox.innerHTML = `
      <h3 style="margin-bottom:15px;">Price Details</h3>
      <p style="margin-bottom:8px;">MRP Total: ₹${total}</p>
      <p style="margin-bottom:8px; color:green;">Discount (5%): - ₹${discount}</p>
      <hr style="margin:10px 0;">
      <h2>Final Amount: ₹${finalAmount}</h2>
      <p style="margin-top:10px; font-size:12px; color:gray;">✅ Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
    `;

  }

}
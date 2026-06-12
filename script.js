/*Dark Mode*/
$(".change").on("click", function () {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".change").text("OFF");
  } else {
    $("body").addClass("dark");
    $(".change").text("ON");
  }
});
/*Home Slider*/
let swiper = new Swiper(".home-slider", {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
});


//icons
document.addEventListener("DOMContentLoaded", function () {
  const icons = document.querySelectorAll(".icons a");

  icons.forEach(icon => {
    icon.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior
      alert(`You clicked on: ${this.classList[1].replace('fa-', '')}`);
    });
  });
});
// Select elements
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
// Open Cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};
//Close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// Making Add to Cart
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

// Making Function
function ready() {
  // Remove item from cart
  var removeCartButtons = document.getElementsByClassName('cart-remove');
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  // Quantity Change
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }
  //Add to Cart
  var addCart = document.getElementsByClassName('btn');
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener('click', addCartClicked);
  }


  // Remove cart Item
  function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal(); // Update total after removing item
    saveCartItems();

  }

  // Quantity Changed
  function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateTotal(); // Update total when quantity changes
    saveCartItems();
  }
  // Cart Function
  function addCartClicked(event) {
    var shopProducts = event.target.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;

    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();
  }

  function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');

    var cartContent = document.getElementsByClassName('cart-content')[0];
    if (!cartContent) return; // Prevent error if cart-content is missing

    var cartItems = cartContent.getElementsByClassName('cart-box');
    for (var i = 0; i < cartItems.length; i++) {
      var cartItemName = cartItems[i].getElementsByClassName('cart-product-title')[0];
      if (cartItemName.innerText === title) {
        alert("You have already added this item to the cart!");
        return;
      }
    }

    var cartBoxContent = `
              <img src="${productImg}" alt="" class="cart-img">
              <div class="detail-box">
                  <div class="cart-product-title">${title}</div>
                  <div class="cart-price">${price}</div>
                  <input type="number" value="1" class="cart-quantity" min="1">
              </div>
              <i class="fa-solid fa-trash cart-remove"></i>
          `;

    cartShopBox.innerHTML = cartBoxContent;
    cartContent.append(cartShopBox);

    // Add event listeners to new cart items
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
    saveCartItems();
    updateTotal();

  }

  // Remove item from cart
  function removeCartItem(event) {
    event.target.parentElement.remove();
    updateTotal();

  }

  // Quantity Changed
  function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateTotal();

  }

  // Update Total
  function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    if (!cartContent) return; // Stop execution if cartContent is missing

    var cartBoxes = cartContent.getElementsByClassName('cart-box'); // Select all cart-box elements
    var total = 0; // <-- ADD THIS LINE

    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var priceElement = cartBox.getElementsByClassName('cart-price')[0];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];

      var price = parseFloat(priceElement.innerText.replace('$', ''));
      var quantity = parseInt(quantityElement.value) || 1; // Convert to number and prevent NaN

      total += price * quantity;
    }

    total = Math.round(total * 100) / 100; // Fix rounding issue
    document.getElementsByClassName('total-price')[0].innerText = "$" + total.toFixed(2); // Fix decimal formatting

    // Save total to local storage
    localStorage.setItem('cartTotal', total);
  }
}


//keep item in cart when page refresh with local storage
function saveCartItems() {
  var cartContent = document.getElementsByClassName('cart-content')[0];
  var cartBoxes = cartContent.getElementsByClassName('cart-box');
  var cartItems = [];

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
    var priceElement = cartBox.getElementsByClassName('cart-price')[0];
    var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
    var productImgElement = cartBox.getElementsByClassName('cart-img')[0];

    if (!titleElement || !priceElement || !quantityElement || !productImgElement) continue;

    var item = {
      title: titleElement.innerText,
      price: priceElement.innerText,
      quantity: quantityElement.value,
      productImg: productImgElement.src,
    };

    cartItems.push(item);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// loads in cart
function loadCartItems() {
  var cartItems = localStorage.getItem('cartItems');
  if (cartItems) {
    cartItems = JSON.parse("cartItems");

    for (var i = 0; i < cartItems.length; i++) {
      var item = cartItems[i];
      addProductToCart(item.title, item.price, item.productImg);

      var cartBoxes = document.getElementsByClassName('cart-box');
      var cartBox = cartBoxes[cartBoxes.length - 1];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      quantityElement.value = item.quantity;

    }
  }
  var cartTotal = localStorage.getItem('cartTotal');
  if (cartTotal) {
    document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
  }

}
//active navbar
$(document).ready(function () {
  $(window).on('scroll load', function () {
    $('#menu').removeClass('fa-times');
    $('.navbar').removeClass('active');

    if ($(window).scrollTop() > 60) {
      $('.header').addClass('active');
    }
    else {
      $('.header').removeClass('active');
    }
    $('section').each(function () {
      let top = $(window).scrollTop();
      let height = $(this).height();
      let offset = $(this).offset().top - 200;
      let id = $(this).attr('id');

      if (top >= offset && top < offset + height) {
        $('.navbar a').removeClass('active');
        $('.navbar ').find('[href="#${id}"]').addClass('active');

      }
    })
  })
})


//deal
// Set the target date for the countdown (YYYY-MM-DD HH:MM:SS)
const targetDate = new Date("2025-06-01 00:00:00").getTime();

function updateCountdown() {
    let now = new Date().getTime();
    let gap = targetDate - now;

    if (gap < 0) {
        document.querySelector(".countdown").innerHTML = "<h3>Event Started!</h3>";
        return;
    }

    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let d = Math.floor(gap / day);
    let h = Math.floor((gap % day) / hour);
    let m = Math.floor((gap % hour) / minute);
    let s = Math.floor((gap % minute) / second);

    document.getElementById("days").innerText = d;
    document.getElementById("hours").innerText = h;
    document.getElementById("minutes").innerText = m;
    document.getElementById("seconds").innerText = s;
}

// Update countdown every second
setInterval(updateCountdown, 1000);

// Initial call to prevent delay
updateCountdown();



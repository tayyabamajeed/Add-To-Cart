let iconcart = document.querySelector('.icon-cart');
let closecart = document.querySelector('.close');
let body = document.querySelector('body');
let listproductHTML = document.querySelector('.listproduct');
let listcartHTML = document.querySelector('.listcart');
let iconcartSpan = document.querySelector('.icon-cart span');

let listproducts = [];
let carts = [];

// Toggle cart open/close
iconcart.addEventListener('click', () => {
  body.classList.toggle('showcart');
});
closecart.addEventListener('click', () => {
  body.classList.toggle('showcart');
});

// Add products to HTML
const addDataToHTML = () => {
  listproductHTML.innerHTML = '';
  if (listproducts.length > 0) {
    listproducts.forEach(product => {
      let newproduct = document.createElement('div');
      newproduct.classList.add('item');
      newproduct.dataset.id = product.id;

      let specialClass = '';
      if (product.id === 4 || product.id === 7) {
        specialClass = 'custom-size margins';
      }

      newproduct.innerHTML = `
        <img src="${product.image}" class="${specialClass}" alt="">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        <button class="addcart">Add To Cart</button>
      `;
      listproductHTML.appendChild(newproduct);
    });
  }
};

// Add product to cart
listproductHTML.addEventListener('click', (event) => {
  if (event.target.classList.contains('addcart')) {
    let product_id = event.target.parentElement.dataset.id;
    addToCart(product_id);
  }
});

// Add to cart logic
const addToCart = (product_id) => {
  let positionInCart = carts.findIndex(item => item.product_id == product_id);

  if (positionInCart >= 0) {
    carts[positionInCart].quantity += 1;
  } else {
    carts.push({ product_id: product_id, quantity: 1 });
  }

  addcartToHTML();
  addcartToMemory();
};

// Update cart in localStorage
const addcartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
};

// Show cart items in HTML
const addcartToHTML = () => {
  listcartHTML.innerHTML = '';
  let totalQuantity = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity += cart.quantity;

      let positionProduct = listproducts.findIndex(p => p.id == cart.product_id);
      let info = listproducts[positionProduct];

      let newcart = document.createElement('div');
      newcart.classList.add('item');
      newcart.dataset.id = cart.product_id;

      newcart.innerHTML = `
        <div class="image">
          <img src="${info.image}" alt="">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalprice">$${info.price * cart.quantity}</div>
        <div class="quantity">
          <span class="minus">-</span>
          <span>${cart.quantity}</span>
          <span class="plus">+</span>
        </div>
      `;

      listcartHTML.appendChild(newcart);
    });
  }

  iconcartSpan.innerText = totalQuantity;
};

// Plus/Minus handler
listcartHTML.addEventListener('click', (event) => {
  let target = event.target;
  let parentItem = target.closest('.item');
  if (!parentItem) return;

  let product_id = parentItem.dataset.id;
  let cartIndex = carts.findIndex(item => item.product_id == product_id);

  if (target.classList.contains('plus')) {
    carts[cartIndex].quantity += 1;
  }

  if (target.classList.contains('minus')) {
    carts[cartIndex].quantity -= 1;
    if (carts[cartIndex].quantity <= 0) {
      carts.splice(cartIndex, 1);
    }
  }

  addcartToHTML();
  addcartToMemory();
});

// App init
const initapp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      listproducts = data;
      addDataToHTML();

      // Load cart from localStorage
      if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        addcartToHTML();
      }
    });
};

initapp();

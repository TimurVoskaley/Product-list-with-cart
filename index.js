'use strict';

let productsList = document.querySelector('.products__list');
let products = [];
let cart = [];
let emptyMessage = document.createElement('div');
let cartList = document.querySelector('.cart__list');


async function getProducts() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}


function renderProducts(product) {
  const card = document.createElement('article');
  card.className = 'products__card';
  card.dataset.id = product.name;
  card.innerHTML = `
    <div class="products__card-image">
      <picture>
        <source srcset="${product.image.desktop}" media="(min-width: 850px)">
        <source srcset="${product.image.tablet}" media="(min-width: 481px) and (max-width: 849px)">
        <source srcset="${product.image.mobile}" media="(max-width: 480px)">
        <img src="${product.image.desktop}" alt="${product.name}" width="251" height="240">
      </picture>
      <button class="products__card-button add-product-button" type="button">Add to Cart</button>
      <div class="products__card-button count-products-button visually-hidden">
        <button class="count-products-button btn minus-product-button" type="button">-</button>
        <span class="product-quantity">1</span>
        <button class="count-products-button btn plus-product-button" type="button">+</button>
      </div>
    </div>
    <div class="products__card-content">
      <p class="products__card-category">${product.category}</p>
      <h3 class="products__card-title">${product.name}</h3>
      <p class="products__card-price">$${product.price.toFixed(2)}</p>
    </div>
  `;


  const addButton = card.querySelector('.add-product-button');
  addButton.dataset.productName = product.name;
  const plusButton = card.querySelector('.plus-product-button');
  const minusButton = card.querySelector('.minus-product-button');

  addButton.addEventListener('click', (event) => handleAddToCart(product, event));
  plusButton.addEventListener('click', (event) => handleQuantityChange(product, 1, event));
  minusButton.addEventListener('click', (event) => handleQuantityChange(product, -1, event));

  return card;
}

function renderCart() {
  let cartElement = document.querySelector('.cart');
  let cartTitle = document.querySelector('.cart__title');
  const cartContent = cartElement.querySelector('.cart__content-wrapper');
  let cartCountProducts = 0;
  cartTitle.textContent = `Your Cart (${cartCountProducts})`;
  let totalPriceElement = document.querySelector('.total-prace__price');
  let sum = cart.reduce((acc, el) => acc + (el.count * el.price), 0);
  totalPriceElement.textContent = `$${sum.toFixed(2)}`;



  if (cart.length === 0) {
    emptyMessage.classList.remove('visually-hidden');
    cartContent.classList.add('visually-hidden');
    emptyMessage.className = 'cart__empty-message';
    emptyMessage.innerHTML = `<img class="cart__empty-image" src="./assets/images/illustration-empty-cart.svg" alt="" aria-hidden="true">
                              <p>Your added items will appear here</p>`;
    cartElement.append(emptyMessage);

  } else {
    emptyMessage.classList.add('visually-hidden');
    cartContent.classList.remove('visually-hidden');
    cartList.innerHTML = '';

    //создание в корзине элемента списка выбранного товара
    cart.map(product => {
      cartCountProducts += product.count;
      cartTitle.textContent = `Your Cart (${cartCountProducts})`;

      let orderProduct = document.createElement('li');
      orderProduct.className = 'cart__item';
      orderProduct.innerHTML = `     
            <div class="cart__item-info-wrapper">
              <p class="cart__item-title">${product.name}</p>
              <div class="cart__item-count-and-price-wrap">
                <p class="cart__item-count">${product.count}x</p>
                <p class="cart__item-price">@ $${product.price.toFixed(2)}</p>
                <p class="cart__item-total-price">$${(product.price.toFixed(2) * product.count).toFixed(2)}</p>
              </div>
            </div>
            <button
              class="cart__item-delete-button"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
            </button>`;

      const deleteBtn = orderProduct.querySelector('.cart__item-delete-button');
      deleteBtn.addEventListener('click', (event) => deleteProductFromCart(product, event));

      cartList.append(orderProduct);

    }).join('');

  }
}


function handleAddToCart(product, event) {
  product.count = 1
  cart.push(product);

  // скрытие кнопки добавления товара в карточке
  updateProductCardUI(product, true);
  renderCart()
}

function handleQuantityChange(product, change, event) {

  // Здесь логика изменения количества
    for (let [index, item] of cart.entries()) {
      if (item.name === product.name) {
        if (change === 1) {
          item.count += 1;
        } else {
          item.count -= 1;
          if (item.count < 1) {
            cart.splice(index, 1);
            updateProductCardUI(product, false);
            break;
          }
      }
    }
  }
renderCart();
}

function deleteProductFromCart(product, event) {
  cart = cart.filter(item => item.name !== product.name);
  updateProductCardUI(product, false);
  renderCart();

}

function updateProductCardUI(product, isInCart) {
  // Находим все карточки с этим товаром (может быть несколько)
  document.querySelectorAll('.products__card').forEach(card => {
    const addButton = card.querySelector('.add-product-button');
    const countButton = card.querySelector('.count-products-button');

    // Проверяем, совпадает ли имя товара через data-атрибут
    if (addButton?.dataset.productName === product.name) {
      if (isInCart) {
        addButton.classList.add('visually-hidden');
        countButton.classList.remove('visually-hidden');
      } else {
        addButton.classList.remove('visually-hidden');
        countButton.classList.add('visually-hidden');
      }
    }
  });
}

async function init() {
  try {
    products = await getProducts();
    renderCart()

    // Очищаем контейнер
    productsList.innerHTML = '';

    // Рендерим каждый продукт
    products.forEach((product) => {
      const card = renderProducts(product);
      productsList.append(card);
    });

  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// function openPopup() {
//   const popup = document.querySelector('.popup');
//   popup.classList.remove('visually-hidden');
//
//   document.body.classList.add('no-scroll');
// }

// Инициализируем
document.addEventListener('DOMContentLoaded', init);
'use strict';

let productsList = document.querySelector('.products__list');
let products = [];

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


function renderProduct(product) {
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
      <div class="products__card-button count-products-button hidden">
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



  // Вешаем обработчики сразу
  const addButton = card.querySelector('.add-product-button');
  const plusButton = card.querySelector('.plus-product-button');
  const minusButton = card.querySelector('.minus-product-button');

  addButton.addEventListener('click', () => handleAddToCart(product));
  plusButton.addEventListener('click', () => handleQuantityChange(product, 1));
  minusButton.addEventListener('click', () => handleQuantityChange(product, -1));

  return card;
}



function handleAddToCart(product) {
  console.log('Добавлено в корзину:', product.name);
  // Здесь логика добавления в корзину
}



function handleQuantityChange(product, change) {
  console.log('Изменено количество:', product.name, change);
  // Здесь логика изменения количества
}



async function init() {
  try {
    products = await getProducts();

    // Очищаем контейнер
    productsList.innerHTML = '';

    // Рендерим каждый продукт
    products.forEach(product => {
      const card = renderProduct(product);
      productsList.append(card);
    });

    console.log('Продукты загружены:', products);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Инициализируем
document.addEventListener('DOMContentLoaded', init);
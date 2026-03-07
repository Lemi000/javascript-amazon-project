import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { orders } from "../data/orders.js";
import { formatCurrency } from './utils/money.js';
import { getProduct, loadProductsFetch, products } from '../data/products.js';
import { addToCart } from '../data/cart.js';

await loadProductsFetch();

let ordersHTML = '';

orders.forEach(order => {
  ordersHTML += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${convertDate(order.orderTime)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${getProductsHTML(order)}
      </div>
    </div>
  `;
});

console.log(orders);

document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

document.querySelectorAll('.js-buy-again-button').forEach(button => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    addToCart(productId, 1);
  })
})

document.querySelectorAll('.js-track-package-button').forEach(button => {

})

function convertDate(date) {
  return dayjs(date).format('MMMM D, YYYY');
}

function getProductsHTML(order) {
  const products = order.products;
  let productsHTML = ''

  products.forEach(product => {
    const productId = product.productId;
    productsHTML += `
      <div class="product-image-container">
        <img src="${getProduct(productId).image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${getProduct(productId).name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${convertDate(product.estimatedDeliveryTime)}
        </div>
        <div class="product-quantity">
          Quantity: ${product.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${productId}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
          <button class="track-package-button button-secondary js-track-package-button">
            Track package
          </button>
        </a>
      </div>
    `;
  })
  return productsHTML;
}
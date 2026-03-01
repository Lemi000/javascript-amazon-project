import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';
import { getDeliveryDate } from '../utils/deliveryDate.js';
import renderPaymentSummary from './paymentSummary.js';
import renderCheckoutHeader from './checkoutHeader.js';

export default function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const dateString = getDeliveryDate(deliveryOptionId);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${productId}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${productId}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${productId}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${productId}">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${productId}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(productId, cartItem)}
          </div>
        </div>
      </div>
    `;
  })

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      })
    })

  document.querySelectorAll('.js-update-quantity-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      })
    })

  document.querySelectorAll('.js-save-quantity-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }

        if (newQuantity === 0) {
          removeFromCart(productId);
        } else {
          updateQuantity(productId, newQuantity);
        }

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();

        container.classList.remove('is-editing-quantity');
      })
    })

  document.querySelectorAll('.js-delivery-option')
    .forEach(option => {
      option.addEventListener('click', () => {
        const { productId, deliveryOptionId } = option.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
    })
}
  
function deliveryOptionsHTML(productId, cartItem) {
  let html = '';

  deliveryOptions.forEach(deliveryOption => {
    const deliveryOptionId = deliveryOption.id;
    const dateString = getDeliveryDate(deliveryOptionId);

    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;
    
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    
    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${productId}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  })
  return html;
}

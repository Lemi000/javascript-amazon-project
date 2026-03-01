import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { getDeliveryOption } from "../../data/deliveryOptions.js";

export function getDeliveryDate(deliveryOptionId) {
  const today = dayjs();
  const deliveryOption = getDeliveryOption(deliveryOptionId);
  let deliveryDate = today.add(deliveryOption.deliveryDays, 'day');

  const dayOfWeek = deliveryDate.format('dddd');
  if (dayOfWeek === 'Saturday') {
    deliveryDate = deliveryDate.add(2, 'day');
  } else if (dayOfWeek === 'Sunday') {
    deliveryDate = deliveryDate.add(1, 'day');
  }
  return deliveryDate.format('dddd, MMMM D');
}
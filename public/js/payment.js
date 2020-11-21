/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);

export const bookTour = async tourId => {
  try {
    const response = await axios({
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.toString());
  }
};

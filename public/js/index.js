/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './auth';
import { updateMyData, updateMyPassword } from './updateSettings';
import { displayMap } from './mapbox';
import { bookTour } from './payment';

const map = document.getElementById('map');
const loginForm = document.querySelector('form.form__login');
const signupForm = document.querySelector('form.form__signup');
const logoutButton = document.querySelector('.nav__el--logout');
const updateMyDataForm = document.querySelector('form.form-user-data');
const updateMyPasswordForm = document.querySelector('form.form-user-settings');
const bookBtn = document.getElementById('book-tour');

if (map) {
  const locations = JSON.parse(map.dataset['locations']);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login({ email, password });
  });

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup({ name, email, password, passwordConfirm });
  });

if (logoutButton) logoutButton.addEventListener('click', logout);

if (updateMyDataForm) {
  updateMyDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateMyData(form);
  });
}

if (updateMyPasswordForm) {
  updateMyPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateMyPassword(passwordCurrent, password, passwordConfirm);
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

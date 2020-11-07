/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './auth';
import { displayMap } from './mapbox';

const map = document.getElementById('map');
const form = document.querySelector('form.form');
const logoutButton = document.querySelector('.nav__el--logout');

if (map) {
  const locations = JSON.parse(map.dataset['locations']);
  displayMap(locations);
}

if (form)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logoutButton) logoutButton.addEventListener('click', logout);

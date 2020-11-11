/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './auth';
import { updateMyData, updateMyPassword } from './updateSettings';
import { displayMap } from './mapbox';

const map = document.getElementById('map');
const form = document.querySelector('form.form__login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateMyDataForm = document.querySelector('form.form-user-data');
const updateMyPasswordForm = document.querySelector('form.form-user-settings');

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

if (updateMyDataForm) {
  updateMyDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form.keys());

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

/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async data => {
  try {
    const res = await axios({
      url: '/api/v1/users/login',
      method: 'POST',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(location.assign.bind(location, '/'), 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully');
      window.setTimeout(location.assign.bind(location, '/'), 500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out, try again.');
  }
};

export const signup = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully');
      window.setTimeout(location.assign.bind(location, '/'), 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

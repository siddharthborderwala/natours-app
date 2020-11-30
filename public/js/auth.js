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

export const forgotPassword = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgot-password',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reset token sent to your email');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (data, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/reset-password/${token}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successfully');
      window.setTimeout(location.assign.bind(location, '/'), 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

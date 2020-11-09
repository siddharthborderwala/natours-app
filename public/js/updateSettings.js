import axios from 'axios';
import { showAlert } from './alert';

export const updateMyData = async (name, email) => {
  try {
    const res = await axios({
      url: 'http://127.0.0.1:/api/v1/users/me',
      method: 'POST',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account settings successfully updates');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateMyPassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      url: '127.0.0.1/api/v1/users/update-my-password',
      method: 'POST',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

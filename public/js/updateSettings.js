import axios from 'axios';
import { showAlert } from './alert';

const reloadAfterUpdate = () => {
  setTimeout(location.reload.bind(location, true), 1500);
};

export const updateMyData = async data => {
  try {
    const res = await axios({
      url: `${process.env.URL}api/v1/users/me`,
      method: 'PATCH',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account settings successfully updates');
      reloadAfterUpdate();
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
      url: `${process.env.URL}api/v1/users/update-my-password`,
      method: 'POST',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully');
      reloadAfterUpdate();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

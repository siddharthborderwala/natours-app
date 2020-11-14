/* eslint-disable */

export const showAlert = (type, msg, timeout = 4000) => {
  // remove a previously created alert
  const currentAlert = document.querySelector('.alert');
  if (currentAlert) currentAlert.remove();

  // create a new alert element
  const element = document.createElement('div');
  element.classList.add('alert', `alert--${type}`);
  element.textContent = msg;

  // insert it into the body
  document.querySelector('body').insertAdjacentElement('afterbegin', element);

  // shrink it before removing
  setTimeout(() => {
    element.classList.add('collapse');
  }, timeout - 100);

  //remove it after some time
  setTimeout(() => {
    element.remove();
  }, timeout);
};

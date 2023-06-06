import IMask from 'imask';
const input = document.querySelector('.hero__form-input');
const maskOptions = {
  mask: '+{7}(000)000-00-00'
  };
const mask = IMask(input, maskOptions);

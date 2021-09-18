const hidePreloader = () => {
  const preloader = document.querySelector('.js-preloader');
  preloader.style.display = 'none';
}

export default () => {
  window.addEventListener("load", hidePreloader);
}
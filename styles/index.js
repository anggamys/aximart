// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// const swiperHero = new Swiper('.swiper-resto', {
//   spaceBetween: 40,
//   slidesPerView: 'auto',
// });

const nav = document.querySelector('.nav__container');
const navWrapper = nav.querySelector('div.nav__wrapper');

const checkScroll = () => {
  if (window.scrollY > 5) {
    navWrapper.classList.add('rounded-xl', 'pl-4', 'bg-white/60', 'backdrop-blur-lg');
  } else {
    navWrapper.classList.remove('rounded-xl', 'pl-4', 'bg-white/60', 'backdrop-blur-lg');
  }
};

checkScroll();

window.addEventListener('scroll', checkScroll);

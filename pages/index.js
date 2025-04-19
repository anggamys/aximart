'use client';

import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout.js';
import { useState, useEffect, useCallback } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';

// Reusable components
const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-6 w-6 shrink-0 overflow-hidden">
          <Image src="/images/icons/star-yellow-fill.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
        </div>
      ))}
    </div>
    <div className="flex items-center gap-1 leading-none ml-2">
      <span className="text-lg font-semibold text-[#FFB800]" aria-label={`${rating} stars`}>
        {rating}
      </span>
      <span className="text-[#656565]">({reviews})</span>
    </div>
  </div>
);

const LocationBadge = ({ location }) => (
  <div className="flex items-center gap-[6px]">
    <div className="h-6 w-6 shrink-0 overflow-hidden">
      <Image src="/images/icons/location-fill-gray.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
    </div>
    <span className="text-[#656565]">{location}</span>
  </div>
);

const ActionButton = ({ text, href, className = '', onClick }) =>
  onClick ? (
    <button onClick={onClick} className={`inline-block ${className}`}>
      <div className="flex items-center rounded-xl bg-resto-bright-yellow px-7 py-4 transition-all hover:brightness-95 active:scale-95">
        <span className="font-semibold text-resto-black">{text}</span>
        <div className="h-6 w-6 shrink-0 overflow-hidden ml-2">
          <Image src="/images/icons/path-right-black.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
        </div>
      </div>
    </button>
  ) : (
    <Link href={href || '#'} className={`inline-block ${className}`}>
      <div className="flex items-center rounded-xl bg-resto-bright-yellow px-7 py-4 transition-all hover:brightness-95 active:scale-95">
        <span className="font-semibold text-resto-black">{text}</span>
        <div className="h-6 w-6 shrink-0 overflow-hidden ml-2">
          <Image src="/images/icons/path-right-black.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );

const SectionHeading = ({ eyebrow, title, description, id }) => (
  <div className="flex flex-col gap-[6px]">
    {eyebrow && <p className="font-semibold uppercase text-[#5A4FCF]">{eyebrow}</p>}
    {title && (
      <h2 id={id} className="text-[28px] font-semibold text-resto-black">
        {title}
      </h2>
    )}
    {description && <p className="text-[#656565] max-w-prose">{description}</p>}
  </div>
);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  const featuredProducts = [
    {
      name: 'Skarisa Sandwich',
      rating: '5.0',
      reviews: '5.2K+',
      price: 'IDR 75.000',
      image: '/images/sandwich.png',
      description: 'A delicious sandwich with fresh vegetables and premium chicken fillet.',
    },
  ];

  const sliderImages = ['churros.png', 'gado-gado.png', 'makaroni.png', 'pisang-uwu.png', 'sandwich.png'];
  const sliderTitles = ['Churros Delight', 'Classic Gado-Gado', 'Makaroni Special', 'Pisang Uwu', 'Skarisa Sandwich'];

  const benefits = [
    {
      title: 'Special Deals',
      description: 'Get exclusive discounts when you shop through our official store',
      icon: '/images/icons/decor/discount.svg',
    },
    {
      title: 'Fast Delivery',
      description: 'Enjoy quick delivery to your doorstep within 60 minutes or less',
      icon: '/images/icons/decor/fork-knife.svg',
    },
    {
      title: 'Free Shipping',
      description: 'Free delivery on orders above IDR 100.000 within the city',
      icon: '/images/icons/decor/money-bag.svg',
    },
    {
      title: 'Quality Guaranteed',
      description: 'We ensure the freshness and quality of all our food products',
      icon: '/images/icons/decor/charm.svg',
    },
  ];

  const popularProducts = [
    {
      name: 'Pisang Uwu',
      link: 'pisang-uwu',
      rating: '5.0',
      reviews: '7.6K+',
      seller: 'Sushi Master',
      image: 'pisang-uwu.png',
      price: 'IDR 45.000',
    },
    {
      name: 'Pancake Saudara',
      link: 'pancake-saudara',
      rating: '5.0',
      reviews: '7.6K+',
      seller: 'Pasta House',
      image: 'pancake.png',
      price: 'IDR 65.000',
    },
    {
      name: 'Skarisa Sandwich',
      link: 'sandwich-skarisa',
      rating: '5.0',
      reviews: '7.6K+',
      seller: 'Burger Lab',
      image: 'sandwich.png',
      price: 'IDR 75.000',
    },
    {
      name: 'Churros Delight',
      link: 'churros-delight',
      rating: '4.9',
      reviews: '5.2K+',
      seller: 'Sweet Treats',
      image: 'churros.png',
      price: 'IDR 55.000',
    },
  ];

  const nearbyMerchants = [
    {
      name: 'Batavia Delights',
      rating: '5.0',
      reviews: '6.6K+',
      priceRange: 'IDR 29.000 - IDR 259.999',
      image: '/images/thumbnails/thumbnail-8.png',
      distance: '1.2 km',
      category: 'Indonesian',
    },
    {
      name: 'Ascent Healthy Bowl',
      rating: '5.0',
      reviews: '3.6K+',
      priceRange: 'IDR 49.999 - IDR 560.000',
      image: '/images/thumbnails/thumbnail-6.png',
      distance: '0.8 km',
      category: 'Healthy',
    },
    {
      name: 'Fracture Desserts',
      rating: '5.0',
      reviews: '11K+',
      priceRange: 'IDR 29.999 - IDR 560.000',
      image: '/images/thumbnails/thumbnail-7.png',
      distance: '2.5 km',
      category: 'Desserts',
    },
  ];

  // Auto slider functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sliderImages.length) % sliderImages.length);
  }, [sliderImages.length]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);

  const handleAddToCart = () => {
    setCartItemCount((prev) => prev + 1);
    // Show toast notification here
    const notification = document.getElementById('cart-notification');
    if (notification) {
      notification.classList.remove('opacity-0', 'translate-y-2');
      notification.classList.add('opacity-100', 'translate-y-0');

      setTimeout(() => {
        notification.classList.remove('opacity-100', 'translate-y-0');
        notification.classList.add('opacity-0', 'translate-y-2');
      }, 3000);
    }
  };

  return (
    <Layout title="Home - Food Delivery & Online Ordering" description="Discover and order delicious food from the best merchants across Indonesia">
      {/* Cart notification toast */}
      <div id="cart-notification" className="fixed top-24 right-6 z-50 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 transition-all duration-300 transform opacity-0 translate-y-2">
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-resto-black">Item added to cart!</p>
          <p className="text-sm text-[#656565]">You have {cartItemCount} items in your cart</p>
        </div>
      </div>

      <main className="mb-32 mt-36 overflow-x-hidden z-auto">
        {/* Hero Section with Featured Product */}
        <section aria-labelledby="featured-product" className="mx-auto max-w-[1440px]">
          <div className="relative mx-[60px] md:mx-6 sm:mx-4">
            {/* Featured Product Info Card */}
            <div className="absolute left-0 top-1/2 z-10 flex h-auto md:h-auto sm:relative sm:top-auto sm:z-0 sm:mb-6 w-[390px] sm:w-full -translate-y-1/2 sm:translate-y-0 flex-col justify-between gap-4 rounded-3xl bg-white px-6 py-6 shadow-lg">
              <div className="flex flex-col gap-1">
                <StarRating rating={featuredProducts[0].rating} reviews={featuredProducts[0].reviews} />
                <h1 className="text-[28px] font-semibold text-resto-black" id="featured-product">
                  {sliderTitles[currentSlide]}
                </h1>
                <p className="text-lg font-semibold text-[#656565]">{featuredProducts[0].price}</p>
                <p className="text-[#656565] mt-2 hidden sm:block">{featuredProducts[0].description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {/* <ActionButton text="Add to Cart" onClick={() => handleAddToCart(sliderTitles[currentSlide])} className="w-fit" /> */}
                <Link href={`/product/${sliderTitles[currentSlide].toLowerCase().replace(/\s+/g, '-')}`} className="mt-2 sm:mt-0 text-[#5A4FCF] font-medium hover:underline">
                  View Details
                </Link>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative pl-[80px] sm:pl-0">
              <div className="relative overflow-hidden rounded-3xl">
                {sliderImages.map((img, idx) => (
                  <div key={idx} className={`h-[564px] sm:h-[400px] w-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <Image src={`/images/${img}`} alt={sliderTitles[idx]} width={1128} height={564} className="object-cover w-full h-full" priority={idx === 0} loading={idx === 0 ? 'eager' : 'lazy'} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-50"></div>
                  </div>
                ))}

                {/* Carousel Controls */}
                <div className="absolute z-20 bottom-0 left-0 right-0 flex justify-between p-6">
                  <div className="flex gap-2">
                    {sliderImages.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-resto-bright-yellow w-6' : 'bg-white bg-opacity-60'}`}
                        onClick={() => {
                          setCurrentSlide(idx);
                          pauseAutoPlay();
                          setTimeout(resumeAutoPlay, 10000);
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      aria-label="Previous slide"
                      className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      onClick={() => {
                        prevSlide();
                        pauseAutoPlay();
                        setTimeout(resumeAutoPlay, 10000);
                      }}
                    >
                      <Image src="/images/icons/path-left-black.svg" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                    </button>
                    <button
                      aria-label="Next slide"
                      className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      onClick={() => {
                        nextSlide();
                        pauseAutoPlay();
                        setTimeout(resumeAutoPlay, 10000);
                      }}
                    >
                      <Image src="/images/icons/path-right-black.svg" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar Section - NEW */}
        <section className="mx-auto mt-8 max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white shadow-md rounded-2xl p-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-[6px] rounded-xl bg-[#F2F2F2] px-6 py-4 w-full sm:w-auto">
                  <div className="h-6 w-6 shrink-0 overflow-hidden">
                    <Image src="/images/icons/location-fill-gray.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                  </div>
                  <button className="flex items-center">
                    <span className="font-medium text-[#656565]">Jakarta, Indonesia</span>
                    <div className="h-6 w-6 shrink-0 overflow-hidden ml-2">
                      <Image src="/images/icons/path-down-black.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#F2F2F2] px-4 py-3 w-full sm:w-auto">
                <div className="h-6 w-6 shrink-0 overflow-hidden">
                  <Image src="/images/icons/search-black.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                </div>
                <input type="text" placeholder="Search for food, restaurants..." className="bg-transparent flex-1 outline-none text-[#656565]" />
              </div>

              <button className="hidden sm:flex items-center justify-center bg-resto-bright-yellow px-6 py-3 rounded-xl hover:brightness-95">
                <span className="font-semibold text-resto-black">Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section aria-labelledby="benefits-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-[6px]">
              <p className="font-semibold uppercase text-[#5A4FCF]">Our Benefits</p>
              <h2 id="benefits-heading" className="text-[28px] font-semibold text-resto-black text-center">
                Why Shop With Us?
              </h2>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {benefits.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="group flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-md transition-all hover:shadow-lg">
                    <div className="flex flex-col items-center px-6 pt-6">
                      <div className="flex aspect-square w-[64px] items-center justify-center overflow-hidden rounded-full bg-resto-bright-yellow/15">
                        <Image src={item.icon} alt="" width={32} height={32} className="object-contain" aria-hidden="true" />
                      </div>
                      <h3 className="mt-6 text-lg font-semibold text-resto-black">{item.title}</h3>
                      <p className="mt-3 text-center text-[#656565]">{item.description}</p>
                    </div>
                    <div className="relative flex items-center justify-center p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-resto-bright-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative z-10 font-semibold text-resto-black">Learn More</span>
                      <div className="relative z-10 ml-2 h-6 w-6 shrink-0 overflow-hidden">
                        <Image src="/images/icons/path-right-black.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section aria-labelledby="popular-products-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4 flex flex-col items-start gap-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
              <SectionHeading
                eyebrow="Top Featured Products"
                title="Most Popular Dishes"
                description="Our best-selling dishes have been raved about by customers for their exceptional taste and quality."
                id="popular-products-heading"
              />
              <ActionButton text="Browse All Products" href="/products" className="mt-4 sm:mt-0" />
            </div>

            {/* Product Grid - Updated to better showcase products */}
            <div className="w-full grid grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {popularProducts.map((product, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="h-[240px] w-full overflow-hidden">
                    <Image
                      src={`/images/${product.image}`}
                      alt={product.name}
                      width={400}
                      height={240}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <StarRating rating={product.rating} reviews={product.reviews} />
                      <span className="font-semibold text-[#5A4FCF]">{product.price}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-resto-black mt-2">{product.name}</h3>
                    <LocationBadge location={product.seller} />

                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/product/${product.link}`} className="text-[#5A4FCF] font-medium hover:underline">
                        View Details
                      </Link>
                      <button onClick={() => handleAddToCart(product.name)} className="h-10 w-10 rounded-xl bg-resto-bright-yellow flex items-center justify-center transition-transform hover:scale-105">
                        {/* <Image src="/images/icons/cart-add.svg" alt="Add to cart" width={24} height={24} className="h-6 w-6 object-contain" /> */}
                        <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Section: Categories - NEW */}
        {/* <section aria-labelledby="categories-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <SectionHeading eyebrow="Browse By Category" title="Food Categories" description="Explore our wide range of food categories to find exactly what you're craving." id="categories-heading" />

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {['Indonesian', 'Japanese', 'Italian', 'Fast Food', 'Healthy', 'Desserts', 'Coffee', 'Bakery'].map((category, idx) => (
                <Link key={idx} href={`/category/${category.toLowerCase()}`} className="block">
                  <div className="flex flex-col items-center justify-center group">
                    <div className="h-24 w-24 rounded-full bg-[#F2F2F2] flex items-center justify-center mb-2 group-hover:bg-resto-bright-yellow/20 transition-colors">
                      <div className="h-12 w-12 shrink-0 overflow-hidden">
                        <Image src={`/images/icons/category-${idx + 1}.svg`} alt="" width={48} height={48} className="object-contain" aria-hidden="true" />
                      </div>
                    </div>
                    <span className="font-medium text-resto-black">{category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Nearby Merchants Section */}
        <section aria-labelledby="nearby-merchants-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4 flex flex-col items-center">
            <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <SectionHeading eyebrow="Food Merchants By City" title="Popular Food Sellers Near You" id="nearby-merchants-heading" />
              <div className="flex items-center gap-[6px] rounded-xl bg-[#F2F2F2] px-6 py-5 mt-4 sm:mt-0">
                <div className="h-6 w-6 shrink-0 overflow-hidden">
                  <Image src="/images/icons/location-fill-gray.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                </div>
                <button className="flex items-center">
                  <span className="font-medium text-[#656565]">Jakarta, Indonesia</span>
                  <div className="h-6 w-6 shrink-0 overflow-hidden ml-2">
                    <Image src="/images/icons/path-down-black.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-5 w-full">
              {nearbyMerchants.map((merchant, index) => (
                <Link key={index} href={`/merchant/${merchant.name.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                  <div className="relative group">
                    <div className="h-[415px] w-full shrink-0 overflow-hidden rounded-3xl">
                      <Image
                        src={merchant.image}
                        alt={merchant.name}
                        width={427}
                        height={415}
                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md">
                        <span className="text-sm font-medium text-[#5A4FCF]">{merchant.category}</span>
                      </div>
                      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 shadow-md flex items-center gap-1">
                        <div className="h-6 w-6 shrink-0 overflow-hidden">
                          <Image src="/images/icons/location-fill-black.svg" alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium text-[#5A4FCF]">{merchant.distance}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-[33px] left-1/2 w-full -translate-x-1/2 px-6">
                      <div className="flex h-auto min-h-[134px] w-full max-w-[379px] mx-auto items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                        <div className="flex flex-col gap-1">
                          <StarRating rating={merchant.rating} reviews={merchant.reviews} />
                          <h3 className="text-lg font-semibold text-resto-black">{merchant.name}</h3>
                          <p className="text-[#656565]">{merchant.priceRange}</p>
                        </div>
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-resto-bright-yellow p-[6px] transition-transform hover:scale-105">
                          <Image src="/images/icons/arrow-right-black.svg" alt="" width={24} height={24} className="object-contain" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-14">
              <ActionButton text="View All Merchants" href="/merchants" />
            </div>
          </div>
        </section>

        {/* CTA Section - NEW */}
        {/* CTA Section - NEW */}
        <section className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <div className="relative overflow-hidden rounded-3xl bg-[#5A4FCF] py-16 px-10 sm:px-6">
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
                <div className="h-64 w-64 rounded-full bg-[#7A70E9] opacity-30 blur-3xl" />
              </div>
              <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4">
                <div className="h-64 w-64 rounded-full bg-[#7A70E9] opacity-30 blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex flex-col items-start gap-6 text-white max-w-lg">
                  <h2 className="text-4xl font-bold">Download Our App</h2>
                  <p className="text-white/80">Get exclusive offers, real-time order tracking, and a personalized experience. Download our mobile app today!</p>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link href="#" className="flex items-center gap-2 bg-white rounded-xl px-6 py-3 hover:bg-opacity-90 transition-colors">
                      <div className="h-8 w-8 shrink-0 overflow-hidden">
                        <Image src="/images/icons/app-store.svg" alt="App Store" width={32} height={32} className="object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-resto-black">Download on the</span>
                        <span className="font-semibold text-resto-black">App Store</span>
                      </div>
                    </Link>

                    <Link href="#" className="flex items-center gap-2 bg-white rounded-xl px-6 py-3 hover:bg-opacity-90 transition-colors">
                      <div className="h-8 w-8 shrink-0 overflow-hidden">
                        <Image src="/images/icons/play-store.svg" alt="Play Store" width={32} height={32} className="object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-resto-black">Get it on</span>
                        <span className="font-semibold text-resto-black">Google Play</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="relative h-[320px] w-[240px] sm:h-[400px] sm:w-[300px]">
                  <Image src="/images/app-mockup.png" alt="Mobile App" width={300} height={400} className="object-contain h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - NEW */}
        <section aria-labelledby="testimonials-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <SectionHeading
              eyebrow="What People Say"
              title="Customer Testimonials"
              description="Hear from our satisfied customers about their experience ordering from our platform."
              id="testimonials-heading"
            />

            <div className="mt-10 grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6">
              {[
                {
                  name: 'Sarah Johnson',
                  avatar: '/images/photos/image.png',
                  review: 'The food arrived still hot and fresh. The delivery was faster than expected, and the app is very easy to use. Will definitely order again!',
                  rating: 5,
                },
                {
                  name: 'Michael Chen',
                  avatar: '/images/photos/image.png',
                  review: "I love the variety of restaurants available. The filter options make it easy to find exactly what I'm craving. Great service overall!",
                  rating: 5,
                },
                {
                  name: 'Amira Hassan',
                  avatar: '/images/photos/image.png',
                  review: "The special deals and discounts are amazing! I've saved so much money while enjoying delicious food from my favorite restaurants.",
                  rating: 5,
                },
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="object-cover h-full w-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-resto-black">{testimonial.name}</h4>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="h-4 w-4 shrink-0 overflow-hidden">
                            <Image src="/images/icons/star-yellow-fill.svg" alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#656565]">{testimonial.review}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/testimonials" className="text-[#5A4FCF] font-medium hover:underline">
                Read More Testimonials
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section - NEW */}
        <section className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <div className="bg-[#F9F9F9] rounded-3xl p-10 sm:p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <h2 className="text-2xl font-semibold text-resto-black mb-2">Join Our Newsletter</h2>
                  <p className="text-[#656565]">Subscribe to our newsletter to receive updates on new products, special deals, and exclusive offers.</p>
                </div>

                <div className="w-full lg:w-auto">
                  <form className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1 w-full">
                      <input type="email" placeholder="Enter your email address" className="w-full px-6 py-4 rounded-xl border border-[#E0E0E0] focus:outline-none focus:border-[#5A4FCF]" required />
                    </div>
                    <button type="submit" className="bg-resto-bright-yellow px-8 py-4 rounded-xl font-semibold text-resto-black hover:brightness-95 transition-all">
                      Subscribe
                    </button>
                  </form>
                  <p className="text-sm text-[#656565] mt-2">By subscribing, you agree to our Privacy Policy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - NEW */}
        <section aria-labelledby="how-it-works-heading" className="mx-auto mt-20 lg:mt-16 md:mt-14 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4">
            <SectionHeading eyebrow="Simple Process" title="How It Works" description="Order your favorite food in just a few simple steps" id="how-it-works-heading" />

            <div className="mt-10 grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {[
                {
                  step: '1',
                  title: 'Choose a Restaurant',
                  description: 'Browse through our wide selection of restaurants and food options',
                  icon: '/images/icons/step-1.svg',
                },
                {
                  step: '2',
                  title: 'Select Your Meal',
                  description: 'Pick your favorite dishes and add them to your cart',
                  icon: '/images/icons/step-2.svg',
                },
                {
                  step: '3',
                  title: 'Checkout & Payment',
                  description: 'Complete your order with our secure payment options',
                  icon: '/images/icons/step-3.svg',
                },
                {
                  step: '4',
                  title: 'Enjoy Your Food',
                  description: 'Wait for your delicious meal to be delivered to your doorstep',
                  icon: '/images/icons/step-4.svg',
                },
              ].map((step, idx) => (
                <div key={idx} className="relative bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-resto-bright-yellow flex items-center justify-center font-bold text-resto-black text-xl">{step.step}</div>
                  <div className="h-16 w-16 mb-4">
                    <Image src={step.icon} alt="" width={64} height={64} className="object-contain" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-resto-black mb-2">{step.title}</h3>
                  <p className="text-[#656565]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

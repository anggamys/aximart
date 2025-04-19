'use client';

import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout.js';
import { useState } from 'react';

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

const ActionButton = ({ text, href, className = '' }) => (
  <Link href={href || '#'} className={`inline-block ${className}`}>
    <div className="flex items-center rounded-xl bg-resto-bright-yellow px-7 py-4 transition-all hover:brightness-95 active:scale-98">
      <span className="font-semibold text-resto-black">{text}</span>
      <div className="h-6 w-6 shrink-0 overflow-hidden ml-2">
        <Image src="/images/icons/path-right-black.svg" alt="" width={24} height={24} className="object-contain w-full h-full" aria-hidden="true" />
      </div>
    </div>
  </Link>
);

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="flex flex-col gap-[6px]">
    {eyebrow && <p className="font-semibold uppercase text-[#5A4FCF]">{eyebrow}</p>}
    {title && <h2 className="text-[28px] font-semibold text-resto-black">{title}</h2>}
    {description && <p className="text-[#656565]">{description}</p>}
  </div>
);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      name: 'Skarisa Sandwich',
      rating: '5.0',
      reviews: '5.2K+',
      price: 'IDR 75.000',
      image: '/images/sandwich.png',
    },
  ];

  const sliderImages = ['churros.png', 'gado-gado.png', 'makaroni.png', 'pisang-uwu.png', 'sandwich.png'];

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
    },
    {
      name: 'Pancake Saudara',
      link: 'Pancake-saudara',
      rating: '5.0',
      reviews: '7.6K+',
      seller: 'Pasta House',
      image: 'pancake.png',
    },
    {
      name: 'Skarisa Sandwich',
      link: 'sandwich-skarisa',
      rating: '5.0',
      reviews: '7.6K+',
      seller: 'Burger Lab',
      image: 'sandwich.png',
    },
  ];

  const nearbyMerchants = [
    {
      name: 'Batavia Delights',
      rating: '5.0',
      reviews: '6.6K+',
      priceRange: 'IDR 29.000 - IDR 259.999',
      image: '/images/thumbnails/thumbnail-8.png',
    },
    {
      name: 'Ascent Healthy Bowl',
      rating: '5.0',
      reviews: '3.6K+',
      priceRange: 'IDR 49.999 - IDR 560.000',
      image: '/images/thumbnails/thumbnail-6.png',
    },
    {
      name: 'Fracture Desserts',
      rating: '5.0',
      reviews: '11K+',
      priceRange: 'IDR 29.999 - IDR 560.000',
      image: '/images/thumbnails/thumbnail-7.png',
    },
  ];

  return (
    <Layout title="Home" description="Discover and order delicious food from the best merchants across Indonesia">
      <main className="mb-32 mt-44 overflow-x-hidden z-auto">
        {/* Hero Section with Featured Product */}
        <section aria-labelledby="featured-product" className="mx-auto max-w-[1440px]">
          <div className="relative mx-[60px] md:mx-6 sm:mx-4">
            <div className="absolute left-0 top-1/2 z-10 flex h-auto md:h-auto sm:relative sm:top-auto sm:z-0 sm:mb-6 w-[390px] sm:w-full -translate-y-1/2 sm:translate-y-0 flex-col justify-between gap-4 rounded-3xl bg-white px-6 py-6 shadow-md">
              <div className="flex flex-col gap-1">
                <StarRating rating={featuredProducts[0].rating} reviews={featuredProducts[0].reviews} />
                <h3 className="text-[22px] font-semibold text-resto-black" id="featured-product">
                  {featuredProducts[0].name}
                </h3>
                <p className="text-lg font-semibold text-[#656565]">{featuredProducts[0].price}</p>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <ActionButton text="Add to Cart" href="/product/sandwich-skarisa" className="w-fit" />
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative pl-[80px] sm:pl-0">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {sliderImages.map((img, idx) => (
                  <div key={idx} className={`flex-shrink-0 ${currentSlide === idx ? 'opacity-100' : 'opacity-80'}`}>
                    <div className="h-[564px] sm:h-[400px] w-[1128px] sm:w-full shrink-0 overflow-hidden rounded-3xl">
                      <Image
                        src={`/images/${img}`}
                        alt={idx === 0 ? `${featuredProducts[0].name}` : ''}
                        width={1128}
                        height={564}
                        className="object-cover w-full h-full"
                        priority={idx === 0}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls - Optional */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-resto-bright-yellow' : 'bg-white bg-opacity-60'}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section aria-labelledby="benefits-heading" className="mx-auto mt-24 lg:mt-20 md:mt-16 w-full max-w-[1440px]">
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
                  <div className="group flex h-full min-h-[347px] flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-md transition-all hover:shadow-lg">
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
        <section aria-labelledby="popular-products-heading" className="mx-auto mt-24 lg:mt-20 md:mt-16 w-full max-w-[1440px]">
          <div className="mx-[60px] md:mx-6 sm:mx-4 flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Left Column */}
            <div className="flex min-h-[300px] w-full max-w-[367px] flex-col justify-between gap-4">
              <SectionHeading
                eyebrow="Top 3 Featured Products"
                title="Most Popular Dishes"
                description="Our best-selling dishes have been raved about by customers for their exceptional taste, quality ingredients, and value for money."
                id="popular-products-heading"
              />
              <ActionButton text="Browse All Products" href="/products" className="mt-4" />
            </div>

            {/* Right Column - Featured Products */}
            <div className="w-full lg:max-w-[calc(100%-400px)] overflow-x-auto">
              <div className="flex gap-5 pb-4">
                {popularProducts.map((product, idx) => (
                  <Link key={idx} href={`/product/${product.link}`} className="block">
                    <div className="group relative overflow-hidden">
                      <div className="h-[475px] w-[214px] shrink-0 overflow-hidden rounded-3xl transition-all duration-300 group-hover:w-[400px]">
                        <Image src={`/images/${product.image}`} alt={product.name} width={400} height={475} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="absolute -bottom-36 left-1/2 flex h-[131px] w-full max-w-[352px] -translate-x-1/2 items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md transition-all duration-300 group-hover:bottom-6">
                        <div className="flex flex-col gap-1">
                          <StarRating rating={product.rating} reviews={product.reviews} />
                          <h3 className="text-lg font-semibold text-resto-black">{product.name}</h3>
                          <LocationBadge location={product.seller} />
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-resto-bright-yellow p-[6px] transition-transform hover:scale-105">
                          <Image src="/images/icons/arrow-right-black.svg" alt="" width={24} height={24} className="h-full w-full object-contain" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Merchants Section */}
        <section aria-labelledby="nearby-merchants-heading" className="mx-auto mt-24 lg:mt-20 md:mt-16 w-full max-w-[1440px]">
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
                <Link key={index} href={`/merchant/${index + 10}`} className="block">
                  <div className="relative">
                    <div className="h-[415px] w-full shrink-0 overflow-hidden rounded-3xl">
                      <Image src={merchant.image} alt={merchant.name} width={427} height={415} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute bottom-[33px] left-1/2 w-full -translate-x-1/2 px-6">
                      <div className="flex h-auto min-h-[134px] w-full max-w-[379px] mx-auto items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                        <div className="flex flex-col gap-1">
                          <StarRating rating={merchant.rating} reviews={merchant.reviews} />
                          <h3 className="text-lg font-semibold text-resto-black">{merchant.name}</h3>
                          <p className="text-lg font-semibold text-[#656565]">{merchant.priceRange}</p>
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
      </main>
    </Layout>
  );
}

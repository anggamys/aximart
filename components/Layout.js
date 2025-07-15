/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu, Transition } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { SearchIcon, ShoppingCartIcon, MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Update cart items count whenever cart changes
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Aximart' : 'Aximart'}</title>
        <meta name="description" content="Aximart - Your Trusted Online Shopping Destination" />
        <link rel="icon" href="/aximart.png" />
      </Head>

      <ToastContainer position="top-center" limit={3} autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav
            className={`flex items-center px-4 justify-between fixed w-full z-50 transition-all duration-300 ${
              isScrolled ? 'h-16 shadow-md bg-white/95 backdrop-blur-lg' : 'h-20 bg-white/80 backdrop-blur-sm'
            }`}
          >
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 focus:outline-none" onClick={toggleMenu}>
              {isMenuOpen ? <XIcon className="h-6 w-6 text-gray-700" /> : <MenuIcon className="h-6 w-6 text-gray-700" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-lg font-bold flex items-center gap-2">
                <img src="/aximart.png" className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" />
                <span className="hidden sm:inline">Aximart</span>
              </div>
            </Link>

            {/* Search Form */}
            <form onSubmit={submitHandler} className="hidden md:flex mx-auto w-full max-w-md justify-center relative">
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-l-full p-2 pl-4 text-sm w-full border-gray-300 focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                placeholder="Cari produk"
              />
              <button className="rounded-r-full bg-amber-300 hover:bg-amber-400 transition-colors p-2 px-4 text-sm text-gray-800" type="submit">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2" onClick={() => router.push('/search')}>
              <SearchIcon className="h-6 w-6" />
            </button>

            {/* User Menu & Cart */}
            <div className="flex items-center space-x-1">
              <Link href="/cart" className="p-2 flex items-center relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-amber-500 transition-colors" />
                {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{cartItemsCount}</span>}
              </Link>

              {status === 'loading' ? (
                <div className="p-2 animate-pulse">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              ) : session?.user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center p-2 text-sm font-medium text-gray-700 hover:text-amber-500 transition-colors focus:outline-none">
                    <span className="hidden sm:inline mr-1">{session.user.name}</span>
                    <UserIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg p-2 focus:outline-none ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <DropdownLink className={`block px-4 py-2 text-sm rounded-md ${active ? 'bg-gray-100 text-amber-500' : 'text-gray-700'}`} href="/profile">
                              Profile
                            </DropdownLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <DropdownLink className={`block px-4 py-2 text-sm rounded-md ${active ? 'bg-gray-100 text-amber-500' : 'text-gray-700'}`} href="/order-history">
                              Order History
                            </DropdownLink>
                          )}
                        </Menu.Item>
                      </div>

                      {session.user.isAdmin && (
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <DropdownLink className={`block px-4 py-2 text-sm rounded-md ${active ? 'bg-gray-100 text-amber-500' : 'text-gray-700'}`} href="/admin/dashboard">
                                Admin Dashboard
                              </DropdownLink>
                            )}
                          </Menu.Item>
                        </div>
                      )}

                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button className={`block w-full text-left px-4 py-2 text-sm rounded-md ${active ? 'bg-gray-100 text-red-500' : 'text-gray-700'}`} onClick={logoutClickHandler}>
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Link href="/login" className="p-2 text-sm font-medium text-gray-700 hover:text-amber-500 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>

          <div className={`fixed top-16 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
              <form
                onSubmit={(e) => {
                  submitHandler(e);
                  toggleMenu();
                }}
                className="mb-6"
              >
                <div className="flex">
                  <input
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    className="rounded-l-md p-2 text-sm w-full border-gray-300 focus:ring-amber-300 focus:border-transparent"
                    placeholder="Cari produk"
                  />
                  <button className="rounded-r-md bg-amber-300 p-2 text-sm text-gray-800" type="submit">
                    <SearchIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>

              <nav className="space-y-1">
                <Link href="/home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                  Home
                </Link>
                <Link href="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                  Cart
                </Link>
                {session?.user ? (
                  <>
                    <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                      Profile
                    </Link>
                    <Link href="/order-history" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                      Order History
                    </Link>
                    {session.user.isAdmin && (
                      <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        logoutClickHandler();
                        toggleMenu();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMenu}>
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto mt-24 px-4 pb-12 flex-grow">{children}</main>

        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            {/* TOP SECTION: Logo & Links */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
              {/* LOGO + TAGLINE */}
              <div className="flex-1 min-w-[200px]">
                <Link href="/home" className="flex items-center">
                  <img src="/aximart.png" alt="Aximart logo" className="w-10 h-10 mr-2 rounded" />
                  <span className="text-xl font-semibold">Aximart</span>
                </Link>
                <p className="mt-2 text-sm text-gray-600 max-w-xs">Your trusted online shopping destination.</p>
              </div>
              {/* LINKS GRID */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {/* SHOP */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase mb-4 tracking-wide">Shop</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/search" className="hover:text-amber-500 transition">
                          All Products
                        </Link>
                      </li>
                      <li>
                        <Link href="/search?category=electronics" className="hover:text-amber-500 transition">
                          Electronics
                        </Link>
                      </li>
                      <li>
                        <Link href="/search?category=clothing" className="hover:text-amber-500 transition">
                          Clothing
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* ACCOUNT */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase mb-4 tracking-wide">Account</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/profile" className="hover:text-amber-500 transition">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link href="/order-history" className="hover:text-amber-500 transition">
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link href="/cart" className="hover:text-amber-500 transition">
                          Cart
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* ABOUT */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase mb-4 tracking-wide">About</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/about" className="hover:text-amber-500 transition">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="hover:text-amber-500 transition">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="hover:text-amber-500 transition">
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Copyright & Social */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p className="text-center md:text-left">&copy; {new Date().getFullYear()} jstcode.hub. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="https://github.com/anggamys" className="hover:text-amber-500 transition" aria-label="Github" title="Github" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1
            c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1
            c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6
            C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6
            c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5
            c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"
                    />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/moh-angga" className="hover:text-amber-500 transition" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 30 30">
                    <path
                      d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95
            v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719
            C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517
            c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533
            c2.987,0,3.539,1.966,3.539,4.522V22z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

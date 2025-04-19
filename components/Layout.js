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
            <Link href="/home" className="flex items-center">
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

        <footer className="bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <Link href="/home" className="flex items-center">
                  <img src="/aximart.png" className="w-10 h-10 mr-2" />
                  <span className="text-xl font-semibold">Aximart</span>
                </Link>
                <p className="mt-2 text-sm text-gray-600">Your trusted online shopping destination.</p>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Shop</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>
                      <Link href="/search" className="hover:text-amber-500">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link href="/search?category=electronics" className="hover:text-amber-500">
                        Electronics
                      </Link>
                    </li>
                    <li>
                      <Link href="/search?category=clothing" className="hover:text-amber-500">
                        Clothing
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Account</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>
                      <Link href="/profile" className="hover:text-amber-500">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/order-history" className="hover:text-amber-500">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" className="hover:text-amber-500">
                        Cart
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">About</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>
                      <Link href="/about" className="hover:text-amber-500">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-amber-500">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="hover:text-amber-500">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
              <p>Copyright © {new Date().getFullYear()} jstcode.hub. All rights reserved.</p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="hover:text-amber-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-amber-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-amber-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
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

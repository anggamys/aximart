/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { SearchIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Aximart' : 'Aximart'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/aximart.png" />
      </Head>

      <ToastContainer position="top-center" limit={3} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md fixed w-full backdrop-blur-lg">
            <Link href="/">
              <div className="text-lg font-bold flex gap-2 align-middle">
                <img src="/aximart.png" width={35} height={35}></img>
                Aximart
              </div>
            </Link>
            <form onSubmit={submitHandler} className="mx-auto w-full justify-center flex">
              <input onChange={(e) => setQuery(e.target.value)} type="text" className="rounded-tr-none rounded-br-none p-1 text-sm w-24 md:w-48 focus:ring-0" placeholder="Cari produk" />
              <button className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black" type="submit" id="button-addon2">
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
            <div className="flex items-center">
              <Link href="/cart">
                <div className="p-2 flex">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemsCount > 0 && <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">{cartItemsCount}</span>}
                </div>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="">{session.user.name}</Menu.Button>
                  <Menu.Items className="absolute right-0 w-44 origin-top-right bg-white  shadow-lg p-3 rounded-lg">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <div className="dropdown-link" href="#" onClick={logoutClickHandler}>
                        Logout
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <div className="p-2">Login</div>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-14 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2023 jstcode.hub</p>
        </footer>
      </div>
    </>
  );
}

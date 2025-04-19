import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { ShoppingBagIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [isUpdating, setIsUpdating] = useState(false);

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.success('Produk telah dihapus dari keranjang');
  };

  const updateCartHandler = async (item, qty) => {
    try {
      setIsUpdating(true);
      const quantity = Number(qty);
      const { data } = await axios.get(`/api/products/${item._id}`);

      if (data.countInStock < quantity) {
        toast.error('Maaf, stok produk tidak mencukupi');
        return;
      }

      dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
      toast.success('Keranjang telah diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui keranjang');
    } finally {
      setIsUpdating(false);
    }
  };

  const incrementQuantity = async (item) => {
    if (item.quantity < item.countInStock) {
      await updateCartHandler(item, item.quantity + 1);
    }
  };

  const decrementQuantity = async (item) => {
    if (item.quantity > 1) {
      await updateCartHandler(item, item.quantity - 1);
    }
  };

  const subtotal = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const itemCount = cartItems.reduce((a, c) => a + c.quantity, 0);

  // Assume shipping cost and tax calculation
  const shippingCost = subtotal > 1000000 ? 0 : 20000;
  const tax = Math.round(subtotal * 0.1);
  const totalCost = subtotal + shippingCost + tax;

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Layout title="Keranjang Belanja">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCartIcon className="w-6 h-6 mr-2" />
          Keranjang Belanja
          {itemCount > 0 && <span className="ml-2 bg-blue-600 text-white text-sm rounded-full px-2 py-0.5">{itemCount} item</span>}
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Keranjang Anda kosong</h2>
            <p className="text-gray-600 mb-6">Sepertinya Anda belum menambahkan apapun ke keranjang Anda.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Mulai Berbelanja
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Item Keranjang ({itemCount})</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.slug} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                      {/* Product Image */}
                      <div className="w-full sm:w-20 h-20 mb-4 sm:mb-0 flex-shrink-0">
                        <Link href={`/product/${item.slug}`}>
                          <div className="relative h-20 w-20 rounded-md overflow-hidden">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform" />
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow sm:ml-6 flex flex-col sm:flex-row w-full justify-between">
                        <div className="mb-4 sm:mb-0">
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="text-base font-medium text-blue-600 hover:text-blue-800 transition-colors mb-1">{item.name}</h3>
                          </Link>

                          {item.brand && <p className="text-sm text-gray-500 mb-2">Brand: {item.brand}</p>}

                          <p className="text-lg font-semibold">Rp {formatPrice(item.price)}</p>
                        </div>

                        <div className="flex flex-col sm:items-end">
                          {/* Quantity Selector */}
                          <div className="flex items-center border rounded-md mb-4">
                            <button onClick={() => decrementQuantity(item)} disabled={item.quantity <= 1 || isUpdating} className="p-2 border-r hover:bg-gray-100 transition-colors">
                              <MinusIcon className="w-4 h-4" />
                            </button>

                            <span className="px-4 py-1 text-center min-w-[40px]">{item.quantity}</span>

                            <button onClick={() => incrementQuantity(item)} disabled={item.quantity >= item.countInStock || isUpdating} className="p-2 border-l hover:bg-gray-100 transition-colors">
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button onClick={() => removeItemHandler(item)} className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors">
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} item)</span>
                    <span>Rp {formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    {shippingCost === 0 ? <span className="text-green-600">Gratis</span> : <span>Rp {formatPrice(shippingCost)}</span>}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span>Rp {formatPrice(tax)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rp {formatPrice(totalCost)}</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => router.push('login?redirect=/shipping')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                  Lanjutkan ke Pembayaran
                </button>

                <Link href="/" className="block text-center mt-4 text-blue-600 hover:text-blue-800 transition-colors">
                  Lanjutkan Berbelanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });

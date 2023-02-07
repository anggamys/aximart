import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));

  const shippingPrice = itemsPrice > 100000 ? 0 : 1500;
  const totalPrice = round2(itemsPrice + shippingPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Detail Pesanan">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Detail Pesanan</h1>
      {cartItems.length === 0 ? (
        <div>
          Keranjang kosong. <Link href="/">Ayo berbelanja</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Alamat Pengiriman</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
              <div className="mt-4">
                <Link href="/shipping" className="primary-button mt-5 text-center">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Metode Pembayaran</h2>
              <div>{paymentMethod}</div>
              <div className="mt-4">
                <Link href="/payment" className="primary-button mt-5 text-center">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Barang yang dipesan</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Barang</th>
                    <th className="p-5 text-right">Jumlah</th>
                    <th className="p-5 text-right">Harga</th>
                    <th className="p-5 text-right">Total Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <div className="flex items-center">
                            <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md"></Image>
                            &nbsp;
                            {item.name}
                          </div>
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">Rp.{item.price}</td>
                      <td className="p-5 text-right">Rp.{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Link href="/cart" className="primary-button mt-5 text-center">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Ringkasan Pesanan</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Barang</div>
                    <div>Rp.{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Pengiriman</div>
                    <div>Rp.{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total Harga</div>
                    <div>Rp.{totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button disabled={loading} onClick={placeOrderHandler} className="primary-button w-full">
                    {loading ? 'Loading...' : 'Buat Pesanan'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;

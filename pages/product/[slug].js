import { React, useContext, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import axios from 'axios';
import Product from '../../models/Product';
import { toast } from 'react-toastify';
import { ChevronLeftIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/outline';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout title="Produk tidak ditemukan">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-xl font-bold mb-4">Produk tidak ditemukan</div>
          <Link href="/" className="primary-button">
            Kembali ke Beranda
          </Link>
        </div>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    try {
      const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
      const newQuantity = existItem ? existItem.quantity + quantity : quantity;
      const { data } = await axios.get(`/api/products/${product._id}`);

      if (data.countInStock < newQuantity) {
        return toast.error('Maaf, stok produk tidak mencukupi');
      }

      dispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity: newQuantity },
      });

      toast.success('Produk telah ditambahkan ke keranjang');
    } catch (error) {
      toast.error('Gagal menambahkan produk ke keranjang');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Layout title={product.name}>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center py-4 mb-4">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{product.category}</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {/* Product Image */}
          <div className="md:col-span-1">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.numReviews} ulasan)
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex">
                <span className="w-24 text-gray-600">Kategori:</span>
                <span className="font-medium">{product.category}</span>
              </div>

              <div className="flex">
                <span className="w-24 text-gray-600">Merek:</span>
                <span className="font-medium">{product.brand}</span>
              </div>

              <div className="flex">
                <span className="w-24 text-gray-600">Status:</span>
                <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.countInStock > 0 ? `Tersedia (${product.countInStock})` : 'Stok Habis'}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Deskripsi Produk:</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>

          {/* Purchase Box */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-800">Harga</span>
                <span className="text-2xl font-bold text-blue-600">Rp {product.price.toLocaleString('id-ID')}</span>
              </div>

              {product.countInStock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                  <div className="flex border rounded-md overflow-hidden">
                    <button onClick={decrementQuantity} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" disabled={quantity <= 1}>
                      -
                    </button>
                    <div className="flex-1 flex items-center justify-center font-medium">{quantity}</div>
                    <button onClick={incrementQuantity} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" disabled={quantity >= product.countInStock}>
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md font-medium text-white transition-colors ${
                  product.countInStock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={addToCartHandler}
                disabled={product.countInStock <= 0}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>{product.countInStock > 0 ? 'Tambahkan ke Keranjang' : 'Stok Habis'}</span>
              </button>

              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Pengiriman cepat</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Garansi 30 hari</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Pembayaran aman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

import { React, useContext } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import axios from 'axios';
import Product from '../../models/Product';
import { toast } from 'react-toastify';
import { ChevronLeftIcon } from '@heroicons/react/outline';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  if (!product) {
    return <Layout title="Produk tidak ditemukan">Produk tidak ditemukan</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Maaf, stok produk habis');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Produk telah ditambahkan ke keranjang');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2 w-32">
        <Link href="/" className="flex text-center primary-button">
          <ChevronLeftIcon className="w-6 h-6" />
          Kembali
        </Link>
      </div>
      <div className="grid md:grid-cols-6 md:gap-3">
        <div className="md:col-span-2">
          <Image src={product.image} alt={product.name} width={100} height={100} layout="responsive" className="rounded-md"></Image>
        </div>
        <div className="md:col-span-2">
          <ul className="p-4">
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Kategori: {product.category}</li>
            <li>Merek: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews}
            </li>
            <li>Deskripsi: {product.description}</li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Harga</div>
              <div>Rp.{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'Produk masih ada' : 'Stok produk kosong'}</div>
            </div>
            <button className="primary-button w-full" onClick={addToCartHandler}>
              Tambahkan ke keranjang
            </button>
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

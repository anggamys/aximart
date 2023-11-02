import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import AdminNav from '../../components/adminNav';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const router = useRouter();

  const [{ loading, error, products, loadingCreate, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const createHandler = async () => {
    if (!window.confirm('Apakah kamu yakin?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Produk telah berhasil ditambahkan');
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Apakah kamu yakin?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Produk telah berhasil dihapus');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Admin Products">
      <AdminNav>
        <div className="flex justify-between">
          <h1 className="mb-4 text-xl">Produk</h1>
          {loadingDelete && <div>Menghapus produk...</div>}
          <button disabled={loadingCreate} onClick={createHandler} className="primary-button">
            {loadingCreate ? 'Loading' : 'Tambah produk'}
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="p-5 text-left">Nama</th>
                  <th className="p-5 text-left">Harga</th>
                  <th className="p-5 text-left">Categori</th>
                  <th className="p-5 text-left">Jumlah</th>
                  <th className="p-5 text-left">Rating</th>
                  <th className="p-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className=" p-5 ">{product._id.substring(20, 24)}</td>
                    <td className=" p-5 ">{product.name}</td>
                    <td className=" p-5 ">Rp.{product.price}</td>
                    <td className=" p-5 ">{product.category}</td>
                    <td className=" p-5 ">{product.countInStock}</td>
                    <td className=" p-5 ">{product.rating}</td>
                    <td className=" p-5 gap-1 text-center">
                      <Link href={`/admin/product/${product._id}`}>
                        <div type="button" className="default-button w-full">
                          Edit
                        </div>
                      </Link>
                      &nbsp;
                      <button onClick={() => deleteHandler(product._id)} className="default-button w-full" type="button">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminNav>
    </Layout>
  );
}

AdminProdcutsScreen.auth = { adminOnly: true };

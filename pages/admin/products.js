import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import AdminNav from '../../components/AdminNav';
import DataTable from '../../components/DataTable';

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
      return state;
  }
}

export default function AdminProductsScreen() {
  const router = useRouter();

  const [{ loading, error, products, loadingCreate, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const createHandler = async () => {
    if (!window.confirm('Apakah kamu yakin ingin membuat produk baru?')) {
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

  const deleteHandler = async (product) => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus produk ini?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${product._id}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Produk telah berhasil dihapus');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  const columns = [
    { field: '_id', header: 'ID' },
    { field: 'name', header: 'Nama' },
    { field: 'price', header: 'Harga', isPrice: true },
    { field: 'category', header: 'Kategori' },
    { field: 'countInStock', header: 'Jumlah' },
    { field: 'rating', header: 'Rating' },
  ];

  const actions = [
    {
      type: 'link',
      label: 'Edit',
      href: (product) => `/admin/product/${product._id}`,
      className: 'default-button block w-full text-center',
    },
    {
      type: 'button',
      label: 'Hapus',
      onClick: deleteHandler,
      disabled: loadingDelete,
      className: 'default-button block w-full',
    },
  ];

  return (
    <Layout title="Admin Produk">
      <AdminNav>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
            <p className="text-gray-600 mt-1">Kelola semua produk toko</p>
          </div>
          <button disabled={loadingCreate} onClick={createHandler} className="primary-button mt-3 sm:mt-0">
            {loadingCreate ? 'Loading...' : 'Tambah Produk'}
          </button>
        </div>

        {loadingDelete && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
            <p>Sedang menghapus produk...</p>
          </div>
        )}

        <DataTable columns={columns} data={products} loading={loading} error={error} actions={actions} loadingMessage="Memuat daftar produk..." emptyMessage="Tidak ada produk yang ditemukan" />
      </AdminNav>
    </Layout>
  );
}

AdminProductsScreen.auth = { adminOnly: true };

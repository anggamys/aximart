import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { toast } from 'react-toastify';
import AdminNav from '../../components/AdminNav';
import DataTable from '../../components/DataTable';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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

export default function AdminOrderScreen() {
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`);
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

  const deleteHandler = async (order) => {
    if (!window.confirm('Apakah Kamu yakin ingin menghapus pesanan ini?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/orders/${order._id}/deleteOrder`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Pesanan telah dihapus');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  const columns = [
    { field: '_id', header: 'ID' },
    {
      field: 'user',
      header: 'Pengguna',
      formatter: (value) => (value ? value.name : 'Pengguna telah dihapus'),
    },
    { field: 'createdAt', header: 'Tanggal', isDate: true },
    { field: 'totalPrice', header: 'Total', isPrice: true },
    {
      field: 'isPaid',
      header: 'Pembayaran',
      formatter: (value, item) => (value ? new Date(item.paidAt).toLocaleDateString('id-ID') : 'Belum dibayar'),
    },
    {
      field: 'isDelivered',
      header: 'Pengiriman',
      formatter: (value, item) => (value ? new Date(item.deliveredAt).toLocaleDateString('id-ID') : 'Pesanan sedang dikemas'),
    },
  ];

  const actions = [
    {
      type: 'link',
      label: 'Detail',
      href: (order) => `/order/${order._id}`,
      className: 'primary-button block w-full text-center',
    },
    {
      type: 'button',
      label: loadingDelete ? 'Menghapus...' : 'Hapus Pesanan',
      onClick: deleteHandler,
      disabled: loadingDelete,
      className: 'default-button block w-full',
    },
  ];

  return (
    <Layout title="Admin Pesanan">
      <AdminNav>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Pesanan</h1>
          <p className="text-gray-600 mt-1">Kelola semua pesanan dari pelanggan</p>
        </div>

        <DataTable columns={columns} data={orders} loading={loading} error={error} actions={actions} loadingMessage="Memuat daftar pesanan..." emptyMessage="Tidak ada pesanan yang ditemukan" />
      </AdminNav>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };

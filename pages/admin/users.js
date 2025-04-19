import axios from 'axios';
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
      return { ...state, loading: false, users: action.payload, error: '' };
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

function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`);
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

  const deleteHandler = async (user) => {
    if (!window.confirm(`Apakah kamu yakin ingin menghapus pengguna "${user.name}"?`)) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${user._id}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Pengguna telah berhasil dihapus');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  const columns = [
    { field: '_id', header: 'ID' },
    { field: 'name', header: 'Nama' },
    { field: 'email', header: 'Email' },
    { field: 'isAdmin', header: 'Admin' },
  ];

  const actions = [
    /*{
      type: 'link',
      label: 'Edit',
      href: (user) => `/admin/user/${user._id}`,
      className: 'default-button block w-full text-center'
    },*/
    {
      type: 'button',
      label: loadingDelete ? 'Menghapus...' : 'Hapus',
      onClick: deleteHandler,
      disabled: loadingDelete,
      className: 'default-button block w-full',
    },
  ];

  return (
    <Layout title="Admin Pengguna">
      <AdminNav>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pengguna</h1>
          <p className="text-gray-600 mt-1">Kelola semua pengguna terdaftar</p>
        </div>

        {loadingDelete && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
            <p>Sedang menghapus pengguna...</p>
          </div>
        )}

        <DataTable columns={columns} data={users} loading={loading} error={error} actions={actions} loadingMessage="Memuat daftar pengguna..." emptyMessage="Tidak ada pengguna yang ditemukan" />
      </AdminNav>
    </Layout>
  );
}

AdminUsersScreen.auth = { adminOnly: true };
export default AdminUsersScreen;

import axios from 'axios';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import AdminNav from '../../components/AdminNav';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 14,
        },
      },
    },
    title: {
      display: true,
      text: 'Monthly Sales Data',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      bodyFont: {
        size: 14,
      },
      titleFont: {
        size: 16,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        font: {
          size: 12,
        },
        callback: function (value) {
          return 'Rp.' + value.toLocaleString();
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

// Reducer for state management
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/summary');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  // Format data for chart
  const chartData = {
    labels: summary.salesData?.map((x) => x._id) || [],
    datasets: [
      {
        label: 'Penjualan Bulanan',
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(53, 162, 235, 1)',
        data: summary.salesData?.map((x) => x.totalSales) || [],
      },
    ],
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rp.${amount?.toLocaleString('id-ID') || '0'}`;
  };

  return (
    <Layout title="Admin Dashboard">
      <AdminNav>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Memuat data dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard title="Total Penjualan" value={formatCurrency(summary.ordersPrice)} link="/admin/orders" linkText="Lihat Penjualan" bgColor="bg-blue-50" borderColor="border-blue-500" icon="💰" />
                <SummaryCard title="Jumlah Pesanan" value={summary.ordersCount || 0} link="/admin/orders" linkText="Lihat Pesanan" bgColor="bg-green-50" borderColor="border-green-500" icon="📦" />
                <SummaryCard title="Total Produk" value={summary.productsCount || 0} link="/admin/products" linkText="Lihat Produk" bgColor="bg-purple-50" borderColor="border-purple-500" icon="🏷️" />
                <SummaryCard title="Jumlah Pengguna" value={summary.usersCount || 0} link="/admin/users" linkText="Lihat Pengguna" bgColor="bg-amber-50" borderColor="border-amber-500" icon="👥" />
              </div>

              {/* Sales Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Grafik Penjualan</h2>
                <div className="h-80">
                  <Bar options={chartOptions} data={chartData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminNav>
    </Layout>
  );
}

// Summary Card Component
function SummaryCard({ title, value, link, linkText, bgColor, borderColor, icon }) {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${bgColor} border-l-4 ${borderColor}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
        <Link href={link} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
          {linkText}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;

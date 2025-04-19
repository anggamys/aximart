import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { getError } from '../../utils/error';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const { query } = useRouter();
  const router = useRouter();
  const orderId = query.id;
  const [showConfirmation, setShowConfirmation] = useState(null);

  const [{ loading, error, order, loadingPay, loadingDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);

  const { shippingAddress, paymentMethod, orderItems, itemsPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt, createdAt } = order;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const updatePayment = async () => {
    try {
      setShowConfirmation(null);
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`);
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Status pembayaran berhasil diperbarui');

      // Refresh the order data
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const updateDelivered = async () => {
    try {
      setShowConfirmation(null);
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(`/api/admin/orders/${order._id}/deliver`);
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Status pengiriman berhasil diperbarui');

      // Refresh the order data
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Detail Pesanan #${orderId}`}>
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-4">
        <ul className="flex space-x-2">
          <li>
            <Link href="/" className="hover:underline">
              Beranda
            </Link>{' '}
            /
          </li>
          <li>
            <Link href="/order-history" className="hover:underline">
              Riwayat Pesanan
            </Link>{' '}
            /
          </li>
          <li className="text-gray-500">Detail Pesanan</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Pesanan #{orderId}</h1>
        {order.createdAt && <span className="text-sm text-gray-500">Dipesan pada: {formatDate(createdAt)}</span>}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Main Content - Left Side */}
          <div className="md:col-span-8 space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Status Pesanan</h2>
              <div className="flex items-center mb-8">
                <div className={`w-1/3 relative mb-2 ${isPaid ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${isPaid ? 'bg-green-600' : 'bg-gray-200'} text-white mx-auto`}>1</div>
                  <div className="text-center mt-1 text-sm">Pembayaran</div>
                  {isPaid && <div className="text-xs text-center mt-1">{formatDate(paidAt)}</div>}
                </div>

                <div className={`w-1/3 relative mb-2 ${isPaid && !isDelivered ? 'text-blue-600' : isDelivered ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${isPaid && !isDelivered ? 'bg-blue-600' : isDelivered ? 'bg-green-600' : 'bg-gray-200'} text-white mx-auto`}>2</div>
                  <div className="text-center mt-1 text-sm">Sedang Dikemas</div>
                </div>

                <div className={`w-1/3 relative mb-2 ${isDelivered ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${isDelivered ? 'bg-green-600' : 'bg-gray-200'} text-white mx-auto`}>3</div>
                  <div className="text-center mt-1 text-sm">Diterima</div>
                  {isDelivered && <div className="text-xs text-center mt-1">{formatDate(deliveredAt)}</div>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Alamat Pengiriman</h2>
                <span className={`px-3 py-1 rounded-full text-xs ${isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{isDelivered ? 'Telah Diterima' : 'Sedang Diproses'}</span>
              </div>

              {shippingAddress && (
                <div className="border-l-4 border-gray-200 pl-4">
                  <p className="font-semibold mb-1">{shippingAddress.fullName}</p>
                  <p className="text-gray-600">{shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{shippingAddress.country}</p>
                </div>
              )}

              {isDelivered ? (
                <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-md flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Pesanan diterima pada {formatDate(deliveredAt)}
                </div>
              ) : (
                <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                  Pesanan sedang dikemas
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Metode Pembayaran</h2>
                <span className={`px-3 py-1 rounded-full text-xs ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isPaid ? 'Telah Dibayar' : 'Belum Dibayar'}</span>
              </div>

              <div className="flex items-center mb-4">
                <div className="bg-gray-100 rounded-md p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="font-medium">{paymentMethod}</span>
              </div>

              {isPaid ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Telah dibayar pada {formatDate(paidAt)}
                </div>
              ) : (
                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Belum dibayar
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Barang Pesanan</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderItems &&
                      orderItems.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <Link href={`/product/${item.slug}`}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-16 relative rounded overflow-hidden">
                                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded-md" />
                                </div>
                                <div className="ml-4 text-sm">
                                  <p className="font-medium text-gray-900 hover:text-blue-600">{item.name}</p>
                                  {item.size && <p className="text-gray-500">Size: {item.size}</p>}
                                  {item.color && <p className="text-gray-500">Color: {item.color}</p>}
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-sm text-right text-gray-600">{item.quantity}</td>
                          <td className="py-4 px-4 text-sm text-right text-gray-600">{formatCurrency(item.price)}</td>
                          <td className="py-4 px-4 text-sm text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="md:col-span-4 space-y-6">
            {/* Order Summary */}
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-3 text-sm">
                  <span className="text-gray-600">Subtotal Barang</span>
                  <span>{formatCurrency(itemsPrice)}</span>
                </div>

                <div className="flex justify-between pb-3 text-sm">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span>{formatCurrency(shippingPrice)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t-2 font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Customer Support */}
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Butuh bantuan?</h3>
                <p className="text-sm text-blue-700 mb-3">Jika ada pertanyaan atau masalah dengan pesanan Anda, hubungi customer service kami.</p>
                <a href="mailto:support@example.com" className="text-sm text-blue-800 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@example.com
                </a>
              </div>

              {/* Admin Actions */}
              {session?.user?.isAdmin && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-3">Admin Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowConfirmation('pay')}
                      disabled={isPaid || loadingPay}
                      className={`w-full py-2 px-4 rounded-md flex justify-center items-center ${isPaid ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                      {loadingPay ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : isPaid ? (
                        'Sudah Dibayar'
                      ) : (
                        'Tandai Sudah Dibayar'
                      )}
                    </button>

                    <button
                      onClick={() => setShowConfirmation('deliver')}
                      disabled={!isPaid || isDelivered || loadingDeliver}
                      className={`w-full py-2 px-4 rounded-md flex justify-center items-center ${
                        !isPaid || isDelivered ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loadingDeliver ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : isDelivered ? (
                        'Sudah Diterima'
                      ) : !isPaid ? (
                        'Tunggu Pembayaran'
                      ) : (
                        'Tandai Sudah Diterima'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <div className="mt-6">
                {session?.user?.isAdmin && (
                  <Link href="/admin/orders">
                    <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Kembali ke Daftar Pesanan
                    </button>
                  </Link>
                )}
                {!session?.user?.isAdmin && (
                  <Link href="/order-history">
                    <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Kembali ke Riwayat Pesanan
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Konfirmasi</h3>
            <p className="mb-6">{showConfirmation === 'pay' ? 'Apakah Anda yakin ingin menandai pesanan ini sebagai sudah dibayar?' : 'Apakah Anda yakin ingin menandai pesanan ini sebagai sudah diterima?'}</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowConfirmation(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Batal
              </button>
              <button
                onClick={showConfirmation === 'pay' ? updatePayment : updateDelivered}
                className={`px-4 py-2 rounded-md text-white ${showConfirmation === 'pay' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;

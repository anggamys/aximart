import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useEffect, useReducer } from 'react';
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
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, { loading: true, order: [], error: '' });

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

  const { shippingAddress, paymentMethod, orderItems, itemsPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } = order;

  const updatePayment = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`);
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Pesanan telah dibayar');
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const updateDelivered = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(`/api/admin/orders/${order._id}/deliver`);
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Pesanan telah diterima');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading..</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Alamat Pengiriman</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
              {isDelivered ? <div className="alert-success">Pesanan diteruma pada {deliveredAt}</div> : <div className="alert-error">Pesanan sedang dikemas</div>}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Metode Pembayaran</h2>
              <div>{paymentMethod}</div>
              {isPaid ? <div className="alert-success">Telah dibayar pada {paidAt}</div> : <div className="alert-error">Belum dibayar</div>}
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Barang Pesanan</h2>
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
                  {orderItems.map((item) => (
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
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">Rp.{item.price}</td>
                      <td className="p-5 text-right">Rp.{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Ringkasan Pesanan</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Barang</div>
                    <div>Rp.{itemsPrice}</div>
                  </div>
                </li>{' '}
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
              </ul>
            </div>
            {session.user.isAdmin && (
              <div className="card p-5">
                <h2 className="text-lg mb-2">Status</h2>
                <ul>
                  <li className="mb-2 flex justify-center">
                    <button onClick={updatePayment} className="bg-green-600 rounded-md p-2 w-full text-white">
                      Sudah di bayar
                    </button>
                  </li>
                  <li className="mb-2 flex justify-center">
                    <button onClick={updateDelivered} className="bg-blue-700 rounded-md p-2 w-full text-white">
                      Pesanan sudah diterima
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;

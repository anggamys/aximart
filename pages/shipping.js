import { useContext, useEffect } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function ShippingScreeen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push('/payment');
  };

  return (
    <Layout title="Alamat Pengiriman">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl">Alamat Pengiriman</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Nama Lengkap</label>
          <input className="w-full" id="fullName" autoFocus {...register('fullName', { required: 'Masukkan nama lengkap' })} />
          {errors.fullName && <div className="text-red-500">{errors.fullName.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Alamat</label>
          <input className="w-full" id="address" {...register('address', { required: 'Masukkan alamat', minLength: { value: 3, message: 'Alamat harus lebih dari 2 karakter' } })} />
          {errors.address && <div className="text-red-500">{errors.address.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="city">Kota</label>
          <input className="w-full" id="city" {...register('city', { required: 'Masukkan kota' })} />
          {errors.city && <div className="text-red-500">{errors.city.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Kode Pos</label>
          <input className="w-full" id="postalCode" {...register('postalCode', { required: 'Masukkan kode pos' })} />
          {errors.postalCode && <div className="text-red-500">{errors.postalCode.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Negara</label>
          <input className="w-full" id="country" {...register('country', { required: 'Masukkan negara' })} />
          {errors.country && <div className="text-red-500">{errors.country.message}</div>}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Selanjutnya</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreeen.auth = true;

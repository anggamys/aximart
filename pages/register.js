import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Buat Akun">
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl">Buat Akun Baru</h1>
        <div className="mb-4">
          <label htmlFor="name">Nama</label>
          <input type="text" className="w-full" id="name" autoFocus {...register('name', { required: 'Masukkan namamu' })} />
          {errors.name && <div className="text-red-500">{errors.name.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Masukkan email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Masukkan email yang valid',
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {errors.email && <div className="text-red-500">{errors.email.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Masukkan password',
              minLength: { value: 6, message: 'Masukkan password lebih dari 5 karakter' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && <div className="text-red-500 ">{errors.password.message}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Masukkan konfirmasi password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'Masukkan konfirmasi password lebih dari 5 karakter',
              },
            })}
          />
          {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword.message}</div>}
          {errors.confirmPassword && errors.confirmPassword.type === 'validate' && <div className="text-red-500">Password tidak sama</div>}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Buat Akun</button>
        </div>
        <div className="mb-4 ">
          Sudah punya akun? &nbsp;
          <Link href="/login" className="primary-button">
            Masuk Sekarang
          </Link>
        </div>
      </form>
    </Layout>
  );
}

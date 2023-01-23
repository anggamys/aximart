import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import Layout from '../components/Layout';

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      toast.success('Profile update successfully');
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Akun Saya">
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl">Perbarui akun</h1>
        <div className="mb-4">
          <label htmlFor="name">Nama</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Masukkan nama',
            })}
          />
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
        <div className="mb-4">
          <button className="primary-button">Perbarui akun</button>
        </div>
      </form>
    </Layout>
  );
}

ProfileScreen.auth = true;

import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import AdminNav from '../../../components/AdminNav';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty: formIsDirty },
    setValue,
    watch,
  } = useForm();

  const watchImage = watch('image');

  useEffect(() => {
    setImagePreview(watchImage);
  }, [watchImage]);

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formIsDirty]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setImagePreview(data.image);
        setValue('category', data.category);
        setValue('brand', data.brand);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  // Handle navigation with unsaved changes
  const handleNavigation = (path) => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    // Quick local preview before upload
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url, { shouldDirty: true });
      toast.success('File telah berhasil diupload');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({ name, slug, price, category, image, brand, countInStock, description }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Produk telah berhasil diperbarui');
      setIsDirty(false);
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug, { shouldDirty: true });
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <AdminNav>
        <div className="md:col-span-3 px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Edit Product: {productId}</h1>

              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>

                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama barang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.name ? 'border-red-500' : ''}`}
                        id="name"
                        autoFocus
                        {...register('name', {
                          required: 'Nama barang tidak boleh kosong',
                        })}
                        onChange={(e) => {
                          setValue('name', e.target.value, { shouldDirty: true });
                          // Auto-generate slug option
                          if (e.target.value) {
                            generateSlug(e.target.value);
                          }
                        }}
                      />
                      {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <div className="flex mt-1">
                        <input
                          type="text"
                          className={`block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.slug ? 'border-red-500' : ''}`}
                          id="slug"
                          {...register('slug', {
                            required: 'Slug tidak boleh kosong',
                            pattern: {
                              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                              message: 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung',
                            },
                          })}
                        />
                      </div>
                      {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug.message}</div>}
                      <p className="text-xs text-gray-500 mt-1">URL friendly name (example: premium-t-shirt)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Harga <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.price ? 'border-red-500' : ''}`}
                          id="price"
                          min="0"
                          step="0.01"
                          {...register('price', {
                            required: 'Harga tidak boleh kosong',
                            min: {
                              value: 0,
                              message: 'Harga tidak boleh negatif',
                            },
                          })}
                        />
                        {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price.message}</div>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">
                          Jumlah stok <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.countInStock ? 'border-red-500' : ''}`}
                          id="countInStock"
                          min="0"
                          step="1"
                          {...register('countInStock', {
                            required: 'Jumlah stok tidak boleh kosong',
                            min: {
                              value: 0,
                              message: 'Jumlah stok tidak boleh negatif',
                            },
                          })}
                        />
                        {errors.countInStock && <div className="text-red-500 text-sm mt-1">{errors.countInStock.message}</div>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.category ? 'border-red-500' : ''}`}
                          id="category"
                          {...register('category', {
                            required: 'Kategori tidak boleh kosong',
                          })}
                        />
                        {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category.message}</div>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                          Merek <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.brand ? 'border-red-500' : ''}`}
                          id="brand"
                          {...register('brand', {
                            required: 'Merek tidak boleh kosong',
                          })}
                        />
                        {errors.brand && <div className="text-red-500 text-sm mt-1">{errors.brand.message}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image and Description */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Media & Description</h2>

                    <div className="mb-4">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        URL Gambar <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.image ? 'border-red-500' : ''}`}
                        id="image"
                        {...register('image', {
                          required: 'URL gambar tidak boleh kosong',
                        })}
                      />
                      {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image.message}</div>}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                        Upload gambar baru
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        id="imageFile"
                        onChange={uploadHandler}
                      />
                      {loadingUpload && (
                        <div className="mt-2 flex items-center">
                          <div className="loader mr-2 rounded-full border-2 border-t-2 border-gray-200 h-4 w-4 animate-spin"></div>
                          <span className="text-sm text-gray-600">Mengupload...</span>
                        </div>
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Preview</label>
                      <div className="mt-1 border rounded-md p-2 flex justify-center bg-gray-50">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Product preview" className="max-h-40 object-contain" />
                        ) : (
                          <div className="h-40 w-full flex items-center justify-center text-gray-400">No image available</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${errors.description ? 'border-red-500' : ''}`}
                        id="description"
                        rows="4"
                        {...register('description', {
                          required: 'Deskripsi tidak boleh kosong',
                        })}
                      ></textarea>
                      {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description.message}</div>}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 border-t pt-4 flex flex-wrap gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => handleNavigation('/admin/products')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {loadingUpdate ? (
                      <span className="flex items-center">
                        <div className="loader mr-2 rounded-full border-2 border-t-2 border-white h-4 w-4 animate-spin"></div>
                        Menyimpan...
                      </span>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </AdminNav>

      {/* Main Content */}
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };

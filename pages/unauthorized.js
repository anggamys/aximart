import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Unautorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unautorized Page">
      <h1 className="text-xl">Aksess Ditolak</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}

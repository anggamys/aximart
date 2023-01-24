import User from '../../../../models/User';
import db from '../../../../utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('Masuk ke akun admin');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Akses dilarang' });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    if (user.email === 'jstcode.hub@gmail.com') {
      return res.status(400).send({ message: 'Tidak bisa menghapus admin' });
    }
    await user.remove();
    await db.disconnect();
    res.send({ message: 'Pengguna telah berhasil dihapus' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Pengguna tidak ditemukan' });
  }
};

export default handler;

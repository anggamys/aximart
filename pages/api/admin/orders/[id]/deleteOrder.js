import { getSession } from 'next-auth/react';
import Order from '../../../../../models/Order';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('Error: Masuk ke akun');
  }
  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Akses dilarang' });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    await order.remove();
    await db.disconnect();
    res.send({ message: 'Pesanan telah berhasil dihapus' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Pesanan tidak ditemukan' });
  }
};

export default handler;

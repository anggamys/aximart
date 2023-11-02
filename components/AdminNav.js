import Link from 'next/link';
import React from 'react';

export default function AdminNav({ children }) {
  return (
    <>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard </Link>
            </li>
            <li>
              <Link href="/admin/orders">Pesanan</Link>
            </li>
            <li>
              <Link href="/admin/products">Produk</Link>
            </li>
            <li>
              <Link href="/admin/users">Pengguna</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3 overflow-x-auto">{children}</div>
      </div>
    </>
  );
}

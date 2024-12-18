"use client";
import Link from "next/link";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { usePathname } from "next/navigation"; // Import hook usePathname

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Mendapatkan path saat ini

  // Cek apakah path saat ini adalah salah satu halaman yang diinginkan
  const shouldShowSidebar =
    pathname === "/Dashboard" ||
    pathname === "/Data-Penduduk" ||
    pathname === "/Tambah-Data-Penduduk";

  // Jika sidebar tidak perlu ditampilkan, return null
  if (!shouldShowSidebar) return null;

  return (
    <>
      {/* Tombol untuk membuka sidebar di layar kecil */}
      <button
        className="md:hidden p-4 text-white font-bold bg-[#8b2f31] fixed top-0 left-0 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-[#8b2f31] text-white h-screen fixed top-0 left-0 pt-5 transition-transform duration-300 z-40`}
      >
        {/* Logo dan Teks */}
        <div className="flex pt-12 items-center font-bold gap-2 px-6 mb-5">
          <Link href="/">
            <img
              src="/assets/images/Logo.png"
              alt="Logo"
              className="w-20 h-10"
            />
          </Link>
        </div>

        {/* Daftar menu sidebar */}
        <ul className="list-none p-0">
          <li className="flex py-4 px-6 hover:bg-[#f9d747] hover:text-[#8b2f31]">
            <MdDashboard className="text-3xl pr-2" />
            <Link href="/Dashboard" className="block font-bold">
              Dashboard
            </Link>
          </li>
          <li className="py-4 flex px-6 hover:bg-[#f9d747] hover:text-[#8b2f31]">
            <FaUserPlus className="text-3xl pr-2" />
            <Link href="/Tambah-Data-Penduduk" className="block font-bold">
              Tambah Data Penduduk
            </Link>
          </li>
          <li className="py-4 flex px-6 hover:bg-[#f9d747] hover:text-[#8b2f31]">
            <FaDatabase className="text-2xl pr-2" />
            <Link href="/Data-Penduduk" className="block font-bold">
              Data Penduduk
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay ketika sidebar terbuka di layar kecil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

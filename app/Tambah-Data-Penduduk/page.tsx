"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Interface untuk Penduduk
interface Penduduk {
  nama: string;
  "jenis-kelamin": string;
  kategori: string;
  keterangan: string;
  "tanggal-lahir": string;
  umur: string;
  tanggal: Timestamp;
  "tanggal-update": Timestamp;
}

// Fungsi untuk menghitung umur berdasarkan tanggal lahir
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Jika ulang tahun belum terjadi di tahun ini, kurangi umur
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const TambahDataPenduduk = () => {
  // State untuk menyimpan input form
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Laki-laki");
  const [kategori, setKategori] = useState("Penduduk Masuk");
  const [keterangan, setKeterangan] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // untuk status login
  const router = useRouter();

  // Mengecek status autentikasi pengguna
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/Login-Admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hitung umur berdasarkan tanggal lahir
    const umur = calculateAge(tanggalLahir);

    const newPenduduk: Penduduk = {
      nama,
      "jenis-kelamin": jenisKelamin,
      kategori,
      keterangan,
      "tanggal-lahir": tanggalLahir,
      umur: umur.toString(),
      tanggal: Timestamp.now(),
      "tanggal-update": Timestamp.now(),
    };

    try {
      // Tambahkan data baru ke Firestore
      await addDoc(collection(db, "penduduk"), newPenduduk);
      alert("Data berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Terjadi kesalahan saat menambahkan data.");
    }

    // Reset form
    setNama("");
    setJenisKelamin("Laki-laki");
    setKategori("Penduduk Masuk");
    setKeterangan("");
    setTanggalLahir("");
  };

  return (
    <div className="w-full px-4 md:pl-[300px] h-screen md:h-auto py-10 bg-white shadow-lg rounded-lg  ">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Form Data Penduduk
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Input Nama */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nama:</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Pilihan Jenis Kelamin */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Jenis Kelamin:</label>
          <select
            value={jenisKelamin}
            onChange={(e) => setJenisKelamin(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Pilihan Kategori */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Kategori:</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Penduduk Masuk">Penduduk Masuk</option>
            <option value="Penduduk Keluar">Penduduk Keluar</option>
            <option value="Mati">Mati</option>
            <option value="Lahir">Lahir</option>
          </select>
        </div>

        {/* Input Keterangan */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Keterangan:</label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Input Tanggal Lahir */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tanggal Lahir:</label>
          <input
            type="date"
            value={tanggalLahir}
            onChange={(e) => setTanggalLahir(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all duration-300"
        >
          Tambah Data
        </button>
      </form>
    </div>
  );
};

export default TambahDataPenduduk;

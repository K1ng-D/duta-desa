"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

interface Penduduk {
  id: string; // Tambahkan properti id
  nama: string;
  "jenis-kelamin": string;
  kategori: string;
  keterangan: string;
  "tanggal-lahir": string;
  tanggal: { seconds: number; nanoseconds: number };
  "tanggal-update": { seconds: number; nanoseconds: number };
}

const DataPenduduk = () => {
  const [penduduk, setPenduduk] = useState<Penduduk[]>([]);
  const [filteredPenduduk, setFilteredPenduduk] = useState<Penduduk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editedPenduduk, setEditedPenduduk] = useState<Penduduk | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // untuk status login
  const router = useRouter();

  const itemsPerPage = 10;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "penduduk"));
        const data: Penduduk[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id, // Simpan id dokumen
              ...doc.data(),
            } as Penduduk)
        );
        const sortedData = data.sort(
          (a, b) =>
            (b["tanggal-update"]?.seconds ?? 0) -
            (a["tanggal-update"]?.seconds ?? 0)
        );

        setPenduduk(sortedData);
        setFilteredPenduduk(sortedData);
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredPenduduk(penduduk);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filteredData = penduduk.filter((item) =>
        item.nama.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredPenduduk(filteredData);
    }
  };

  const handleEditClick = (item: Penduduk) => {
    setEditedPenduduk(item);
  };

  const handleSave = async () => {
    if (editedPenduduk) {
      try {
        const pendudukDoc = doc(db, "penduduk", editedPenduduk.id);
        await updateDoc(pendudukDoc, {
          kategori: editedPenduduk.kategori,
          keterangan: editedPenduduk.keterangan,
          "tanggal-lahir": editedPenduduk["tanggal-lahir"],
          "tanggal-update": new Date(), // Update tanggal-update
        });
        alert("Data berhasil diperbarui!");

        // Refresh data setelah update
        const updatedPenduduk = penduduk.map((p) =>
          p.id === editedPenduduk.id ? editedPenduduk : p
        );
        setPenduduk(updatedPenduduk);
        setFilteredPenduduk(updatedPenduduk);
        setEditedPenduduk(null);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editedPenduduk) {
      setEditedPenduduk({
        ...editedPenduduk,
        [e.target.name]: e.target.value,
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPenduduk.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container md:pl-[270px] mx-auto px-4 py-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Data Penduduk
      </h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
          placeholder="Cari nama penduduk..."
        />
      </div>

      {editedPenduduk && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Edit Data Penduduk</h2>
          <select
            name="kategori"
            value={editedPenduduk.kategori}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded mb-2 w-full"
          >
            <option value="Penduduk Masuk">Penduduk Masuk</option>
            <option value="Penduduk Keluar">Penduduk Keluar</option>
            <option value="Lahir">Lahir</option>
            <option value="Mati">Mati</option>
          </select>
          <input
            type="text"
            name="keterangan"
            value={editedPenduduk.keterangan}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded mb-2 w-full"
            placeholder="Keterangan"
          />
          <input
            type="date"
            name="tanggal-lahir"
            value={editedPenduduk["tanggal-lahir"]}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded mb-2 w-full"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Simpan
          </button>
          <button
            onClick={() => setEditedPenduduk(null)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Kategori</th>
              <th className="py-2 px-4 border">Keterangan</th>
              <th className="py-2 px-4 border">Tanggal Lahir</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.nama}</td>
                <td className="py-2 px-4 border">{item.kategori}</td>
                <td className="py-2 px-4 border">{item.keterangan}</td>
                <td className="py-2 px-4 border">{item["tanggal-lahir"]}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPenduduk;

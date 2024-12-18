"use client";
import { JSX, useEffect, useState } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import {
  FaUsers,
  FaMale,
  FaFemale,
  FaBaby,
  FaDoorOpen,
  FaDoorClosed,
  FaSkull,
} from "react-icons/fa";

// Interface untuk Penduduk
interface Penduduk {
  nama: string;
  "jenis-kelamin": string;
  kategori: string;
  keterangan: string;
  "tanggal-lahir": string;
  tanggal: { seconds: number; nanoseconds: number };
}

const Dashboard = () => {
  const [penduduk, setPenduduk] = useState<Penduduk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "penduduk"));
        const data: Penduduk[] = querySnapshot.docs.map(
          (doc) => doc.data() as Penduduk
        );
        setPenduduk(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPenduduk = penduduk.filter(
    (item) => item.kategori !== "Mati" && item.kategori !== "Penduduk Keluar"
  ).length;

  const calculateAge = (tanggalLahir: string) => {
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const countByAgeGroup = (min: number, max: number | null) => {
    return penduduk.filter((item) => {
      const umur = calculateAge(item["tanggal-lahir"]);
      if (max === null) {
        return umur >= min;
      }
      return umur >= min && umur <= max;
    }).length;
  };

  const countByGender = (gender: string) => {
    return penduduk.filter((item) => item["jenis-kelamin"] === gender).length;
  };

  const countByCategory = (category: string) => {
    return penduduk.filter((item) => item.kategori === category).length;
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="w-full md:pl-[300px] pt-20 md:pt-24 px-4 py-10 bg-white shadow-lg rounded-lg md:px-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-700">
        Dashboard Statistik Penduduk Desa Cungkup
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <Card
          title="Total Penduduk"
          value={totalPenduduk}
          icon={<FaUsers size={28} />}
          bgColor="bg-blue-100"
        />
        <Card
          title="Umur di bawah 12 tahun"
          value={countByAgeGroup(0, 11)}
          icon={<FaBaby size={28} />}
          bgColor="bg-green-100"
        />
        <Card
          title="Umur 13 - 17 tahun"
          value={countByAgeGroup(13, 17)}
          icon={<FaBaby size={28} />}
          bgColor="bg-yellow-100"
        />
        <Card
          title="Umur 18 - 25 tahun"
          value={countByAgeGroup(18, 25)}
          icon={<FaBaby size={28} />}
          bgColor="bg-orange-100"
        />
        <Card
          title="Umur 26 - 35 tahun"
          value={countByAgeGroup(26, 35)}
          icon={<FaBaby size={28} />}
          bgColor="bg-red-100"
        />
        <Card
          title="Umur 36 - 45 tahun"
          value={countByAgeGroup(36, 45)}
          icon={<FaBaby size={28} />}
          bgColor="bg-pink-100"
        />
        <Card
          title="Umur 46 tahun ke atas"
          value={countByAgeGroup(46, null)}
          icon={<FaBaby size={28} />}
          bgColor="bg-purple-100"
        />
        <Card
          title="Jumlah Laki-laki"
          value={countByGender("Laki-laki")}
          icon={<FaMale size={28} />}
          bgColor="bg-blue-200"
        />
        <Card
          title="Jumlah Perempuan"
          value={countByGender("Perempuan")}
          icon={<FaFemale size={28} />}
          bgColor="bg-pink-200"
        />
        <Card
          title="Penduduk Masuk"
          value={countByCategory("Penduduk Masuk")}
          icon={<FaDoorOpen size={28} />}
          bgColor="bg-teal-100"
        />
        <Card
          title="Penduduk Keluar"
          value={countByCategory("Penduduk Keluar")}
          icon={<FaDoorClosed size={28} />}
          bgColor="bg-gray-400"
        />
        <Card
          title="Jumlah Lahir"
          value={countByCategory("Lahir")}
          icon={<FaBaby size={28} />}
          bgColor="bg-yellow-200"
        />
        <Card
          title="Penduduk Mati"
          value={countByCategory("Mati")}
          icon={<FaSkull size={28} />}
          bgColor="bg-gray-300"
        />
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  bgColor: string;
}

const Card = ({ title, value, icon, bgColor }: CardProps) => {
  return (
    <div
      className={`${bgColor} p-4 rounded-lg shadow-md flex items-center space-x-4`}
    >
      <div className="text-blue-500">{icon}</div>
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          {title}
        </h2>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;

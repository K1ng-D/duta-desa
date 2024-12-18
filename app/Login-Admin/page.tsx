"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Cek apakah email adalah email admin
      if (user.email === "admindutadesa123@gmail.com") {
        router.push("/Dashboard"); // Arahkan ke halaman admin jika email cocok
      } else {
        // Logout jika bukan email admin
        alert("Akses ditolak: Anda bukan admin");
        await auth.signOut();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Login admin gagal: " + error.message);
      } else {
        alert("Login admin gagal: Terjadi error yang tidak diketahui");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-bglogin bg-cover bg-center">
      <div className="h-full w-full py-[125px] px-8 flex md:items-end items-center justify-center bg-black/80">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#8b2f31]">
            Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black p-3 border border-[#8b2f31] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b2f31]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black p-3 border border-[#8b2f31] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b2f31]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8b2f31] text-white hover:text-black py-3 rounded-md font-semibold hover:bg-[#f9d747] transition duration-300"
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

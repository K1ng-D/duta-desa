import Link from "next/link";
import React from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

export default function HomeView() {
  return (
    <div className="w-full h-screen bg-dutadesa bg-cover bg-center">
      <div className="h-full w-full py-24 px-6 flex items-center md:items-end justify-center bg-black/80">
        <div className="w-full max-w-3xl flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">
              MEWUJUDKAN <span className="text-[#f9d747]">DESA CERDAS</span>{" "}
              DENGAN <span className="text-[#f9d747]">DATA YANG TEPAT!</span>
            </p>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-slate-100 text-base md:text-lg">
              Kami percaya bahwa setiap data membawa dampak besar
            </p>
            <p className="text-slate-100 text-base md:text-lg">
              Dimulai dari catatan kecil, untuk kemajuan desa yang lebih besar.
            </p>
            <p className="text-slate-100 text-base md:text-lg">
              Kami hadir untuk membantu mewujudkan desa yang lebih baik dan
              inklusif.
            </p>
            <p className="text-slate-100 text-base md:text-lg">
              Dengan data yang akurat, bersama kita bisa berinovasi dan
              berkembang.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Link
              href="https://suara-desa-pilangrejo.vercel.app/"
              className="flex items-center gap-2 text-[#8b2f31] bg-[#f9d747] px-6 py-3 rounded-lg font-bold text-sm md:text-base transition duration-300 ease-in-out hover:bg-white"
            >
              BUAT KRITIK & SARAN
              <IoArrowDownCircleOutline size={24} className="text-[#8b2f31]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

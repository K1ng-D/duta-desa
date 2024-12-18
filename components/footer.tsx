export default function Footer() {
  return (
    <footer className="bg-[#8b2f31] text-white pt-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Desa Pilangrejo Address */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-[#f9d747]">
            Desa Pilangrejo
          </h3>
          <p className="text-sm">
            Kecamatan Juwangi, Kabupaten Boyolali, Jawa Tengah
          </p>
        </div>

        {/* Kontak Information */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[#f9d747]">Kontak</h4>
          <p className="text-sm">
            Phone:{" "}
            <a href="tel:+6288221394411" className="hover:underline">
              0882 2139 4411
            </a>
          </p>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:loketonline.desapilangrejo7@gmail.com"
              className="hover:underline"
            >
              loketonline.desapilangrejo7@gmail.com
            </a>
          </p>
          <p className="text-sm">
            Address: Jl. Juwangi - Guwo Km. 1 Ds. Pilangrejo Kec. Juwangi Kab.
            Boyolali 57391
          </p>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-sm text-center font-bold mt-6 py-2 text-[#8b2f31] bg-[#f9d747] w-full">
        <p>
          &copy; {new Date().getFullYear()} Desa Pilangrejo. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

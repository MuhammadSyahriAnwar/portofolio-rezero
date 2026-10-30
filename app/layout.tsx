import type { Metadata } from "next";
import Script from "next/script";
/* Font di-host sendiri lewat paket npm (tidak mengunduh dari Google saat dev maupun build) */
import "@fontsource-variable/cinzel/wght.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";

const title = "Muhammad Syahri Anwar — Full Stack & Microservices Developer";
const description =
  "Portofolio Muhammad Syahri Anwar: Full Stack & Microservices Developer dengan pengalaman Laravel, Next.js, Docker, dan sistem informasi terintegrasi.";

export const metadata: Metadata = {
  // TODO: ganti dengan alamat situs kamu setelah deploy ke Vercel
  metadataBase: new URL("https://GANTI-DENGAN-DOMAIN-KAMU.vercel.app"),
  title,
  description,
  // Gambar pratinjau link: taruh file 1200x630 bernama app/opengraph-image.jpg, otomatis terpasang.
  openGraph: { title, description, type: "website", locale: "id_ID" },
  twitter: { card: "summary_large_image", title, description },
};

/* Statistik pengunjung (Umami). Aktif hanya jika NEXT_PUBLIC_UMAMI_ID diisi
   di .env.local (lokal) dan di Environment Variables Vercel (online). */
const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        {umamiId && (
          <Script
            data-website-id={umamiId}
            defer
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

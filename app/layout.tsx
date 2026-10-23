import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cinzel",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

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
    <html lang="id" className={`${cinzel.variable} ${poppins.variable}`}>
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

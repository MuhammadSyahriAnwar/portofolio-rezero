/* ============================================================
   DATA KONTEN PORTOFOLIO
   Ubah teks di file ini saja. Tidak perlu menyentuh kode tampilan.
   ============================================================ */

export const CONTACT = {
  email: "ahmad89.aa70@gmail.com",
  phoneLink: "+6281903551836", // format untuk link tel: (tanpa spasi/strip)
  phoneText: "+62 819-0355-1836", // format yang tampil di layar
  linkedinUrl:
    "https://www.linkedin.com/search/results/people/?keywords=Muhammad%20Syahri%20Anwar", // TODO: ganti dengan URL profil LinkedIn kamu
  githubUrl: "https://github.com/MuhammadSyahriAnwar", // TODO: ganti "username" dengan username GitHub kamu
  githubLabel: "github.com/MuhammadSyahriAnwar", // teks yang tampil di kartu kontak
};

export const navItems = ["Home", "About", "Experience", "Projects", "Certifications", "Skills", "Contact"];

/* ---------- Tipe data ---------- */

export type Experience = {
  period: string;
  role: string;
  org: string;
  description: string;
  tags: string[];
  /** Nama folder foto di public/images/experience/<photoFolder>/ */
  photoFolder?: string;
};

export type ProjectData = {
  number: string;
  title: string;
  type: string;
  description: string;
  stack: string[];
  className: string;
  /** Nama folder foto di public/images/projects/<photoFolder>/ */
  photoFolder?: string;
  /** Kalau proyek tidak punya foto, tampilkan tombol untuk membuka sertifikat ini (id dari daftar sertifikat) */
  certificateId?: string;
  certificateButton?: string;
};

export type CertificationData = {
  /** Nama folder di public/certificates/<id>/ */
  id: string;
  title: string;
  issuer: string;
  year?: string;
  /** Nama dokumen kalau nama filenya tidak mengandung kata "pelatihan" atau "kompetensi" */
  defaultLabel: string;
};

/** Satu file hasil pembacaan folder (diisi otomatis oleh app/page.tsx) */
export type MediaFile = { src: string; name: string };

export type PortfolioMedia = {
  /** Alamat foto profil (otomatis dari folder public/images/profile/), atau null jika belum ada */
  profilePhoto: string | null;
  experiencePhotos: Record<string, MediaFile[]>;
  projectPhotos: Record<string, MediaFile[]>;
  certificateFiles: Record<string, MediaFile[]>;
};

/* ---------- Pengalaman (terbaru di atas) ---------- */

export const experiences: Experience[] = [
  {
    period: "Sep 2026 – Sekarang",
    role: "Tenaga Teknis Survei & Pemetaan",
    org: "ATR/BPN Kabupaten Tabalong",
    description:
      "Mendukung program strategis nasional Pendaftaran Tanah Sistematis Lengkap (PTSL) melalui pengolahan dan validasi data spasial serta geodatabase pertanahan, digitalisasi bidang tanah, dan pemeriksaan topologi dengan sistem internal KKP dan perangkat lunak GIS. Berkolaborasi dengan tim survei lapangan untuk menjaga akurasi data tekstual dan spasial.",
    tags: ["PTSL", "GIS", "Geodatabase", "Data Spasial"],
    photoFolder: "atr-bpn-tabalong",
  },
  {
    period: "Mei 2026 – Jul 2026",
    role: "Lead Full Stack Developer — Sistem Informasi Museum Wasaka & Virtual Tour 360°",
    org: "Museum Wasaka · Politeknik Negeri Banjarmasin",
    description:
      "Membangun sistem web museum dengan Laravel, MySQL, dan RESTful API, dilengkapi tur virtual 360° interaktif berbasis Marzipano serta Text-to-Speech (TTS).",
    tags: ["Laravel", "MySQL", "Marzipano", "TTS"],
    photoFolder: "museum-wasaka",
  },
  {
    period: "Agu 2025 – Nov 2025",
    role: "Staf Magang Bidang TIK",
    org: "Polda Kalimantan Selatan",
    description:
      "Menjalankan operasional dan pemeliharaan infrastruktur TI, sistem komunikasi internal, serta integrasi jaringan. Lulus dengan predikat “Sangat Baik”.",
    tags: ["Infrastruktur TI", "Jaringan", "Komunikasi Internal"],
    photoFolder: "polda-kalsel",
  },
  {
    period: "Apr 2025 – Jul 2025",
    role: "Project Manager — Problem Based Learning (PBL)",
    org: "Politeknik Negeri Banjarmasin",
    description:
      "Memimpin dan mengoordinasikan alur kerja tim yang mengintegrasikan Administrasi Basis Data, Pemrograman Web, dan Pemrograman Mobile.",
    tags: ["Leadership", "Database", "Web", "Mobile"],
    photoFolder: "pbl",
  },
];

/* ---------- Proyek ---------- */

export const projects: ProjectData[] = [
  {
    number: "01",
    title: "Sistem Informasi Museum Wasaka & Virtual Tour",
    type: "Web System · 360° Virtual Tour",
    description:
      "Sistem informasi museum dengan tur virtual 360° interaktif dan narasi Text-to-Speech agar koleksi dapat dijelajahi dari mana saja.",
    stack: ["Laravel", "MySQL", "RESTful API", "Marzipano 360°", "TTS"],
    className: "project-visual archive",
    photoFolder: "museum-wasaka",
  },
  {
    number: "02",
    title: "Poliban PBL Integrated Systems",
    type: "Microservices Architecture",
    description:
      "Sistem terintegrasi proyek PBL Poliban dengan arsitektur microservices yang menyatukan basis data, web, dan mobile dalam satu ekosistem.",
    stack: ["Microservices", "Docker", "Laravel", "RESTful API"],
    className: "project-visual spirit",
    photoFolder: "poliban-pbl",
    certificateId: "pbl",
    certificateButton: "Lihat sertifikat PBL",
  },
];

/* ---------- Sertifikat (urutan tampil = urutan di sini) ---------- */

export const certifications: CertificationData[] = [
  {
    id: "network-admin",
    title: "Junior Network Administrator",
    issuer: "LSP Teknologi Digital / BNSP",
    year: "2024",
    defaultLabel: "Sertifikat Kompetensi",
  },
  {
    id: "vsga-web-developer",
    title: "Junior Web Developer — Vocational School Graduate Academy (VSGA)",
    issuer: "BPSDMP Kominfo / Digital Talent Scholarship",
    year: "2024",
    defaultLabel: "Sertifikat Pelatihan",
  },
  {
    id: "magang-tik",
    title: "Praktik Kerja Lapangan / Magang — Bidang TIK",
    issuer: "Polda Kalimantan Selatan",
    year: "2025",
    defaultLabel: "Sertifikat Magang",
  },
  {
    id: "fullstack-microservices",
    title: "Junior Fullstack Microservices Developer with Laravel & Docker",
    issuer: "ArutalaLab",
    defaultLabel: "Sertifikat Pelatihan",
  },
  {
    id: "pbl",
    title: "Project Manager — Problem Based Learning (PBL)",
    issuer: "Politeknik Negeri Banjarmasin",
    year: "2025",
    defaultLabel: "Sertifikat PBL",
  },
  {
    id: "ujikom-programmer",
    title: "Ujikom LSP Programmer",
    issuer: "LSP Politeknik Negeri Banjarmasin / BNSP",
    year: "2026",
    defaultLabel: "Sertifikat Kompetensi",
  },
];

/* ---------- Skill ---------- */

export const hardSkills = [
  "Web & Microservices Development",
  "Laravel",
  "Next.js",
  "Tailwind CSS",
  "RESTful API",
  "MySQL",
  "Database Administration & Eloquent ORM",
  "Docker",
  "Network Engineering",
];

export const softSkills = [
  "Leadership & Project Management",
  "Problem Solving",
  "Teamwork",
  "Technical Communication",
  "Quick Learner",
];

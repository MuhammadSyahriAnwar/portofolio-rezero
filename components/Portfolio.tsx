"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Lightbox, { type Photo } from "./Lightbox";
import {
  CONTACT,
  certifications,
  experiences,
  hardSkills,
  navItems,
  projects,
  softSkills,
  type CertificationData,
  type MediaFile,
  type PortfolioMedia,
} from "./portfolio-data";

/* Musik latar: file ada di public/audio/rezero.mp3 */
const BGM_SRC = "/audio/rezero.mp3";
const BGM_VOLUME = 0.4; // 0 sampai 1 (diabaikan di iPhone/iOS)

type IconName =
  | "arrow"
  | "code"
  | "database"
  | "github"
  | "globe"
  | "image"
  | "instagram"
  | "layers"
  | "linkedin"
  | "mail"
  | "music"
  | "pause"
  | "sparkle";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    code: <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    github: <path d="M15 22v-4c.1-1-.4-2-1-2.5 3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 5 5 5 0 0 0 19.1 1S18 1 15 2.5a13.4 13.4 0 0 0-6 0C6 1 4.9 1 4.9 1A5 5 0 0 0 4.7 5a5.5 5.5 0 0 0-1.5 3.8c0 5.4 3.5 6.6 6.8 7-.6.5-1.1 1.4-1 2.5V22" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    image: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m21 16-5-5-9 8" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2" /><path d="M2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    sparkle: <><path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  );
}

/* ---------- Pengolah nama file menjadi foto & dokumen sertifikat ---------- */

/** "2-tur-virtual-360.jpg" -> "Tur virtual 360". Nama berupa angka saja -> memakai teks cadangan. */
function captionFromFile(name: string, fallback: string) {
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : fallback;
}

function buildProjectPhotos(title: string, files: MediaFile[], fallback = "Dokumentasi proyek"): Photo[] {
  return files.map((file) => {
    const caption = captionFromFile(file.name, fallback);
    return { src: file.src, alt: `${title}: ${caption}`, caption };
  });
}

type CertDoc = Photo & { label: string };

const KIND_ORDER = { pelatihan: 0, kompetensi: 1, lainnya: 2 } as const;

/** Nama file yang mengandung "pelatihan" atau "kompetensi" otomatis diberi label yang sesuai. */
function documentKind(name: string): keyof typeof KIND_ORDER {
  const lower = name.toLowerCase();
  if (lower.includes("pelatihan")) return "pelatihan";
  if (lower.includes("kompetensi") || lower.includes("ujikom")) return "kompetensi";
  return "lainnya";
}

function buildCertificateDocs(cert: CertificationData, files: MediaFile[]): CertDoc[] {
  return files
    .map((file) => {
      const kind = documentKind(file.name);
      const label =
        kind === "pelatihan" ? "Sertifikat Pelatihan" : kind === "kompetensi" ? "Sertifikat Kompetensi" : cert.defaultLabel;
      return { kind, label, src: file.src };
    })
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    .map(({ label, src }) => ({
      src,
      label,
      alt: `${label} ${cert.title}`,
      caption: `${label} · ${cert.issuer}`,
    }));
}

const shortLabel = (label: string) => label.replace(/^Sertifikat\s+/i, "");

type Viewer = { title: string; images: Photo[]; start: number } | null;

export default function Portfolio({ media }: { media: PortfolioMedia }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewer, setViewer] = useState<Viewer>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const openViewer = (title: string, images: Photo[], start = 0) => setViewer({ title, images, start });
  const closeViewer = useCallback(() => setViewer(null), []);

  const certDocsById: Record<string, CertDoc[]> = Object.fromEntries(
    certifications.map((cert) => [cert.id, buildCertificateDocs(cert, media.certificateFiles[cert.id] ?? [])]),
  );

  /* Efek scroll untuk navbar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Musik otomatis.
     1) Coba putar langsung saat halaman dibuka.
     2) Browser umumnya memblokir suara otomatis. Kalau diblokir, musik dimulai
        saat pengunjung pertama kali menyentuh atau mengklik halaman. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BGM_VOLUME;

    let cancelled = false;
    const unlockEvents = ["pointerup", "touchend", "click", "keydown"];

    const removeUnlock = () => {
      unlockEvents.forEach((name) => window.removeEventListener(name, unlock));
    };
    const unlock = () => {
      audio.play().then(removeUnlock).catch(() => {});
    };

    audio.play().catch(() => {
      if (cancelled) return;
      unlockEvents.forEach((name) => window.addEventListener(name, unlock));
    });

    return () => {
      cancelled = true;
      removeUnlock();
      audio.pause();
    };
  }, []);

  return (
    <main>
      <audio ref={audioRef} src={BGM_SRC} loop preload="auto" />

      <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
        <nav aria-label="Navigasi utama" className="nav-shell">
          <a aria-label="Kembali ke beranda" className="brand-mark" href="#home">
            <span>S</span>
            <b>A</b>
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
            ))}
          </div>
          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-menu" id="mobile-menu">
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase()}`} key={item} onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span /><Icon name="sparkle" size={15} /> IT PROFESSIONAL · 2026</div>
          <h1><span>Muhammad</span> Syahri Anwar</h1>
          <p className="hero-role">IT Professional | Full Stack &amp; Microservices Developer</p>
          <p className="hero-school">D3 Teknik Informatika, Politeknik Negeri Banjarmasin</p>
          <p className="hero-tagline">Membangun sistem informasi terintegrasi, dari jaringan dan basis data hingga antarmuka web.</p>
          <p className="hero-intro">
            Lead Developer Sistem Informasi Museum Wasaka dengan pengalaman di instansi pemerintah (Polda Kalsel dan ATR/BPN Tabalong). Berpengalaman dengan Laravel, Next.js, Docker, dan MySQL, serta pernah memimpin tim sebagai Project Manager.
          </p>
          <div className="hero-actions">
            <a className="button primary" data-umami-event="klik-lihat-proyek" href="#projects">Lihat Proyek <Icon name="arrow" size={18} /></a>
            <a className="button secondary" data-umami-event="klik-hubungi-saya" href="#contact">Hubungi Saya</a>
          </div>
          <div className="hero-meta">
            <span><b>3.71</b> IPK / 4.00</span>
            <span><b>{experiences.length}</b> Peran kunci</span>
            <span><b>{certifications.length}</b> Sertifikasi</span>
          </div>
        </div>

        <div className="hero-art">
          <div aria-hidden="true" className="magic-circle"><i /><i /><i /></div>
          <div className="hero-portrait">
            {media.profilePhoto ? (
              <Image
                alt="Foto Muhammad Syahri Anwar"
                className="hero-photo"
                height={0}
                priority
                sizes="(min-width: 950px) 340px, 260px"
                src={media.profilePhoto}
                width={0}
              />
            ) : (
              <span aria-hidden="true" className="hero-initials">MSA</span>
            )}
          </div>
          <div aria-hidden="true" className="floating-rune rune-one"><Icon name="code" size={22} /></div>
          <div aria-hidden="true" className="floating-rune rune-two"><Icon name="database" size={22} /></div>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-heading">
          <div><span className="section-index">01 — TENTANG SAYA</span><h2>Berawal dari <em>nol.</em></h2></div>
          <p>Perjalanan dari bangku D3 Teknik Informatika hingga memimpin tim dan membangun sistem terintegrasi.</p>
        </div>
        <div className="about-grid">
          <article className="about-story">
            <div className="quote-mark">“</div>
            <h3>Membangun sistem yang terhubung, dari jaringan hingga antarmuka.</h3>
            <p>Saya mengombinasikan pengalaman infrastruktur TI di lingkungan pemerintahan dengan pengembangan Full Stack dan arsitektur microservices berbasis Docker, serta pengelolaan basis data yang rapi dan andal.</p>
            <div className="signature">Syahri <span>Full Stack Developer</span></div>
          </article>
          <div className="about-cards">
            <article className="info-card">
              <div className="icon-box"><Icon name="layers" /></div>
              <div><span>00 / LEAD</span><h3>Project Management</h3><p>Memimpin tim lintas disiplin dan menjaga alur kerja tetap terarah dari perencanaan hingga rilis.</p></div>
            </article>
            <article className="info-card">
              <div className="icon-box"><Icon name="code" /></div>
              <div><span>01 / CRAFT</span><h3>Full Stack Development</h3><p>Laravel, Next.js, Tailwind CSS, dan RESTful API untuk aplikasi web end-to-end.</p></div>
            </article>
            <article className="info-card">
              <div className="icon-box"><Icon name="database" /></div>
              <div><span>02 / SYSTEM</span><h3>Microservices &amp; Database</h3><p>Layanan berbasis Docker, MySQL, dan administrasi basis data yang terintegrasi.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="education section-shell" id="education" aria-label="Pendidikan">
        <div className="edu-band">
          <div>
            <span className="section-index">PENDIDIKAN</span>
            <h3>Politeknik Negeri Banjarmasin <em>(Poliban)</em></h3>
            <p>D3 Teknik Informatika · 2023 – 2026</p>
          </div>
          <div className="edu-gpa"><small>IPK</small><b>3.71</b><span>/ 4.00</span></div>
        </div>
      </section>

      <section className="experience" id="experience">
        <div className="section-shell">
          <div className="section-heading">
            <div><span className="section-index">02 — PENGALAMAN</span><h2>Jejak <em>perjalanan.</em></h2></div>
            <p>Empat peran yang membentuk cara saya bekerja: data spasial, rekayasa produk, operasional TI, dan kepemimpinan.</p>
          </div>
          <ol className="timeline">
            {experiences.map((item, index) => {
              const photos = item.photoFolder
                ? buildProjectPhotos(item.role, media.experiencePhotos[item.photoFolder] ?? [], "Dokumentasi kegiatan")
                : [];
              return (
              <li className="timeline-item" key={item.role}>
                <span className="timeline-no">0{index + 1}</span>
                <div className="timeline-card">
                  <span className="timeline-period">{item.period}</span>
                  <h3>{item.role}</h3>
                  <p className="timeline-org">{item.org}</p>
                  <p>{item.description}</p>
                  <div className="tag-row">{item.tags.map((tag) => <b key={tag}>{tag}</b>)}</div>
                  {photos.length > 0 && (
                    <button className="cert-view" data-umami-event="lihat-foto-pengalaman" onClick={() => openViewer(item.role, photos)} type="button">
                      <Icon name="image" size={15} /> Lihat {photos.length} foto
                    </button>
                  )}
                </div>
              </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="section-shell">
          <div className="section-heading">
            <div><span className="section-index">03 — PROYEK</span><h2>Dunia yang <em>saya bangun.</em></h2></div>
            <p>Karya terpilih yang memadukan arsitektur yang kuat dengan pengalaman pengguna yang imersif.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => {
              const photos = project.photoFolder
                ? buildProjectPhotos(project.title, media.projectPhotos[project.photoFolder] ?? [])
                : [];
              const certDocs = project.certificateId ? (certDocsById[project.certificateId] ?? []) : [];
              const certTitle =
                certifications.find((cert) => cert.id === project.certificateId)?.title ?? project.title;
              const hasPhotos = photos.length > 0;
              const showCertButton = !hasPhotos && certDocs.length > 0;

              return (
                <article className="project-card" key={project.title}>
                  <div className={project.className}>
                    {hasPhotos && (
                      <>
                        <Image
                          alt={photos[0].alt}
                          className="project-cover"
                          fill
                          sizes="(min-width: 950px) 580px, 100vw"
                          src={photos[0].src}
                        />
                        <div className="cover-shade" />
                        <button
                          aria-hidden="true"
                          className="cover-hit"
                          onClick={() => openViewer(project.title, photos)}
                          tabIndex={-1}
                          type="button"
                        />
                      </>
                    )}
                    <span className="project-number">{project.number}</span>
                    {!hasPhotos && (
                      <div className="visual-window">
                        <div className="window-bar"><i /><i /><i /></div>
                        <div className="window-content"><span /><span /><span /></div>
                      </div>
                    )}
                    {hasPhotos && (
                      <button className="photo-button" data-umami-event="lihat-foto-proyek" onClick={() => openViewer(project.title, photos)} type="button">
                        <Icon name="image" size={16} /> Lihat {photos.length} foto
                      </button>
                    )}
                    {showCertButton && (
                      <button className="photo-button" data-umami-event="lihat-sertifikat" onClick={() => openViewer(certTitle, certDocs)} type="button">
                        <Icon name="image" size={16} /> {project.certificateButton ?? "Lihat sertifikat"}
                      </button>
                    )}
                    <a aria-label={`Diskusikan ${project.title}`} href="#contact"><Icon name="arrow" /></a>
                  </div>
                  <div className="project-info">
                    <span>{project.type}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div>{project.stack.map((tech) => <b key={tech}>{tech}</b>)}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="certs section-shell" id="certifications">
        <div className="section-heading">
          <div><span className="section-index">04 — LISENSI &amp; SERTIFIKASI</span><h2>Bukti <em>kompetensi.</em></h2></div>
          <p>Pelatihan dan sertifikasi kompetensi resmi yang memvalidasi keahlian teknis saya.</p>
        </div>
        <div className="cert-grid">
          {certifications.map((cert, index) => {
            const docs = certDocsById[cert.id] ?? [];
            return (
              <article className="cert-card" key={cert.id}>
                <span className="cert-no">0{index + 1}</span>
                <div>
                  <h3>{cert.title}</h3>
                  <p>{cert.issuer}</p>
                </div>
                <div className="cert-actions">
                  {cert.year && <b>{cert.year}</b>}
                  {Array.from(new Set(docs.map((doc) => shortLabel(doc.label)))).map((label) => (
                    <span className="cert-chip" key={label}>{label}</span>
                  ))}
                  {docs.length > 0 && (
                    <button
                      aria-label={`Lihat sertifikat ${cert.title}`}
                      data-umami-event="lihat-sertifikat"
                      className="cert-view"
                      onClick={() => openViewer(cert.title, docs)}
                      type="button"
                    >
                      <Icon name="image" size={15} />{" "}
                      {docs.length > 1 ? `Lihat ${docs.length} sertifikat` : "Lihat sertifikat"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="skills section-shell" id="skills">
        <div className="section-heading">
          <div><span className="section-index">05 — KEAHLIAN</span><h2>Bekal <em>perjalanan.</em></h2></div>
          <p>Perpaduan keahlian teknis dan kemampuan interpersonal untuk membawa ide dari nol menjadi produk nyata.</p>
        </div>
        <div className="skills-layout">
          <div className="soft-panel">
            <span className="skill-orbit"><Icon name="sparkle" size={28} /></span>
            <h3>Soft Skills</h3>
            <ul>
              {softSkills.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="skills-title">Hard Skills</h3>
            <div className="skill-tiles">
              {hardSkills.map((item, index) => (
                <div className="skill-tile" key={item}>
                  <span>0{index + 1}</span>
                  <h4>{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="snow" />
        <div className="footer-content section-shell">
          <span className="section-index">06 — KONTAK</span>
          <h2>Mari ciptakan dunia<br /><em>baru bersama.</em></h2>
          <p>Punya proyek, peluang magang, atau ingin berdiskusi tentang arsitektur microservices? Saya terbuka untuk percakapan baru.</p>
          <div className="contact-list">
            <a data-umami-event="kontak-email" href={`mailto:${CONTACT.email}`}><Icon name="mail" size={20} /><span><small>Email</small>{CONTACT.email}</span></a>
            <a data-umami-event="kontak-telepon" href={`tel:${CONTACT.phoneLink}`}><Icon name="globe" size={20} /><span><small>Telepon</small>{CONTACT.phoneText}</span></a>
            <a data-umami-event="kontak-linkedin" href={CONTACT.linkedinUrl} rel="noreferrer" target="_blank"><Icon name="linkedin" size={20} /><span><small>LinkedIn</small>Muhammad Syahri Anwar</span></a>
            <a data-umami-event="kontak-github" href={CONTACT.githubUrl} rel="noreferrer" target="_blank"><Icon name="github" size={20} /><span><small>GitHub</small>{CONTACT.githubLabel}</span></a>
          </div>
          <div className="footer-bottom">
            <a className="footer-logo" href="#home"><span>Syahri</span> Anwar <small>PORTFOLIO</small></a>
            <p>© 2026 Muhammad Syahri Anwar. All rights reserved.</p>
          </div>
        </div>
        <span className="photo-credit">Foto oleh Neil Rosenstech / Unsplash</span>
      </footer>

      {viewer && (
        <Lightbox
          images={viewer.images}
          onClose={closeViewer}
          startIndex={viewer.start}
          title={viewer.title}
        />
      )}
    </main>
  );
}

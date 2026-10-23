"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
};

type LightboxProps = {
  title: string;
  images: Photo[];
  startIndex?: number;
  onClose: () => void;
};

const isPdf = (src: string) => /\.pdf(\?|#|$)/i.test(src);

export default function Lightbox({ title, images, startIndex = 0, onClose }: LightboxProps) {
  const total = images.length;
  const [index, setIndex] = useState(startIndex);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  /* Saat dibuka: kunci scroll halaman, pindahkan fokus ke tombol tutup.
     Saat ditutup: kembalikan scroll dan fokus ke tombol yang membukanya. */
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, []);

  /* Keyboard: Esc menutup, panah kiri/kanan berpindah, Tab tetap di dalam jendela */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe"),
        ).filter((element) => element.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const current = images[index];
  if (!current) return null;

  const pdf = isPdf(current.src);

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || total < 2) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prev();
      else next();
    }
  };

  return (
    <div
      ref={dialogRef}
      aria-label={title}
      aria-modal="true"
      className="lightbox"
      onClick={onClose}
      role="dialog"
    >
      <div className="lightbox-bar" onClick={(event) => event.stopPropagation()}>
        <div>
          <h3 className="lightbox-title">{title}</h3>
          {total > 1 && <span className="lightbox-count">{index + 1} / {total}</span>}
        </div>
        <button aria-label="Tutup" className="lightbox-close" onClick={onClose} ref={closeRef} type="button">
          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div
        className="lightbox-stage"
        onClick={(event) => event.stopPropagation()}
        onTouchEnd={onTouchEnd}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      >
        {pdf ? (
          <>
            <iframe className="lightbox-pdf" key={current.src} src={`${current.src}#view=FitH`} title={current.alt} />
            <div className="lightbox-pdf-fallback">
              <p>Pratinjau PDF tidak tersedia di perangkat ini.</p>
              <a href={current.src} rel="noreferrer" target="_blank">Buka sertifikat (PDF)</a>
            </div>
          </>
        ) : broken[current.src] ? (
          <p className="lightbox-missing">Gambar tidak dapat dimuat.</p>
        ) : (
          <Image
            alt={current.alt}
            className="lightbox-img"
            fill
            key={current.src}
            onError={() => setBroken((state) => ({ ...state, [current.src]: true }))}
            sizes="(min-width: 1100px) 1100px, 100vw"
            src={current.src}
          />
        )}
      </div>

      <div className="lightbox-footer" onClick={(event) => event.stopPropagation()}>
        {total > 1 && (
          <button aria-label="Dokumen sebelumnya" className="lightbox-nav" onClick={prev} type="button">
            <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        )}
        <div className="lightbox-caption">
          {current.caption && <p>{current.caption}</p>}
          {pdf && (
            <a className="lightbox-open" href={current.src} rel="noreferrer" target="_blank">
              Buka di tab baru
            </a>
          )}
        </div>
        {total > 1 && (
          <button aria-label="Dokumen berikutnya" className="lightbox-nav" onClick={next} type="button">
            <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

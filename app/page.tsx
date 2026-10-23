import fs from "node:fs";
import path from "node:path";
import Portfolio from "../components/Portfolio";
import {
  certifications,
  experiences,
  projects,
  type MediaFile,
  type PortfolioMedia,
} from "../components/portfolio-data";

const IMAGE_FILES = /\.(jpe?g|png|webp|avif)$/i;
const DOCUMENT_FILES = /\.(pdf|jpe?g|png|webp|avif)$/i;

/** Membaca isi folder di dalam public/ dan mengembalikan daftar file yang cocok (urut angka/abjad). */
function listMedia(folder: string, pattern: RegExp): MediaFile[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", folder))
      .filter((name) => pattern.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((name) => ({ name, src: `/${folder}/${encodeURIComponent(name)}` }));
  } catch {
    return []; // folder belum dibuat atau kosong: bagian itu cukup tidak tampil
  }
}

export default function Page() {
  const media: PortfolioMedia = {
    profilePhoto: listMedia("images/profile", IMAGE_FILES)[0]?.src ?? null,
    experiencePhotos: {},
    projectPhotos: {},
    certificateFiles: {},
  };

  for (const experience of experiences) {
    if (experience.photoFolder) {
      media.experiencePhotos[experience.photoFolder] = listMedia(
        `images/experience/${experience.photoFolder}`,
        IMAGE_FILES,
      );
    }
  }

  for (const project of projects) {
    if (project.photoFolder) {
      media.projectPhotos[project.photoFolder] = listMedia(
        `images/projects/${project.photoFolder}`,
        IMAGE_FILES,
      );
    }
  }

  for (const cert of certifications) {
    media.certificateFiles[cert.id] = listMedia(`certificates/${cert.id}`, DOCUMENT_FILES);
  }

  return <Portfolio media={media} />;
}

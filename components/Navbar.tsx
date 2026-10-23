"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo Re:Zero */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 overflow-hidden rounded-full border border-purple-300 group-hover:border-[#6b52a1] transition-all">
            <Image
              src="/images/logo.jpg"
              alt="Re:Zero Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-fantasy text-lg font-bold tracking-wider text-black group-hover:text-[#6b52a1] transition-colors">
            Re:Portfolio
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#hero" className="hover:text-[#6b52a1] transition-colors">
            Beranda
          </a>
          <a href="#about" className="hover:text-[#6b52a1] transition-colors">
            Tentang Saya
          </a>
          <a href="#projects" className="hover:text-[#6b52a1] transition-colors">
            Proyek
          </a>
          <a href="#skills" className="hover:text-[#6b52a1] transition-colors">
            Skill
          </a>
        </nav>

        {/* BGM Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-300 bg-purple-50 text-xs font-semibold text-[#6b52a1] hover:bg-purple-100 transition-all shadow-sm"
        >
          <span className={isPlaying ? "animate-spin" : ""}>🎵</span>
          <span>{isPlaying ? "BGM: On" : "Play BGM"}</span>
        </button>
      </div>
    </header>
  );
}
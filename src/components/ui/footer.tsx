import Image from "next/image";

export default function Footer() {
  return (
    <footer
      id="footer1"
      className="flex flex-col items-center justify-center mt-12 mb-0 bg-white/70 py-5 shadow-lg"
    >
      <div className="flex flex-col items-center space-y-0">
        <p className="text-lg font-semibold text-black leading-tight mb-0">
          Zio Gregory Magugat
        </p>
        <a
          href="mailto:zimagugat@gmail.com"
          className="text-black mt-0 mb-0 hover:underline text-base"
        >
          Email Me
        </a>
      </div>
      <div className="flex space-x-4 mt-4">
        <a
          href="https://github.com/Magzzi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://img.icons8.com/?size=100&id=12599&format=png&color=1A1A1A"
            width={40}
            height={40}
            alt="GitHub"
            className="hover:scale-110 transition-transform bg-white rounded-full p-1"
          />
        </a>
        <a
          href="https://www.linkedin.com/in/ziomagugat/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://img.icons8.com/?size=100&id=8808&format=png&color=1A1A1A"
            width={40}
            height={40}
            alt="LinkedIn"
            className="hover:scale-110 transition-transform bg-white rounded-full p-1"
          />
        </a>
      </div>
      <p className="text-xs text-black mt-4">
        &copy; 2025 Zio Magugat. All rights reserved.
      </p>
    </footer>
  );
}

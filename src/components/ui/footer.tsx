import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-8 pt-10 pb-10 border-t border-white/10 bg-transparent">
          <p className="text-center text-xs text-gray-500 font-mono">
            © {new Date().getFullYear()} Zio Magugat · Built with intention
          </p>
        </footer>
  );
}

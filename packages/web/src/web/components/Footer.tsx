import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e30] bg-[#050508] py-6">
      <p className="text-center font-inter text-xs text-[#4a4558] flex items-center justify-center gap-1.5">
        Made with <Heart size={10} className="text-[#c0392b] fill-[#c0392b]" /> by Dikshant
      </p>
    </footer>
  );
}

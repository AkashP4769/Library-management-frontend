// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-8 py-8 bg-gray-100 border-t border-gray-200 h-[39px]">
      <div className="flex items-center gap-2 font-bold text-[#141b2b]">
        <span className="border border-[#141b2b] rounded p-1 text-base">⊡</span>
        Lumina Library Systems
      </div>

      <p className="text-sm text-gray-500">
        © 2024 Lumina Library Systems. All rights reserved.
      </p>
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <a href="#" className="hover:text-[#141b2b] transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#141b2b] transition-colors">
          Terms of Service
        </a>
        <a href="#" className="hover:text-[#141b2b] transition-colors">
          Contact Support
        </a>
      </div>
    </footer>
  );
}

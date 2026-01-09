import {
  FaClock,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white py-8" id="footer">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 text-[1.4rem] font-bold mb-2">
            <FaClock className="text-brand-500" />
            <span>Chronos</span>
          </div>

          {/* Tagline */}
          <p className="text-[0.95rem] text-gray-400 mb-4 max-w-[300px] leading-relaxed opacity-90">
            Visualize your time, transform your life.
          </p>

          {/* Social Links */}
          <div className="flex gap-3.5">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:-translate-y-1"
              aria-label="Twitter"
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:-translate-y-1"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:-translate-y-1"
              aria-label="Instagram"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col items-center justify-center pt-6 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center m-0">
            &copy; {year} Chronos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

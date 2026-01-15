import { FaClock, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // Changed to bg-brand-900 (Deep Ocean Blue) to match your theme
    <footer className="bg-brand-900 text-white py-5" id="footer">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center mb-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 text-[1.25rem] font-bold mb-1">
            {/* Icon uses lighter brand color for contrast on dark footer */}
            <FaClock className="text-brand-400" />
            <span>Chronos</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-400 mb-3 max-w-[300px] leading-relaxed opacity-90">
            Visualize your time, transform your life.
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/ankit_bareth_dev/"
              target="_blank"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xs" />
            </a>
            <a
              href="https://www.linkedin.com/in/ankit-bareth-64956035b/"
              target="_blank"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-xs" />
            </a>
            <a
              href="https://github.com/ankitbareth-dev"
              target="_blank"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500 hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaGithub className="text-xs" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col items-center justify-center pt-3 border-t border-white/10">
          <p className="text-[10px] text-gray-500 text-center m-0">
            &copy; {year} Chronos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

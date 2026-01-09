import { useState, useEffect, useRef } from "react";
import { FaClock, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const linkClass =
    "font-medium text-ui-text hover:text-brand-500 transition-colors";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ui-card/90 backdrop-blur-md shadow-sm border-b border-ui-border">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo with Clock Icon (SVG) */}
        <div className="flex items-center gap-2 text-2xl font-bold text-brand-500">
          {/* Clock Icon SVG */}
          <FaClock className="w-8 h-8 text-brand-500" />
          <span>Chronos</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            <li>
              <a href="#features" className={linkClass}>
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className={linkClass}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" className={linkClass}>
                FAQ
              </a>
            </li>
            <li>
              <a href="#founder" className={linkClass}>
                Founder
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button with Icon (SVG) */}
        <button
          ref={buttonRef}
          className="md:hidden text-2xl text-ui-text focus:outline-none p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-8 h-8 text-ui-text" />
          ) : (
            <FaBars className="w-8 h-8 text-ui-text" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <nav
        ref={menuRef}
        className={`md:hidden absolute top-full left-0 w-full bg-ui-card shadow-lg border-b border-ui-border transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-5">
          <li>
            <a href="#features" onClick={closeMenu} className={linkClass}>
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" onClick={closeMenu} className={linkClass}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#faq" onClick={closeMenu} className={linkClass}>
              FAQ
            </a>
          </li>
          <li>
            <a href="#founder" onClick={closeMenu} className={linkClass}>
              Founder
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

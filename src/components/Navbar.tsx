import { useState, useEffect, useRef } from "react";
import {
  FaClock,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAuth } from "../features/auth/authSlice";
import ModalPortal from "./ModalPortal";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux State
  const { user, loading, isAuthenticated } = useAppSelector(selectAuth);
  console.log(user);

  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Refs
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // --- Mobile Menu Handlers ---
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // Click outside to close mobile menu
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // --- User Dropdown Handlers ---
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // --- Logout Handlers ---
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        // Error handling
      });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Updated link class to use UI text color
  const linkClass =
    "font-medium text-ui-text hover:text-brand-500 transition-colors";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ui-card/90 backdrop-blur-md shadow-sm border-b border-ui-border">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 text-2xl font-bold text-brand-500 cursor-pointer"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          <FaClock className="w-8 h-8 text-brand-500" />
          <span>Chronos</span>
        </div>

        {/* RIGHT SIDE: CONDITIONAL RENDERING */}
        {!isAuthenticated ? (
          /* --- GUEST NAV (Desktop) --- */
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
                <a href="#FAQ" className={linkClass}>
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        ) : (
          /* --- USER NAV (Desktop) --- */
          <div className="relative hidden md:block">
            {/* Profile Button */}
            <button
              ref={profileBtnRef}
              onClick={toggleDropdown}
              className="flex items-center gap-3 focus:outline-none group"
            >
              {/* Avatar Image or Fallback */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-ui-border group-hover:border-brand-500 transition-colors bg-ui-bg">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                      (
                        e.currentTarget.nextElementSibling as HTMLElement
                      )?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                {!user?.avatarUrl && (
                  <div className="w-full h-full flex items-center justify-center text-ui-muted">
                    <FaUser />
                  </div>
                )}
              </div>
              {/* User Name - Added Fallback text */}
              <span className="text-sm font-semibold text-ui-text group-hover:text-brand-500 transition-colors">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-48 bg-ui-card rounded-xl shadow-xl border border-ui-border overflow-hidden py-2 transition-all duration-200"
              >
                <div className="px-4 py-2 border-b border-ui-border mb-1">
                  <p className="text-xs text-ui-muted">Signed in as</p>
                  <p className="text-sm font-semibold text-ui-text truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors text-left"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* MOBILE MENU BUTTON (Hamburger) */}
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

      {/* MOBILE NAVIGATION DROPDOWN */}
      <nav
        ref={menuRef}
        className={`md:hidden absolute top-full left-0 w-full bg-ui-card shadow-lg border-b border-ui-border transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        {!isAuthenticated ? (
          /* --- GUEST MOBILE LINKS --- */
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
          </ul>
        ) : (
          /* --- USER MOBILE LINKS --- */
          <ul className="flex flex-col gap-4 px-5">
            <li className="flex items-center gap-3 p-2 border-b border-ui-border">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-ui-bg">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-ui-text">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-ui-muted">{user?.email}</p>
              </div>
            </li>
            <li>
              <button
                onClick={handleLogoutClick}
                className={linkClass + " flex items-center gap-2 text-red-500"}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        )}
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-ui-card rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto">
              <h3 className="text-xl font-bold text-ui-text mb-2">Sign out?</h3>
              <p className="text-ui-text mb-6">
                Are you sure you want to log out? You will need to sign in again
                to access your dashboard.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl border border-ui-border"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogout}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-brand-500 text-white flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Signing out...
                    </>
                  ) : (
                    "Sign out"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </header>
  );
};

export default Navbar;

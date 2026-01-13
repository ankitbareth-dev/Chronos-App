import { useState, useEffect, useRef } from "react";
import {
  FaClock,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSpinner,
  FaChevronDown,
  FaRegUser,
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
  console.log(user?.avatarUrl, user);

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
    // DO NOT close the modal here. We want to see the spinner.
    // setShowLogoutModal(false); <--- REMOVED

    dispatch(logout())
      .unwrap()
      .then(() => {
        // Only close and navigate AFTER server confirms logout
        setShowLogoutModal(false);
        navigate("/");
      })
      .catch((err) => {
        // If logout fails, close modal and handle error
        setShowLogoutModal(false);
        console.error("Logout failed", err);
      });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const linkClass =
    "font-medium text-ui-text hover:text-brand-500 transition-colors";

  const menuItemClass =
    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ui-text hover:bg-ui-bg transition-colors text-left";

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

        {/* RIGHT SIDE */}
        {!isAuthenticated ? (
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
          <div className="relative hidden md:block">
            {/* 
              UPDATED TRIGGER BUTTON: 
              Rounded border with Avatar -> Name -> Arrow 
            */}
            <button
              ref={profileBtnRef}
              onClick={toggleDropdown}
              className="flex items-center gap-3 pr-3 pl-1 py-1 border border-ui-border rounded-full hover:bg-ui-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {/* 1. Avatar */}
              <div className="w-8 h-8 rounded-full bg-ui-bg overflow-hidden flex-shrink-0">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ui-muted text-xs">
                    <FaUser />
                  </div>
                )}
              </div>

              {/* 2. Name */}
              <span className="text-sm font-medium text-ui-text truncate max-w-[100px]">
                {user?.name || "User"}
              </span>

              {/* 3. Arrow Icon */}
              <FaChevronDown
                className="w-3 h-3 text-ui-muted transition-transform duration-200"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-56 bg-ui-card rounded-xl shadow-xl border border-ui-border overflow-hidden z-50 animate-fade-in-down"
              >
                {/* THE ARROW (Triangle) */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-ui-card border-t border-l border-ui-border transform rotate-45"></div>

                {/* 1. "Signed in as" Section */}
                <div className="px-4 py-3 border-b border-ui-border">
                  <p className="text-xs text-ui-muted">Signed in as</p>
                  <p className="text-sm font-semibold text-ui-text truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* 2. Simple List: Profile & Logout */}
                <div className="py-1">
                  <button
                    className={menuItemClass}
                    onClick={handleProfileClick}
                  >
                    <FaRegUser className="text-ui-muted w-5" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/50 transition-colors text-left"
                  >
                    <FaSignOutAlt className="w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        <button
          ref={buttonRef}
          className="md:hidden text-2xl text-ui-text focus:outline-none p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU CONTENT */}
      <nav
        ref={menuRef}
        className={`md:hidden absolute top-full left-0 w-full bg-ui-card shadow-lg border-b border-ui-border transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        {!isAuthenticated ? (
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
          </ul>
        ) : (
          <ul className="flex flex-col gap-4 px-5">
            <li className="flex items-center gap-3 p-2 border-b border-ui-border">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-ui-bg flex items-center justify-center text-ui-muted">
                <FaUser />
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

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-ui-card rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto">
              <h3 className="text-xl font-bold text-ui-text mb-2">Sign out?</h3>
              <p className="text-ui-text mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl border border-ui-border text-ui-text hover:bg-ui-bg disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
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

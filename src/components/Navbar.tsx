import { useState, useRef } from "react";
import {
  FaClock,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaRegUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectAuth } from "../features/auth/authSlice";
import { useClickOutside } from "../hooks/useClickOutside";
import { LogoutModal } from "./LogoutModal";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, loading, isAuthenticated } = useAppSelector(selectAuth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  useClickOutside(
    [menuRef, buttonRef],
    () => setMobileMenuOpen(false),
    mobileMenuOpen,
  );

  useClickOutside(
    [dropdownRef, profileBtnRef],
    () => setIsDropdownOpen(false),
    isDropdownOpen,
  );

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutModal(true);
    setLogoutError(null);
  };

  const confirmLogout = async () => {
    setLogoutError(null);
    try {
      await dispatch(logout()).unwrap();
      setShowLogoutModal(false);
      navigate("/");
    } catch (err) {
      const message =
        typeof err === "string" ? "Logout failed. Please try again." : "";
      setLogoutError(message);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    setLogoutError(null);
  };

  const handleDropdownNavigate = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const linkClass =
    "font-medium text-ui-text hover:text-brand-500 transition-colors";
  const menuItemClass =
    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ui-text hover:bg-ui-bg transition-colors text-left";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-ui-card/90 backdrop-blur-md shadow-sm border-b border-ui-border">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 text-2xl font-bold text-brand-500 cursor-pointer"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        >
          <FaClock className="w-8 h-8 text-brand-500" />
          <Link to={"/dashboard"}>Chronos</Link>
        </div>

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
            </ul>
          </nav>
        ) : (
          <div className="relative hidden md:block">
            {/* Profile Button */}
            <button
              ref={profileBtnRef}
              onClick={toggleDropdown}
              className="flex items-center gap-3 pr-3 pl-1 py-1 border border-ui-border rounded-full hover:bg-ui-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
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
              <span className="text-sm font-medium text-ui-text truncate max-w-[100px]">
                {user?.name || "User"}
              </span>
              <FaChevronDown
                className="w-3 h-3 text-ui-muted transition-transform duration-200"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-56 bg-ui-card rounded-xl shadow-xl border border-ui-border overflow-hidden z-50 animate-fade-in-down"
              >
                <div className="absolute -top-2 right-4 w-4 h-4 bg-ui-card border-t border-l border-ui-border transform rotate-45"></div>
                <div className="px-4 py-3 border-b border-ui-border">
                  <p className="text-xs text-ui-muted">Signed in as</p>
                  <p className="text-sm font-semibold text-ui-text truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className={menuItemClass}
                    onClick={() => handleDropdownNavigate("/profile")}
                  >
                    <FaRegUser className="text-ui-muted w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    className={menuItemClass}
                    onClick={() => handleDropdownNavigate("/dashboard")}
                  >
                    <FaTachometerAlt className="text-ui-muted w-5" />
                    <span>Dashboard</span>
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

        {/* Mobile Toggle Button */}
        <button
          ref={buttonRef}
          className="md:hidden text-2xl text-ui-text focus:outline-none p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
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
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
                className={linkClass + " flex items-center gap-2"}
              >
                <FaTachometerAlt /> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
                className={linkClass + " flex items-center gap-2"}
              >
                <FaRegUser /> Profile
              </button>
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

      {/* Logout Modal Component */}
      <LogoutModal
        isOpen={showLogoutModal}
        loading={loading}
        error={logoutError}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </header>
  );
};

export default Navbar;

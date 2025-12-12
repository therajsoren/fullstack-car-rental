"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { publicNavLinks, authNavLinks } from "@/lib/constants";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  const { user, isLoading, isSignedIn, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          linksRef.current?.children || [],
          {
            y: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          actionsRef.current?.children || [],
          {
            y: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
          },
          "-=0.3"
        );
    },
    { scope: navRef }
  );

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileMenuOpen(false);
    }
  };

  const openLoginModal = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href={isSignedIn ? "/dashboard" : "/"}
              className="relative z-10"
            >
              <span
                ref={logoRef}
                className="text-xl md:text-2xl font-bold tracking-tight text-gray-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                VELOCE<span className="text-primary font-light">/</span>
              </span>
            </Link>

            {/* Center Navigation Links - Desktop */}
            <div
              ref={linksRef}
              className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600"
            >
              {(isSignedIn ? authNavLinks : publicNavLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="relative group py-2"
                >
                  <span className="hover:text-gray-900 transition-colors duration-200">
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div
              ref={actionsRef}
              className="hidden md:flex items-center space-x-3"
            >
              {isLoading ? (
                <div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse" />
              ) : !isSignedIn ? (
                <>
                  {/* Login Button */}
                  <button
                    onClick={openLoginModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100"
                  >
                    Login
                  </button>

                  {/* Sign Up Button */}
                  <button
                    onClick={openSignupModal}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-300 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <div className="flex items-center">
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm hover:bg-primary-hover transition-colors ring-2 ring-primary/20 ring-offset-2"
                    >
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 relative z-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? "max-h-96 pb-6" : "max-h-0"
            }`}
          >
            <div className="flex flex-col space-y-1 pt-4 border-t border-gray-100">
              {(isSignedIn ? authNavLinks : publicNavLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!isSignedIn && (
                <Link
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "#contact")}
                  className="text-primary font-medium py-3 px-4 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  Contact
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              {!isSignedIn && !isLoading && (
                <div className="flex gap-3 pt-4 px-4">
                  <button
                    onClick={openLoginModal}
                    className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="flex-1 py-3 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Navbar;

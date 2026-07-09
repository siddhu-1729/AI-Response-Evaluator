import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, LogIn } from "lucide-react";


const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Evaluate", href: "/evaluate" },
//   { label: "Docs", href: "/docs" },
//   { label: "Pricing", href: "/pricing" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Keep the <html> element's class in sync with the theme state.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Close the mobile menu automatically when the viewport grows back to desktop size.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
            AI
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-100 sm:text-xl">
            <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              AI Response
            </span>{" "}
            Evaluator
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side controls (desktop) */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-100"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-950/40 transition-transform hover:scale-[1.02] hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]"
          >
            <LogIn size={16} />
            Login
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-100"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-100"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isMenuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-slate-800/80 px-4 pb-4 pt-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            <LogIn size={16} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};
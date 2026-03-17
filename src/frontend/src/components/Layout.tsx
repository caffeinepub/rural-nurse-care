import { Link, useRouterState } from "@tanstack/react-router";
import { CrossIcon, Heart, Mail, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DisclaimerPopup } from "./DisclaimerPopup";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <CrossIcon size={16} className="text-primary-foreground" />
      </div>
      <span className="font-bold text-lg text-foreground">
        <span className="text-primary">Rural</span>Nurse Care
      </span>
    </Link>
  );
}

const NAV_LINKS = [
  { label: "Find a Nurse", to: "/nurses" },
  { label: "Register as Nurse", to: "/register" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Admin", to: "/admin" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      <DisclaimerPopup />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to as string}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/nurses"
              search={{ pincode: undefined }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-ocid="nav.primary_button"
            >
              Find Nurses
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <nav className="flex flex-col py-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to as string}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 py-3">
                  <Link
                    to="/nurses"
                    search={{ pincode: undefined }}
                    className="block text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.primary_button"
                  >
                    Find Nurses
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo />
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Connecting rural patients with trusted local nurses. Quality
                care, just a call away.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Find a Nurse", to: "/nurses" },
                  { label: "Register as Nurse", to: "/register" },
                  { label: "How It Works", to: "/#how-it-works" },
                  { label: "Admin Panel", to: "/admin" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to as string}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      data-ocid="footer.link"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Contact Info
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} className="text-primary" />
                  <span>+91 1800-CARE-NOW</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="text-primary" />
                  <span>support@ruralnursecare.in</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer box */}
          <div className="mt-8 bg-warning/15 border border-warning/40 rounded-xl px-5 py-4 space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">⚠️ Disclaimer:</span> This app is
              an informational platform connecting patients with independent
              nurses. It is{" "}
              <strong>NOT a substitute for professional medical advice</strong>{" "}
              or emergency services. In case of emergency, call{" "}
              <span className="font-bold text-destructive">108</span> or visit
              the nearest Government Hospital.
            </p>
            <p className="text-xs text-muted-foreground">
              అత్యవసర పరిస్థితుల్లో దయచేసి{" "}
              <span className="font-bold text-destructive">108</span> కి కాల్ చేయండి
              లేదా సమీప ప్రభుత్వ ఆసుపత్రిని సంప్రదించండి.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with{" "}
            <Heart size={12} className="inline text-destructive" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

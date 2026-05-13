"use client";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Arch", href: "#arch" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-darkbg/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-bold tracking-tight text-white">
          Bug<span className="text-accent">Red</span>
        </a>

        <nav className="hidden sm:flex items-center gap-8 text-sm text-white/70">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="hover:text-accent transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => handleScroll(e, "#contact")}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/80 transition-all duration-200 shadow-lg shadow-accent/20"
        >
          Request Service
        </a>
      </div>
    </header>
  );
}

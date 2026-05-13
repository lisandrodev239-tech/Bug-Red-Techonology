const services = [
  {
    title: "Windows",
    desc: "Installation, drivers, and optimization for gaming and productivity.",
    items: ["System Installation", "Driver Setup", "Performance Optimization"],
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
  },
  {
    title: "Linux",
    desc: "Ubuntu, Debian, Fedora — installation and dual-boot configurations.",
    items: ["Installation & Config", "Dual Boot Setup", "Server & Desktop"],
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7" />
        <path d="M12 3v12" />
        <path d="M8 7V3h8v4" />
        <path d="M9 16l3 3 3-3" />
      </svg>
    ),
  },
  {
    title: "Arch Linux Builds",
    desc: "Custom Hyprland/i3/BSPWM setups tailored to your workflow.",
    items: ["Hyprland / i3 / BSPWM", "Dotfiles Customization", "Performance Tuning"],
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2" />
        <polyline points="2 7 12 12 22 7" />
        <polyline points="12 12 12 22" />
        <polyline points="7 9.5 12 12 17 9.5" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Services</h2>
          <p className="mt-4 text-white/50 text-lg max-w-lg mx-auto">
            From vanilla Windows to riced Arch — we cover the full spectrum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.06] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-5 text-accent/80 group-hover:text-accent transition-colors duration-300">
                {s.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-white/50 mb-5">{s.desc}</p>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/60"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

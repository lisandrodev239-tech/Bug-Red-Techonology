export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 px-6">
      <div className="mx-auto max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Windows & Linux
            <br />
            <span className="text-accent">Installation Specialist</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0">
            Fast setups, optimization, and custom Arch Linux builds. From
            dual-boot to Hyprland ricing — we handle it all.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a
              href="#contact"
              className="rounded-lg bg-accent px-8 py-3 text-base font-medium text-white hover:bg-accent/80 transition-all duration-200 shadow-lg shadow-accent/20"
            >
              Request Support
            </a>
            <a
              href="#services"
              className="rounded-lg border border-white/20 px-8 py-3 text-base font-medium text-white/80 hover:border-accent hover:text-accent transition-all duration-200"
            >
              View Services
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-2 text-xs text-white/40 font-mono">terminal — bugred@archlinux</span>
            </div>
            <pre className="p-5 text-sm font-mono leading-relaxed text-green-400/90 overflow-x-auto">
{`$ neofetch
OS: Arch Linux x86_64
Host: BugRed Custom
Kernel: 6.12.9-arch1-1
DE: Hyprland
Shell: zsh 5.9

$ hyprctl monitors
Monitor eDP-1: 1920x1080@144Hz
  active workspace: 1 (term)
  special workspace: 2 (music)

$ ls ~/.config/hypr/
hyprland.conf  hyprlock.conf
hypridle.conf  wallpapers/

$ fastfetch | grep -i uptime
Uptime: 14 days, 7 hours, 23 mins`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

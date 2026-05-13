export default function ArchFeatures() {
  return (
    <section id="arch" className="py-24 px-6 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              EXPERTISE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Arch Linux <span className="text-accent">Custom Builds</span>
            </h2>
            <p className="text-white/60 leading-relaxed max-w-lg">
              We build Arch systems from the ground up — minimal, lean, and
              tailored to your hardware. From Hyprland rices to server
                    hardening, every dotfile is crafted with intent.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                "Hyprland / i3 / BSPWM",
                "Dotfiles & Ricing",
                "Advanced Configurations",
                "Performance Tuning",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="text-accent">▸</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="rounded-xl border border-white/5 bg-black/50 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-2 text-xs text-white/30 font-mono">~/.config/hypr/hyprland.conf</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed text-green-400/80 overflow-x-auto">
{`# =====================
# BugRed Arch Config
# =====================

exec-once = waybar & hyprpaper
exec-once = dunst

input {
    kb_layout = us
    follow_mouse = 1
    touchpad {
        natural_scroll = true
    }
}

general {
    gaps_in = 4
    gaps_out = 8
    border_size = 2
    col.active_border = rgba(f67280ee)
    col.inactive_border = rgba(355c7d66)
}

decoration {
    rounding = 12
    active_opacity = 0.95
    inactive_opacity = 0.85
}

binds {
    $mainMod = SUPER
    bind = $mainMod, Q, exec, alacritty
    bind = $mainMod, Space, exec, rofi -show drun
    bind = $mainMod, W, killactive,
    bind = $mainMod, F, fullscreen,
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

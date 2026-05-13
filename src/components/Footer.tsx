export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-3 text-sm text-white/40">
        <p>&copy; 2026 BugRed</p>
        <p>
          Windows <span className="mx-2 text-white/20">•</span> Linux{" "}
          <span className="mx-2 text-white/20">•</span> Arch Linux{" "}
          <span className="mx-2 text-white/20">•</span> Custom Builds
        </p>
      </div>
    </footer>
  );
}

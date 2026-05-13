import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>
    </Link>
  );
}

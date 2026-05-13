export default function ProductCard({
  name,
  specs,
  price,
}: {
  name: string;
  specs: string;
  price?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-accent/30 transition-all duration-300">
      <h3 className="text-base font-semibold text-white mb-1">{name}</h3>
      <p className="text-sm text-white/50">{specs}</p>
      {price && (
        <p className="text-sm text-accent font-medium mt-3">{price}</p>
      )}
    </div>
  );
}

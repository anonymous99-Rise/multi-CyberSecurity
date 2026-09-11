import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <div className="text-[9px] text-danger font-mono tracking-widest uppercase mb-2">
          // ERROR 404
        </div>
        <h1 className="text-6xl font-bold text-gray-700 font-mono mb-3">404</h1>
        <div className="glow-line w-24 mx-auto mb-4" />
        <p className="text-sm text-gray-500 mb-6 font-mono">// target not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-accent/30 text-accent text-xs font-mono hover:bg-accent/5 transition-colors"
        >
          ← RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}

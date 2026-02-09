import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold text-gray-800">Page not found</h1>
      <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="text-black font-medium underline">
        Back to home
      </Link>
    </div>
  );
}

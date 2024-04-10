import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">FiveLegFlex</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" className="px-6 py-3 bg-white text-black rounded-md hover:bg-black2 hover:text-white transition duration-200">
        Go back Home
      </Link>
    </div>
  );
}

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
          🤖 Robo Adviser
        </Link>
        <div className="flex gap-8">
          <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/part1" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Efficient Frontier
          </Link>
          <Link href="/part2" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Robo Adviser
          </Link>
        </div>
      </div>
    </nav>
  );
}

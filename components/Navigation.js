import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/part1">Efficient Frontier</Link>
      <Link href="/part2">Robo Adviser</Link>
    </nav>
  );
}

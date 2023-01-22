import Head from 'next/head';
import Feed from '../components/Feed';

export default function Home() {
  return (
    <main className="bg-gray-50 h-screen">
      <Feed />
    </main>
  );
}

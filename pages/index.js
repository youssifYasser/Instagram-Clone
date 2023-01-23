import CreatePostModal from '../components/CreatePostModal';
import Feed from '../components/Feed';

export default function Home() {
  return (
    <main className="bg-gray-50 h-screen">
      <CreatePostModal />
      <Feed />
    </main>
  );
}

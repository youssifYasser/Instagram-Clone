import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { postsState } from '../atoms/postsAtom';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Modal from '../components/Modal';

const Home = ({ posts }) => {
  const [postsAtom, setPostsAtom] = useRecoilState(postsState);
  setPostsAtom(posts);
  return (
    <>
      <main className="overflow-y-scroll bg-gray-50  h-screen scrollbar-thumb-gray-400 scrollbar-thin">
        <Header />
        <Feed />
        <Modal />
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, orderBy('timestamp', 'desc'));
  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: null,
  }));

  return {
    props: {
      posts,
    },
  };
};

export default Home;

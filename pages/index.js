import Head from 'next/head';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsState } from '../atoms/postsAtom';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Modal from '../components/Modal';

const Home = ({ posts }) => {
  const [postsAtom, setPostsAtom] = useRecoilState(postsState);
  setPostsAtom(posts);
  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-new-logo-vector-download-13.png"
        />
      </Head>

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

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';

import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import { postsState } from '../atoms/postsAtom';
import CreatePostModal from '../components/CreatePostModal';
import Feed from '../components/Feed';
import Header from '../components/Header';
import LikesListModal from '../components/LikesListModal';
import { db } from '../firebase';

const Home = ({ posts }) => {
  const [postsAtom, setPostsAtom] = useRecoilState(postsState);
  const open = useRecoilValue(modalState);
  setPostsAtom(posts);
  console.log(open);
  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/headerIcon.png" />
      </Head>

      <main className="overflow-y-scroll bg-gray-50  h-screen scrollbar-thumb-gray-400 scrollbar-thin">
        <Header />
        <Feed />
        <CreatePostModal />
        <LikesListModal />
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

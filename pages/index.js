import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CreatePostModal from '../components/CreatePostModal';
import Feed from '../components/Feed';
import Header from '../components/Header';
import { db } from '../firebase';

const Home = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/headerIcon.png" />
      </Head>

      <main className="overflow-y-scroll bg-gray-50  h-screen scrollbar-thumb-black scrollbar-thin">
        <Header />
        <Feed posts={posts} />
        <CreatePostModal />
      </main>
    </>
  );
};

export default Home;

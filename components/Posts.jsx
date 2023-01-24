import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsState } from '../atoms/postsAtom';
import { db } from '../firebase';
import Post from './Post';

const Posts = () => {
  const postsAtom = useRecoilValue(postsState);
  const [posts, setPosts] = useState(postsAtom);

  useEffect(() => {
    onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
  }, [db]);
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.profileImage}
          postImg={post.postImage}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;

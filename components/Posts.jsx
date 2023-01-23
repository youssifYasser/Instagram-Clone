import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import Post from './Post';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (Snapshot) => {
        setPosts(Snapshot.docs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.data().username}
          userImg={post.data().profileImage}
          postImg={post.data().postImage}
          caption={post.data().caption}
        />
      ))}
    </div>
  );
};

export default Posts;

import Post from './Post';

const posts = [
  {
    id: '123',
    username: 'youssef___yasser',
    userImg: '/profileTest.jpg',
    postImg: '/postTest.jpg',
    caption:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero quos natus deleniti dolore dolorum laudantium magnam pariatur id, quo est, optio vel, aspernatur perspiciatis molestiae consequuntur beatae aliquid sit necessitatibus.',
  },
  {
    id: '456',
    username: 'youssef___yasser',
    userImg: '/profileTest.jpg',
    postImg: '/profileTest.jpg',
    caption: 'Good Project, haa',
  },
];

const Posts = () => {
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.username}
          userImg={post.userImg}
          postImg={post.postImg}
          caption={post.caption}
        />
      ))}
    </div>
  );
};

export default Posts;

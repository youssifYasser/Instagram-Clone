import MenuComponent from './Menu';
import EmojiContainer from './EmojiContainer';
import {
  EllipsisHorizontalIcon,
  StarIcon,
  TrashIcon,
  HeartIcon,
  UserMinusIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Comment from './Comment';
import { useRecoilState } from 'recoil';
import { likesState } from '../atoms/likesAtom';
import { modalState } from '../atoms/modalAtom';

const Post = ({ id, username, userImg, userId, postImg, caption }) => {
  const [showCaption, setShowCaption] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const commentRef = useRef(null);
  const [likesAtom, setLikesAtom] = useRecoilState(likesState);
  const [open, setOpen] = useRecoilState(modalState);
  const [emojiPicker, setEmojiPicker] = useState(false);

  //get Comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => setComments(snapshot.docs)
    );

    return () => {
      unsubscribe();
    };
  }, [db, id]);

  //get Likes
  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db, id]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  const likePost = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
      } else {
        await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
          username: session.user.username,
          userImage: session.user.image,
          name: session.user.name,
        });
      }
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    const commentToPost = commentRef.current.value.trim();
    commentRef.current.value = '';
    if (commentToPost !== '') {
      await addDoc(collection(db, 'posts', id, 'comments'), {
        username: session.user.username,
        userImage: session.user.image,
        timestamp: serverTimestamp(),
        comment: commentToPost,
      });
    }
  };

  const handleEmojiClick = (emojiData, event) => {
    commentRef.current.value = commentRef.current.value + emojiData.emoji;
  };

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* post header */}
      <div className="flex items-center p-3 sm:p-5 ">
        <div className="relative h-11 w-11 sm:h-12 sm:w-12 mr-3">
          <Image
            fill
            className="rounded-full border object-contain  p-[1.5px]"
            src={userImg}
            alt="user profile picture"
          />
        </div>
        <p className="flex-1 font-bold text-sm sm:text-base">{username}</p>

        {session && (
          <div className="flex items-center">
            <MenuComponent
              MenuBtnIcon={EllipsisHorizontalIcon}
              postDetails={{
                userId: userId,
                postId: id,
                postImage: postImg,
                caption: caption,
              }}
              BtnPanel={[
                {
                  title: 'Add to favourites',
                  icon: StarIcon,
                },
                {
                  title: 'Delete post',
                  icon: TrashIcon,
                  class: 'delete',
                },
                { title: 'Unfollow', icon: UserMinusIcon, class: 'unfollow' },
              ]}
            />
          </div>
        )}
      </div>

      {/* post image */}
      {postImg && (
        <div
          onDoubleClick={likePost}
          className="w-full relative cursor-pointer select-none"
        >
          <img
            src={postImg}
            className="object-cover w-full select-none"
            alt="post-image"
          />

          <div
            className={`${
              hasLiked && 'delay-1000 opacity-0'
            } transition-all duration-300 ease-out absolute inset-0 flex items-center justify-center select-none`}
          >
            <HeartIconFilled
              className={` ${
                hasLiked
                  ? 'scale-100 duration-300'
                  : 'delay-300 duration-500 opacity-100 scale-0'
              } transition-all  ease-out text-red-500 text-opacity-80 w-24 select-none`}
            />
          </div>
        </div>
      )}

      {/* buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-3 sm:pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="postBtn text-red-500"
              />
            ) : (
              <HeartIcon onClick={likePost} className="postBtn" />
            )}
            <ChatBubbleOvalLeftEllipsisIcon
              onClick={() => commentRef.current.focus()}
              className="postBtn"
            />
            <PaperAirplaneIcon className="postBtn -rotate-45" />
          </div>

          <BookmarkIcon className="postBtn" />
        </div>
      )}

      {/* caption */}
      <div className="p-4 sm:p-5 flex flex-col ">
        {likes.length > 0 && (
          <p
            className="font-bold w-fit mb-1 cursor-pointer hover:underline"
            onClick={() => {
              setLikesAtom({ ...likesAtom, postId: id, type: 'post' });
              setOpen({ open: true, type: 'likes' });
            }}
          >
            {likes.length} {likes.length > 1 ? 'likes' : 'like'}
          </p>
        )}
        <p className="text-sm sm:text-base">
          <span className="font-bold mr-1">{username}</span>
          {showCaption ? caption : caption.slice(0, 35)}
          {showCaption || (caption.slice(35).length > 0 && '...')}
          {caption.slice(35).length > 0 && (
            <span
              className={`${
                showCaption && 'hidden'
              } underline cursor-pointer text-gray-600 ml-1`}
              onClick={() => setShowCaption(true)}
            >
              more
            </span>
          )}
        </p>
      </div>

      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-5 sm:ml-10 h-fit max-h-28 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              username={username}
              postId={id}
              comment={comment}
            />
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <>
          <form className="flex items-center p-4">
            <FaceSmileIcon
              className="h-6 sm:h-7 cursor-pointer hover:scale-110 transition-all duration-200 ease-out"
              onClick={() => setEmojiPicker(!emojiPicker)}
            />
            <input
              type="text"
              placeholder="Add a comment..."
              ref={commentRef}
              className="flex-1 text-sm sm:text-base border-0 focus:ring-0 outline-none"
            />
            <button
              type="submit"
              onClick={sendComment}
              className="font-semibold text-blue-400"
            >
              Post
            </button>
          </form>
          {emojiPicker && (
            <div className="relative w-full">
              <div className="absolute z-50 w-[60%] sm:w-[50%] -top-2 left-2">
                <EmojiContainer handleEmojiClick={handleEmojiClick} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Post;

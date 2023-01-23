import {
  EllipsisHorizontalIcon,
  HeartIcon,
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
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import Moment from 'react-moment';

const Post = ({ id, username, userImg, postImg, caption }) => {
  const [showCaption, setShowCaption] = useState(false);
  const [comments, setComments] = useState([]);
  const { data: session } = useSession();
  const commentRef = useRef(null);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (Snapshot) => setComments(Snapshot.docs)
    );
  }, [db]);

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToPost = commentRef.current.value;
    commentRef.current.value = '';

    await addDoc(collection(db, 'posts', id, 'comments'), {
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
      comment: commentToPost,
    });
  };
  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* post header */}
      <div className="flex items-center p-3 sm:p-5 ">
        <div className="relative h-11 w-11 sm:h-12 sm:w-12 mr-3">
          <Image
            layout="fill"
            className="rounded-full border object-contain  p-[1.5px]"
            src={userImg}
            alt="user profile picture"
          />
        </div>
        <p className="flex-1 font-bold text-sm sm:text-base">{username}</p>
        <EllipsisHorizontalIcon className="h-5" />
      </div>

      {/* post image */}
      {postImg && (
        <img src={postImg} className="object-cover w-full" alt="post-image" />
      )}

      {/* buttons */}
      {session && (
        <div className="flex  justify-between px-4 pt-3 sm:pt-4">
          <div className="flex space-x-4">
            <HeartIcon className="postBtn" />
            <ChatBubbleOvalLeftEllipsisIcon className="postBtn" />
            <PaperAirplaneIcon className="postBtn -rotate-45" />
          </div>

          <BookmarkIcon className="postBtn" />
        </div>
      )}

      {/* caption */}
      <div className="p-4 sm:p-5 flex items-center">
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
        <div className="ml-5 sm:ml-10 h-fit max-h-24 overflow-y-scroll scrollbar-thin scrollbar-thumb-black">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img
                src={comment.data().userImage}
                alt="user profile picture"
                className="w-7 h-7 rounded-full"
              />
              <p className="text-sm flex-1 whitespace-pre-line">
                <span className="font-bold mr-1 sm:mr-2">
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>

              <Moment fromNow className="pr-3 sm:pr-5 text-xs text-gray-500">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <form className="flex items-center p-4">
          <FaceSmileIcon className="h-6 sm:h-7" />
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
      )}
    </div>
  );
};

export default Post;

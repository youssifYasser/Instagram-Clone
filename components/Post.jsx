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
import { useState } from 'react';

const Post = ({ username, userImg, postImg, caption }) => {
  const [showCaption, setShowCaption] = useState(false);
  const { data: session } = useSession();
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

      {/* input box */}
      {session && (
        <div className="flex items-center p-4">
          <FaceSmileIcon className="h-6 sm:h-7" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm sm:text-base border-0 focus:ring-0 outline-none"
          />
          <button className="font-semibold text-blue-400">Post</button>
        </div>
      )}
    </div>
  );
};

export default Post;

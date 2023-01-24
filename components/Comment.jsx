import Image from 'next/image';
import React, { useState } from 'react';
import Moment from 'react-moment';

const Comment = ({ username, comment }) => {
  const [showComment, setShowComment] = useState(false);

  return (
    <div className="flex items-center space-x-2 mb-3">
      <Image
        width={30}
        height={30}
        src={comment.data().userImage}
        alt="user profile picture"
        className="rounded-full object-contain"
      />
      <p className="text-sm sm:text-base flex-1">
        <span className="font-bold mr-1">{username}</span>
        {showComment
          ? comment.data().comment
          : comment.data().comment.slice(0, 25)}
        {showComment || (comment.data().comment.slice(25).length > 0 && '...')}
        {comment.data().comment.slice(25).length > 0 && (
          <span
            className={`${
              showComment && 'hidden'
            } underline cursor-pointer text-gray-600 ml-1`}
            onClick={() => setShowComment(true)}
          >
            more
          </span>
        )}
      </p>

      <Moment fromNow className="pr-3 sm:pr-5 text-xs text-gray-500">
        {comment.data().timestamp?.toDate()}
      </Moment>
    </div>
  );
};

export default Comment;

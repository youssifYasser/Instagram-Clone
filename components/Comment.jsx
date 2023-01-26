import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { db } from '../firebase';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid';
import { likesState } from '../atoms/likesAtom';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';

const Comment = ({ username, postId, comment }) => {
  const { data: session } = useSession();
  const [showComment, setShowComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likesAtom, setLikesAtom] = useRecoilState(likesState);
  const [open, setOpen] = useRecoilState(modalState);

  useEffect(() => {
    onSnapshot(
      collection(db, 'posts', postId, 'comments', comment.id, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, postId, comment.id]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  const likeComment = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(
          db,
          'posts',
          postId,
          'comments',
          comment.id,
          'likes',
          session.user.uid
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          'posts',
          postId,
          'comments',
          comment.id,
          'likes',
          session.user.uid
        ),
        {
          username: session.user.username,
          userImage: session.user.image,
          name: session.user.name,
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-3 pr-5">
      <div>
        <Image
          width={30}
          height={30}
          src={comment.data().userImage}
          alt="user profile picture"
          className="rounded-full object-contain"
        />
      </div>
      <div className="flex-1">
        <div>
          <p className="text-sm sm:text-base flex-1">
            <span className="font-bold mr-1">{username}</span>
            {showComment
              ? comment.data().comment
              : comment.data().comment.slice(0, 25)}
            {showComment ||
              (comment.data().comment.slice(25).length > 0 && '...')}
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
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <Moment fromNow>{comment.data().timestamp?.toDate()}</Moment>
          {likes.length > 0 && (
            <p
              className="cursor-pointer hover:underline"
              onClick={() => {
                setLikesAtom({
                  ...likesAtom,
                  postId: postId,
                  commentId: comment.id,
                  type: 'comment',
                });

                setOpen({ open: true, type: 'likes' });
              }}
            >
              {likes.length} {likes.length > 1 ? 'likes' : 'like'}
            </p>
          )}
        </div>
      </div>
      {session && (
        <div>
          {hasLiked ? (
            <HeartIconFilled
              onClick={likeComment}
              className="postBtn h-3 text-red-500"
            />
          ) : (
            <HeartIcon onClick={likeComment} className="postBtn h-3" />
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;

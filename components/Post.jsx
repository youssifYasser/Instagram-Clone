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
import { Fragment, useEffect, useRef, useState } from 'react';
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
import { db, storage } from '../firebase';
import Comment from './Comment';
import { useRecoilState } from 'recoil';
import { likesState } from '../atoms/likesAtom';
import { likesModalState } from '../atoms/likesModalAtom';
import { Menu, Transition } from '@headlessui/react';
import { deleteObject, ref } from 'firebase/storage';
import { modalState } from '../atoms/modalAtom';
import { deletePostState } from '../atoms/deletePostAtom';

const Post = ({ id, username, userImg, userId, postImg, caption }) => {
  const [showCaption, setShowCaption] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const commentRef = useRef(null);
  const [likesAtom, setLikesAtom] = useRecoilState(likesState);
  const [likesOpen, setLikesOpen] = useRecoilState(likesModalState);
  const [open, setOpen] = useRecoilState(modalState);
  const [deletePostAtom, setDeletePostAtom] = useRecoilState(deletePostState);

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
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
        userImage: session.user.image,
        name: session.user.name,
      });
    }
  };

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

        {session && (
          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div className="flex items-center cursor-pointer">
                <Menu.Button>
                  <EllipsisHorizontalIcon className="h-5" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-50 absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setDeletePostAtom({
                              postId: id,
                              postImage: postImg,
                              caption: caption,
                            });
                            setOpen({ open: true, type: 'delete' });
                          }}
                          disabled={session.user.uid !== userId}
                          className={`${
                            active && 'bg-gray-200 text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm sm:text-base disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed`}
                        >
                          Delete Post
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </div>

      {/* post image */}
      {postImg && (
        <div
          onDoubleClick={likePost}
          className="w-full relative cursor-pointer select-none"
        >
          <img src={postImg} className="object-cover w-full" alt="post-image" />

          <div
            className={`${
              hasLiked && 'delay-1000 scale-0'
            } transition-all duration-300 ease-out absolute inset-0 flex items-center justify-center`}
          >
            <HeartIconFilled
              className={` ${
                hasLiked ? 'scale-100' : 'hidden'
              } transition-all duration-300 ease-out text-gray-400 text-opacity-90 w-16 sm:w-20`}
            />
          </div>
        </div>
      )}

      {/* buttons */}
      {session && (
        <div className="flex  justify-between px-4 pt-3 sm:pt-4">
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
              setLikesOpen(true);
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
        <div className="ml-5 sm:ml-10 h-fit max-h-28 overflow-y-scroll scrollbar-thin scrollbar-thumb-black">
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

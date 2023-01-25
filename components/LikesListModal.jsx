import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { collection, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { likesState } from '../atoms/likesAtom';
import { likesModalState } from '../atoms/likesModalAtom';
import { db } from '../firebase';

const LikesListModal = () => {
  const likesAtom = useRecoilValue(likesState);
  const [likesOpen, setLikesOpen] = useRecoilState(likesModalState);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    if (likesAtom.type === 'post') {
      onSnapshot(
        collection(db, 'posts', likesAtom.postId, 'likes'),
        (snapshot) => {
          setLikes(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      );
    } else if (likesAtom.type === 'comment') {
      onSnapshot(
        collection(
          db,
          'posts',
          likesAtom.postId,
          'comments',
          likesAtom.commentId,
          'likes'
        ),
        (snapshot) => {
          setLikes(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      );
    }
  }, [likesAtom]);

  return (
    <div>
      {likesOpen && (
        <>
          <Transition appear show={likesOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setLikesOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center  text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="flex overflow-y-auto flex-col w-[90%] max-w-md transform rounded-2xl bg-white transition-all">
                      <div className="p-2 border-b border-gray-300 text-center">
                        <Dialog.Title
                          as="h3"
                          className="flex pr-2 items-center text-base font-medium leading-6 text-gray-900"
                        >
                          <span className="flex-1">Likes</span>
                          <XMarkIcon
                            className="cursor-pointer w-5"
                            onClick={() => setLikesOpen(false)}
                          />
                        </Dialog.Title>
                      </div>
                      {likes.map((likeRow) => (
                        <div key={likeRow.id} className="flex items-center p-4">
                          <div className="flex-1 flex items-center space-x-3">
                            <div>
                              <Image
                                src={likeRow.userImage}
                                alt="user image"
                                width={40}
                                height={40}
                                className="object-contain rounded-full"
                              />
                            </div>
                            <div className="flex flex-col items-start">
                              <h3 className="font-medium">
                                {likeRow.username}
                              </h3>
                              <h4 className="text-sm text-gray-500">
                                {likeRow.name}
                              </h4>
                            </div>
                          </div>
                          <div>
                            <button className="text-white px-3 py-1 bg-blue-600 font-medium rounded-lg">
                              Follow
                            </button>
                          </div>
                        </div>
                      ))}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      )}
    </div>
  );
};

export default LikesListModal;

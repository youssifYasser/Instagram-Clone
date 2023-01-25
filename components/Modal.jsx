import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useSession } from 'next-auth/react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { deletePostState } from '../atoms/deletePostAtom';
import Image from 'next/image';
import { likesState } from '../atoms/likesAtom';

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [deletePostAtom, setDeletePostAtom] = useRecoilState(deletePostState);
  const [likesAtom, setLikesAtom] = useRecoilState(likesState);
  const [likes, setLikes] = useState([]);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open.type === 'create') {
      setDeletePostAtom({ caption: '', postId: '', postImage: '' });
      setLikesAtom({ postId: '', commentId: '', type: '' });
    }
  }, [open]);

  useEffect(() => {
    if (open.type === 'likes') {
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
    }
  }, [likesAtom]);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedImage(readerEvent.target.result);
    };
  };

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    await addDoc(collection(db, 'posts'), {
      userId: session.user.uid,
      username: session.user.username,
      profileImage: session.user.image,
      caption: captionRef.current.value,
      timestamp: serverTimestamp(),
    }).then(async (document) => {
      const imageRef = ref(storage, `posts/${document.id}/image`);
      await uploadString(imageRef, selectedImage, 'data_url').then(
        async (Snapshot) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, 'posts', document.id), {
            postImage: downloadURL,
          });
        }
      );
    });

    setOpen({ open: false, type: '' });
    setLoading(false);
    setSelectedImage(null);
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', deletePostAtom.postId));
    const imageRef = ref(storage, `posts/${deletePostAtom.postId}/image`);
    await deleteObject(imageRef);
    setDeletePostAtom({ postId: '', postImage: '', caption: '' });
    setOpen({ open: false, type: '' });
  };

  return (
    <div>
      {open.open && (
        <>
          <Transition appear show={open.open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => setOpen({ open: false, type: '' })}
            >
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
                    <Dialog.Panel className="flex flex-col w-[90%] max-w-md transform rounded-2xl bg-white transition-all">
                      <div className="p-2 border-b border-gray-300 text-center">
                        <Dialog.Title
                          as="h3"
                          className={`${
                            open.type === 'likes' && 'flex pr-2 items-center '
                          } text-base font-medium leading-6 text-gray-900`}
                        >
                          {open.type === 'create' ? (
                            'Create new post'
                          ) : open.type === 'delete' ? (
                            'Delete post'
                          ) : (
                            <>
                              <span className="flex-1">Likes</span>
                              <XMarkIcon
                                className="cursor-pointer w-5"
                                onClick={() =>
                                  setOpen({ open: false, type: '' })
                                }
                              />
                            </>
                          )}
                        </Dialog.Title>
                      </div>
                      {open.type === 'likes' ? (
                        <>
                          {likes.map((likeRow) => (
                            <div
                              key={likeRow.id}
                              className="flex items-center p-4"
                            >
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
                        </>
                      ) : (
                        <div className="p-3 sm:p-5">
                          {selectedImage ? (
                            <div className="filter hover:brightness-90 transition-all duration-150">
                              <img
                                src={selectedImage}
                                alt="post image"
                                className="w-full object-contain"
                              />
                              {!loading && (
                                <p
                                  onClick={() => setSelectedImage(null)}
                                  className="text-red-600 font-medium cursor-pointer "
                                >
                                  Remove
                                </p>
                              )}
                            </div>
                          ) : deletePostAtom.postImage ? (
                            <img
                              src={deletePostAtom.postImage}
                              alt="post image"
                              className="w-full object-contain"
                            />
                          ) : (
                            <>
                              <div
                                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                                onClick={() => filePickerRef.current.click()}
                              >
                                <CameraIcon
                                  className="h-6 w-6 text-red-600"
                                  aria-hidden="true"
                                />
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={filePickerRef}
                                  onChange={addImageToPost}
                                  hidden
                                />
                              </div>
                            </>
                          )}

                          <div className="mt-4">
                            {deletePostAtom.postImage ? (
                              <input
                                type="text"
                                value={deletePostAtom.caption}
                                disabled
                                className="border-none focus:ring-0 w-full text-center"
                                placeholder="caption"
                              />
                            ) : (
                              <input
                                type="text"
                                ref={captionRef}
                                className="border-none focus:ring-0 w-full text-center"
                                placeholder="Write a caption"
                              />
                            )}
                          </div>

                          <div className="mt-4">
                            {deletePostAtom.postImage ? (
                              <button
                                onClick={deletePost}
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base sm:text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                              >
                                Delete Post
                              </button>
                            ) : (
                              <button
                                onClick={uploadPost}
                                disabled={!selectedImage || loading}
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base sm:text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 "
                              >
                                {loading ? 'Uploading...' : 'Create Post'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
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

export default Modal;

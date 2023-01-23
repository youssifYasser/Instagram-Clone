import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Fragment, useRef, useState } from 'react';
import { Snapshot, useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useSession } from 'next-auth/react';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const CreatePostModal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);

  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setOpen(false);
    setLoading(false);
    setSelectedImage(null);
  };

  return (
    <div>
      {open && (
        <>
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
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
                          className="text-base font-medium leading-6 text-gray-900"
                        >
                          Create new post
                        </Dialog.Title>
                      </div>
                      <div className="p-3 sm:p-5">
                        {selectedImage ? (
                          <div className="filter hover:brightness-90 transition-all duration-150">
                            <img
                              src={selectedImage}
                              alt="post image"
                              classname="w-full object-contain"
                            />
                            <p
                              onClick={() => setSelectedImage(null)}
                              className="text-red-600 font-medium cursor-pointer "
                            >
                              Remove
                            </p>
                          </div>
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
                                ref={filePickerRef}
                                onChange={addImageToPost}
                                hidden
                              />
                            </div>
                          </>
                        )}

                        <div className="mt-4">
                          <input
                            type="text"
                            ref={captionRef}
                            className="border-none focus:ring-0 w-full text-center"
                            placeholder="Write a caption"
                          />
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={uploadPost}
                            disabled={!selectedImage}
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base sm:text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 "
                          >
                            {loading ? 'Uploading...' : 'Create Post'}
                          </button>
                        </div>
                      </div>
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

export default CreatePostModal;

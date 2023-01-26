import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Fragment } from 'react';
import { useRecoilState } from 'recoil';
import { deletePostState } from '../atoms/deletePostAtom';
import { modalState } from '../atoms/modalAtom';

const MenuComponent = ({
  menuBtnImage,
  MenuBtnIcon,
  postDetails,
  BtnPanel,
}) => {
  const [open, setOpen] = useRecoilState(modalState);
  const [deletePostAtom, setDeletePostAtom] = useRecoilState(deletePostState);
  const { data: session } = useSession();

  const handleMenuButtons = (type) => {
    switch (type) {
      case 'logout':
        signOut({ callbackUrl: '/' });
        break;
      case 'add':
        setOpen({ open: true, type: 'create' });
        break;
      case 'delete':
        setDeletePostAtom({
          postId: postDetails.postId,
          postImage: postDetails.postImage,
          caption: postDetails.caption,
        });
        setOpen({ open: true, type: 'delete' });
        break;
    }
  };

  return (
    <Menu as="div" className="inline-block relative text-left">
      <div className="flex items-center cursor-pointer">
        <Menu.Button>
          {menuBtnImage ? (
            <div className="flex items-center">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 cursor-pointer active:scale-95 filter active:brightness-75 ui-open:ring-2 ui-open:ring-black ui-open:rounded-full transition-all duration-150">
                <Image
                  src={menuBtnImage.img}
                  fill
                  alt="profile pic"
                  className="rounded-full p-[1.5px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center cursor-pointer">
              <MenuBtnIcon className="h-6" aria-hidden="true" />
            </div>
          )}
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
        <Menu.Items className="absolute right-0 z-50 mt-3 w-52 sm:w-56 origin-top-right rounded-lg py-2 bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div>
            {menuBtnImage && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${
                      active && 'bg-gray-100 text-gray-900'
                    } group flex items-center p-2 space-x-3  cursor-default`}
                  >
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                      <Image
                        fill
                        src={menuBtnImage.img}
                        alt="profile pic"
                        className="rounded-full object-contain"
                      />
                    </div>

                    <p className="text-sm sm:text-base font-medium">
                      {menuBtnImage.username}
                    </p>
                  </div>
                )}
              </Menu.Item>
            )}
            {BtnPanel.map((btn, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    onClick={() => handleMenuButtons(btn.class)}
                    className={`${
                      btn.class === 'delete' &&
                      session.user.uid !== postDetails.userId &&
                      'hidden'
                    }
                    ${
                      btn.class === 'unfollow' &&
                      session.user.uid === postDetails.userId &&
                      'hidden'
                    }
                    ${menuBtnImage && btn.class !== 'logout' && 'md:hidden'} 
                    ${active && 'bg-gray-100 text-gray-900'} 
                     
                 group flex items-center p-2 space-x-3  cursor-pointer`}
                  >
                    <div
                      className={`${MenuBtnIcon && session}
                       ${active ? 'bg-gray-300' : 'bg-gray-200'} ${
                        btn.class === 'msg' && 'relative'
                      } p-2 rounded-full`}
                    >
                      <div>
                        <btn.icon
                          className={`${
                            btn.class === 'msg' && '-rotate-45'
                          } h-5 sm:h-6 group-hover:scale-105 transition-transform duration-150`}
                        />
                        {btn.class === 'msg' && (
                          <div className="absolute bg-red-500 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white -top-1 -right-1 animate-pulse">
                            3
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-medium">
                      {btn.title}
                    </p>
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuComponent;

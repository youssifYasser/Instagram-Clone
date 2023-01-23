import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Fragment } from 'react';

const PopverComponent = ({ menuBtn, BtnPanel }) => {
  return (
    <Menu as="div" className="inline-block relative text-left">
      <div>
        <Menu.Button className="relative w-10 h-10 sm:w-12 sm:h-12 cursor-pointer active:scale-95 filter active:brightness-75 ui-open:ring-2 ui-open:ring-black ui-open:rounded-full transition-all duration-150">
          <Image
            src={menuBtn}
            layout="fill"
            alt="profile pic"
            className="rounded-full p-[1.5px] object-contain"
          />
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
        <Menu.Items className="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-200">
            {BtnPanel.map((btn, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    onClick={() =>
                      btn.class === 'logout' && signOut({ callbackUrl: '/' })
                    }
                    className={`${
                      btn.class === 'img' ||
                      btn.class === 'logout' ||
                      'md:hidden'
                    } ${active && 'bg-gray-100 text-gray-900'} ${
                      index === 0 && 'rounded-t-lg'
                    } ${
                      index === BtnPanel.length - 1 && 'rounded-b-lg'
                    } group flex items-center p-3 space-x-3  cursor-pointer`}
                  >
                    {btn.class === 'img' ? (
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                        <Image
                          layout="fill"
                          src={btn.image}
                          alt={btn.alt}
                          className="rounded-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className={` ${
                          active ? 'bg-gray-300' : 'bg-gray-200'
                        } ${
                          btn.class === 'msg' && 'relative'
                        } p-2 rounded-full`}
                      >
                        <div>
                          <btn.icon
                            className={`${
                              btn.class === 'msg' && '-rotate-45'
                            } h-6 sm:h-6 group-hover:scale-105 transition-transform duration-150`}
                          />
                          {btn.class === 'msg' && (
                            <div className="absolute bg-red-500 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white -top-1 -right-1 animate-pulse">
                              3
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

export default PopverComponent;

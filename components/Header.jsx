import Image from 'next/image';
import Link from 'next/link';
import textLogo from '../public/insta-logo-text.png';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/20/solid';
import MenuComponent from './Menu';
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modalAtom';

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);

  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-md">
      <div className="flex justify-between items-center max-w-6xl p-3 md:py-4 mx-auto">
        {/* left */}
        <Link href="/">
          <div className="w-20 sm:w-28 lg:w-32 cursor-pointer">
            <Image
              src={textLogo}
              alt="instagram logo"
              className="object-contain"
            />
          </div>
        </Link>

        {/* center */}
        <div
          className={`${
            session || 'hidden sm:inline-flex'
          } w-48 md:w-64 lg:w-72`}
        >
          <div className="relative py-1 px-2 rounded-md">
            <div className="absolute inset-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 pl-8 sm:pl-10 block w-full text-sm md:text-base rounded-md border-gray-300 focus:ring-black focus:border-black"
              placeholder="Search"
            />
          </div>
        </div>

        {/* right */}
        <div className="flex items-center space-x-2 sm:space-x-5">
          <Link href="/">
            <HomeIcon className="navBtn" />
          </Link>

          {session ? (
            <>
              <div className="relative navBtn">
                <PaperAirplaneIcon className="navBtn -rotate-45" />
                <div className="absolute bg-red-500 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white -top-2 -right-2 animate-pulse">
                  3
                </div>
              </div>
              <PlusCircleIcon
                className="navBtn"
                onClick={() => setOpen({ open: true, type: 'create' })}
              />
              <StarIcon className="navBtn" />
              <MenuComponent
                menuBtnImage={{
                  img: session.user.image,
                  username: session.user.username,
                }}
                BtnPanel={[
                  {
                    title: 'Your Messages',
                    icon: PaperAirplaneIcon,
                    class: 'msg',
                  },
                  {
                    title: 'Create new post',
                    icon: PlusCircleIcon,
                    class: 'add',
                  },
                  { title: 'Favourites', icon: StarIcon },
                  {
                    title: 'Log out',
                    icon: ArrowRightOnRectangleIcon,
                    class: 'logout',
                  },
                ]}
              />
            </>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <button className="px-3 sm:px-5 py-1 text-sm sm:text-base whitespace-nowrap font-semibold text-center rounded-full border-2 border-black text-white bg-black hover:bg-opacity-90 active:bg-white active:text-black transition-colors duration-150 ">
                  Sign In
                </button>
              </Link>
              <div className="bg-gray-300 text-gray-900 p-1 sm:p-2 rounded-full cursor-default">
                <UserIcon className="h-6" />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

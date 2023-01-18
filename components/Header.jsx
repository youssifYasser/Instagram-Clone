import Image from 'next/image';
import Link from 'next/link';
import textLogo from '../public/insta-logo-text.png';
import iconLogo from '../public/insta-logo-icon.png';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  Bars3Icon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/20/solid';

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-md">
      <div className="flex justify-between items-center max-w-6xl p-3 md:py-4 mx-auto">
        {/* left */}
        <Link href="/">
          <div className="hidden lg:inline-flex w-24 sm:w-28 lg:w-32 cursor-pointer">
            <Image
              src={textLogo}
              alt="instagram logo"
              className="object-contain"
            />
          </div>
          <div className="lg:hidden w-10 flex-shrink-0 cursor-pointer">
            <Image
              src={iconLogo}
              width={40}
              height={40}
              alt="instagram logo"
              className="object-contain"
            />
          </div>
        </Link>

        {/* center */}
        <div className="max-w-xs">
          <div className="relative py-1 px-2 rounded-md">
            <div className="absolute inset-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 pl-8 sm:pl-10 block w-full sm:text-sm rounded-md border-gray-300 focus:ring-black focus:border-black"
              placeholder="Search"
            />
          </div>
        </div>

        {/* right */}
      </div>
    </nav>
  );
};

export default Header;

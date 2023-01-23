import { signIn } from 'next-auth/react';
import Image from 'next/image';
import googleLogo from '../public/google_logo.png';
import instaLogo from '../public/headerIcon.png';

const SignIn = ({ provider }) => {
  return (
    <>
      {provider && (
        <div
          onClick={() => {
            signIn(provider.id, { callbackUrl: '/' });
          }}
          className={`flex space-x-4 mb-5 sm:space-x-5 items-center py-2 sm:py-3 px-6 sm:px-10 cursor-pointer border-2 rounded-lg 
            
            border-gray-700  text-gray-700 hover:text-gray-600 hover:border-gray-600  active:bg-gray-500 active:border-gray-500
            active:text-white transition-colors duration-200 ease-in-out`}
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11">
            <Image
              alt="google logo"
              layout="fill"
              objectFit="contain"
              src={provider.id === 'google' ? googleLogo : instaLogo}
            />
          </div>
          <h1 className="font-bold text-sm sm:text-lg">
            Sign in with {provider.name}
          </h1>
        </div>
      )}
    </>
  );
};

export default SignIn;

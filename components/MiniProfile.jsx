import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const MiniProfile = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex items-center justify-between space-x-4 ml-10 mt-14">
        <div className="relative w-14 h-14">
          <Image
            fill
            src={session.user.image}
            alt="profile picture"
            className="rounded-full border p-[1.5px]"
          />
        </div>

        <div className="flex-1">
          <h2 className="font-bold">{session.user.username}</h2>
          <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
        </div>

        <button
          onClick={() => signOut()}
          className="font-semibold text-sm text-blue-400"
        >
          Sign Out
        </button>
      </div>
    </>
  );
};

export default MiniProfile;

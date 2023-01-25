import { faker } from '@faker-js/faker';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Story from './Story';

const Stories = () => {
  const [profiles, setProfiles] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const profiles = [...Array(20)].map((_) => ({
      id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      avatar: faker.internet.avatar(),
    }));
    setProfiles(profiles);
  }, []);

  return (
    <div className="flex space-x-2 mt-7 border border-gray-200 bg-white p-6 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400">
      {session && (
        <div className="relative w-14 h-14 rounded-full">
          <Story avatar={session.user.image} />
          <div className="absolute bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-white bottom-[3px] right-[2.3px]">
            <PlusIcon className="text-white w-3 h-3" />
          </div>
        </div>
      )}
      {profiles.map((profile) => (
        <Story
          key={profile.id}
          username={profile.username}
          avatar={profile.avatar}
        />
      ))}
    </div>
  );
};

export default Stories;

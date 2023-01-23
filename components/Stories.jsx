import { faker } from '@faker-js/faker';
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
    <div className="flex space-x-2 mt-7 border border-gray-200 bg-white p-6 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {session && (
        <Story username={session.user.username} avatar={session.user.image} />
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

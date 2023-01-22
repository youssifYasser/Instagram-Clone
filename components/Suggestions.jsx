import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';

const Suggestions = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const profiles = [...Array(5)].map((_) => ({
      id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      avatar: faker.internet.avatar(),
      bio: faker.company.name(),
    }));

    setProfiles(profiles);
  }, []);
  return (
    <div className="ml-10 mt-4">
      <div className="flex justify-between mb-5 text-sm">
        <h3 className="text-gray-400 font-bold">suggestions for you</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>

      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between mt-3"
        >
          <img
            src={profile.avatar}
            alt="profile picture"
            className='"h-12 w-12 rounded-full border p-[1.5px]'
          />

          <div className="flex-1 mx-3">
            <h2 className="font-semibold text-sm">{profile.username}</h2>
            <h3 className="text-xs text-gray-400">Works at {profile.bio}</h3>
          </div>

          <button className="font-semibold text-xs text-blue-400">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;

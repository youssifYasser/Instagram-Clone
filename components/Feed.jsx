import { useSession } from 'next-auth/react';
import MiniProfile from './MiniProfile';
import Posts from './Posts';
import Stories from './Stories';
import Suggestions from './Suggestions';

const Feed = () => {
  const { data: session } = useSession();
  return (
    <div
      className={`grid grid-cols-1 max-w-lg  md:grid-cols-2 md:max-w-xl xl:grid-cols-3 xl:max-w-4xl mx-auto ${
        !session && '!grid-cols-1 !max-w-xl'
      } `}
    >
      <section className="col-span-2">
        {session && <Stories />}
        <Posts />
      </section>

      {session && (
        <section className="hidden xl:inline-grid md:col-span-1">
          <div className="fixed top-20">
            <MiniProfile />
            <Suggestions />
          </div>
        </section>
      )}
    </div>
  );
};

export default Feed;

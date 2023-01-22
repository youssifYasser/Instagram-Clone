import Posts from './Posts';
import Stories from './Stories';

const Feed = () => {
  return (
    <div className="grid grid-cols-1 max-w-lg  md:grid-cols-2 md:max-w-xl xl:grid-cols-3 xl:max-w-4xl mx-auto ">
      <section className="col-span-2">
        <Stories />
        <Posts />
      </section>

      <section>
        {/* MiniProfile */}
        {/* Suggestions */}
      </section>
    </div>
  );
};

export default Feed;

import Image from 'next/image';

const Story = ({ username, avatar }) => {
  return (
    <div className="cursor-pointer">
      <div className="relative h-14 w-14">
        <Image
          fill
          className={`rounded-full object-contain p-[1.5px] ${
            username &&
            ' border-2 border-red-500 hover:scale-105 transition-transform duration-200 ease-out'
          }`}
          src={avatar}
          alt="profile picture"
        />
      </div>
      <p className="text-xs w-14 truncate text-center">
        {username || 'Your story'}
      </p>
    </div>
  );
};

export default Story;

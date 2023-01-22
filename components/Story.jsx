const Story = ({ username, avatar }) => {
  return (
    <div className="cursor-pointer">
      <img
        className="h-14 w-14 rounded-full object-contain p-[1.5px] border-2 border-red-500 hover:scale-105 transition-transform duration-200 ease-out"
        src={avatar}
        alt="profile picture"
      />
      <p className="text-xs w-14 truncate text-center">{username}</p>
    </div>
  );
};

export default Story;

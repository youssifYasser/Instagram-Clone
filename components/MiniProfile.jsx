const MiniProfile = () => {
  return (
    <div className="flex items-center justify-between space-x-4 ml-10 mt-14">
      <img
        src="./profileTest.jpg"
        alt="profile picture"
        className="h-16 w-16 rounded-full border p-[1.5px]"
      />

      <div className="flex-1">
        <h2 className="font-bold">youssef___yasser</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button className="font-semibold text-sm text-blue-400">Sign Out</button>
    </div>
  );
};

export default MiniProfile;

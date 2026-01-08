const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;

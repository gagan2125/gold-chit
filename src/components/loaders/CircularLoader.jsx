import { useState, useEffect } from "react";

const CircularLoader = ({ seconds = 3 ,color="text-blue-600"}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="flex justify-center items-center ">
      {isLoading ? (
        // Loader spinner
        <div className={`animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent ${color} rounded-full`}></div>
      ) : (
        // No data message
        <div className="text-2xl font-bold text-black">No data found</div>
      )}
    </div>
  );
};

export default CircularLoader;

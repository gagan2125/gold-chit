import React from "react";
const data = [
  {
    title: "Edit",
  },
  {
    title: "Delete",
  },
];
const CustomContextMenu = ({isVisible,onClickHandler,position}) => {
   
    if(!isVisible) return null;
  return (
    <div className={`bg-white border-gray-200 border-[1px] w-24  top-0`}>
      {data.map((ele) => (
        <div className="text-gray-800 border-gray-100 border-[1px] hover:bg-gray-200" onClick={onClickHandler}>{ele.title}</div>
      ))}
    </div>
  );
};

export default CustomContextMenu;

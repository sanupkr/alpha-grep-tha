import React from "react";

const FolderTabs = ({ folders, activeTab, onTabChange }) => {
    console.log(folders,activeTab);
    return (
        <div className="tabs flex space-x-4 border-b mb-4">
          {folders.map((folder:any, index:any) => (
            <button
              key={folder?.name}
              className={`py-2 px-4 ${
                activeTab === index
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => onTabChange(index)}
            >
              {folder?.name}
            </button>
          ))}
        </div>
      );
} 

export default FolderTabs;
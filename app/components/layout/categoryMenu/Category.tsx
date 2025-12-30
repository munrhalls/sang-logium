import React from "react";

const Category = ({ category }) => {
  return (
    <div style={{ marginLeft: category.metadata.depth * 20 }}>
      <div className="flex items-center gap-2">
        {category.icon && <span>{category.icon}</span>}
        <span>{category.title}</span>
        <span className="text-xs text-gray-400">
          ({category.metadata.path})
        </span>
      </div>

      {category.children && category.children.length > 0 && (
        <div className="children-container">
          {/* Simple sorting/grouping visual headers can go here */}
          {category.children.map((child) => (
            <Category key={child._id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;

"use client";

import React from "react";

export const ClientComponent = () => {
  React.useEffect(() => {
    console.log("ClientComponent: mounted");
  }, []);
  return (
    <div
      className="w-full h-20 flex items-center justify-center bg-blue-500"
      onClick={() => console.log("ClientComponent: click")}>
      <p>Client</p>
    </div>
  );
};

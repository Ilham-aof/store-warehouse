import React, { Children } from "react";

export default function layout({ children }) {
  return (
    <main className="w-screen h-screen p-10 flex justify-center items-center bg-mauve-100">
      {children}
    </main>
  );
}

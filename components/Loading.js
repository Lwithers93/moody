import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <AiOutlineLoading className="fa-solid fa-spinner animate-spin text-4xl sm:text-5xl" />
    </div>
  );
}

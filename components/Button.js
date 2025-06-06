import { Fugaz_One, Poppins } from "next/font/google";
import React from "react";

const fugaz = Poppins({ subsets: ["latin"], weight: ["400"] });

export default function Button(props) {
  const { text, dark, full, clickHandler } = props;
  return (
    // Give button class depending on boolean dark prop
    <button
      onClick={clickHandler}
      className={
        "rounded-full overflow-hidden border-2 duration-200 hover:opacity-60 border border-solid border-green-600" +
        (dark ? " text-white bg-green-600 " : " text-green-600 ") +
        (full ? " grid place-items-center w-full " : "")
      }
    >
      <p
        className={`px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ${fugaz.className}`}
      >
        {text}
      </p>
    </button>
  );
}

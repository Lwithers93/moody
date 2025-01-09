"use client"; // Needs to be stateful - Can be a client component as does not affect SEO
import React, { useState } from "react";
import { baseRating, gradients } from "@/utils/index";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Fugaz_One, Poppins } from "next/font/google";

const fugaz = Poppins({ subsets: ["latin"], weight: ["400"] });

const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
const monthsArr = Object.keys(months);
const now = new Date();
const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Calendar(props) {
  const { demo, completeData, handleSetMood } = props;
  const now = new Date();
  const currMonth = now.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(
    Object.keys(months)[currMonth]
  );

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Get numeric month
  const numericMonth = Object.keys(months).indexOf(selectedMonth);
  // set equal to empty object if undefined
  const data = completeData?.[selectedYear]?.[numericMonth] || {};
  console.log(completeData?.[selectedYear]?.[selectedMonth]);

  function handleIncrementMonth(val) {
    // value +1 or -1
    // if we hit the bounds of the months we can hit the year that is displayed instead
    if (numericMonth + val < 0) {
      //set the month value = 11 and decrement year
      setSelectedYear((curr) => curr - 1);
      setSelectedMonth(monthsArr[11]);
    } else if (numericMonth + val > 11) {
      // set the month val = 0 and increment year
      setSelectedYear((curr) => curr + 1);
      setSelectedMonth(monthsArr[0]);
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }

  // Create month object based on above defined month and year
  const monthNow = new Date(
    selectedYear,
    Object.keys(months).indexOf(selectedMonth),
    1
  );
  // Get first day of month for Calendar start
  const firstDayOfMonth = monthNow.getDay();
  //Get days in month
  const daysInMonth = new Date(
    selectedYear,
    Object.keys(selectedMonth).indexOf(selectedMonth) + 1,
    0
  ).getDate();

  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        <button onClick={() => handleIncrementMonth(-1)} className="mr-auto">
          <IoIosArrowDropleftCircle className="text-center capitalized text-green-500 duration-200 hover:opacity-60 focus:opacity-60 text-xl sm:text-2xl md:text-3xl" />
        </button>
        <p
          className={
            "col-span-3 text-center capitalized textGradient text-xl sm:text-2xl md:text-3xl whitespace-nowrap " +
            fugaz.className
          }
        >
          {selectedMonth}, {selectedYear}
        </p>
        <button onClick={() => handleIncrementMonth(1)} className="ml-auto">
          <IoIosArrowDroprightCircle className="text-center capitalized text-green-500 duration-200 hover:opacity-60 focus:opacity-60 text-xl sm:text-2xl md:text-3xl" />
        </button>
      </div>
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:p-6 md:py-10">
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);

                let dayDisplay =
                  dayIndex > daysInMonth
                    ? false
                    : row === 0 && dayOfWeekIndex < firstDayOfMonth
                    ? false
                    : true;

                let isToday = dayIndex === now.getDate();

                if (!dayDisplay) {
                  return <div className="bg-white" key={dayOfWeekIndex}></div>;
                }

                // set colors
                let color = demo
                  ? gradients.green[baseRating[dayIndex]]
                  : dayIndex in data
                  ? gradients.green[data[dayIndex]]
                  : "white";

                return (
                  <div
                    key={dayOfWeekIndex}
                    style={{ background: color }}
                    className={
                      "text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg " +
                      (isToday ? " border-green-400 " : " border-green-100 ") +
                      (color === "white" ? " text-green-400 " : " text-white ")
                    }
                  >
                    <p>{dayIndex}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

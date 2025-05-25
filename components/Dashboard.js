"use client";
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import Loading from "./Loading";
import Login from "./Login";

const fugaz = { subsets: ["latin"], weight: ["400"] };

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});

  const now = new Date();

  function countValues() {
    // get statuses from user data
    let totalDays = 0;
    let sumMoods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let daysMood = data[year][month][day];
          totalDays++;
          sumMoods += daysMood;
        }
      }
    }
    return {
      num_days: totalDays,
      average_mood: (sumMoods / totalDays).toFixed(1),
    };
  }

  // Status bar
  const statuses = {
    ...countValues(),
    time_remaining_today: `${23 - now.getHours()}hrs ${
      60 - now.getMinutes()
    }mins`,
  };

  // must be async function to throw response to firebase
  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      // create replica of current data
      const newData = { ...userDataObj };
      // Check if no year exists
      if (!newData?.[year]) {
        newData[year] = {};
      }
      // Check if no month for current year
      if (!newData?.[year][month]) {
        newData[year][month] = {};
      }
      newData[year][month][day] = mood;
      // update current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          // dynamic variables in Object
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true } // Merge with current data in firebase
      );
      console.log("firebase updated successfully....");
    } catch (err) {
      console.log("failed to set data: ", err.message);
    }
  }

  const moods = {
    "&*@#$": "😭",
    Sad: "😒",
    Surviving: "😐",
    Good: "😊",
    Awesome: "😍",
  };

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return; // return out if now user data
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-green-50 text-green-500 rounded-lg p-4 gap-4">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate mx-auto ">
                {status.replaceAll("_", " ")}
              </p>
              <p
                className={`text-base sm:text-lg  mx-auto truncate ${fugaz.className}`}
              >
                {statuses[status] === "NaN" ? 0 : statuses[status]}
                {status === "num_days" ? "🔥" : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={`text-5xl sm:text-6xl md:text-7xl text-center ${fugaz.className}`}
      >
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              key={moodIndex}
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                console.log("current mood val: ", currentMoodValue);
                handleSetMood(currentMoodValue);
              }}
              className={
                "p-4 px-5 rounded-2xl purpleShadow duration-200 bg-green-50 hover:bg-green-100 text-center flex flex-col items-center gap-2 flex-1" +
                (moodIndex === 4 ? " col-span-2 sm:col-span-1" : "")
              }
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              <p
                className={
                  "text-green-500 text-xs sm:text-sm md:text-base " +
                  fugaz.className
                }
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}

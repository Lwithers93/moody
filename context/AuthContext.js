"use client";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "@firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataObj, setUserDataObj] = useState(null);
  const [loading, setLoading] = useState(true);

  // AUTH HANDLERS
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    // handle logout and clear current user data
    setUserDataObj(null);
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    // create listener to listen to auth state change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // Set the user to our local context state
        setLoading(true);
        setCurrentUser(user);
        if (!user) {
          console.log("No user found");
          return; // return if no user
        }
        // if user does exist, fetch data from firestore database
        console.log("fetching user data");
        const docRef = doc(db, "users", user.uid); // access user with corresponding unique ID from the 'users' collection in our firebase db
        // Get firebase data
        const docSnap = await getDoc(docRef);
        // init database object variable
        let firebaseData = {};
        // if retrieved data exists, assign it to object variable
        if (docSnap.exists()) {
          console.log("found user data"); // log to console
          firebaseData = docSnap.data();
        }
        setUserDataObj(firebaseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    logout,
    login,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

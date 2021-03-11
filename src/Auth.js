import React, { useState, useEffect, createContext } from "react";
import { auth, db } from "./base";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const doc = await (
            await db.collection("riders").doc(user.uid).get()
          ).data();
          setIsAdmin(doc.isAdmin);
        } catch (e) {
          console.log(e.message);
        }
      } else {
        setIsAdmin(false);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: [currentUser, setCurrentUser],
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

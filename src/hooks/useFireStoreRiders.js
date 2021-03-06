import { useState, useEffect } from "react";
import { db } from "../base";

const useFireStoreRiders = () => {
  const [online, setOnline] = useState([]);
  const [offline, setOffline] = useState([]);

  useEffect(() => {
    db.collection("riders")
      .where("online", "==", true)
      .orderBy("averageRiskLevel", "desc")
      .onSnapshot((snapshot) => {
        setOnline(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

    db.collection("riders")
      .where("online", "==", false)
      .orderBy("averageRiskLevel", "desc")
      .onSnapshot((snapshot) => {
        setOffline(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
  }, []);

  return { online, offline };
};

export default useFireStoreRiders;

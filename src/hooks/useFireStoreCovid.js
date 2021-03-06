import { useState, useEffect } from "react";
import { db } from "../base";

const useFireStoreCovid = () => {
  const [docs, setDocs] = useState([]);
  const [millis, setMillis] = useState();
  useEffect(() => {
    const startTime = new Date();
    db.collection("covid")
      .orderBy("name")
      .onSnapshot((snapshot) => {
        setDocs(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        const endTime = new Date();
        setMillis(Math.abs(startTime - endTime));
      });
  }, []);

  return { docs, millis };
};

export default useFireStoreCovid;

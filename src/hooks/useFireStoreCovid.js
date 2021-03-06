import { useState, useEffect } from "react";
import { db } from "../base";

const useFireStoreCovid = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    db.collection("covid")
      .orderBy("name")
      .onSnapshot((snapshot) => {
        setDocs(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
  }, []);

  return { docs };
};

export default useFireStoreCovid;

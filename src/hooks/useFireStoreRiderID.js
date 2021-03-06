import { useState, useEffect } from "react";
import { db } from "../base";

const useFireStoreRiderID = (id) => {
  const [rider, setRider] = useState([]);
  const [highestRisk, setHighesRisk] = useState(0);

  useEffect(() => {
    db.collection("riders")
      .doc(id)
      .collection("deliveries")
      .orderBy("riskPercentage", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        console.log("logging risk percentages...");
        const dtt = snapshot.docs.map((doc) => doc.data());
        setHighesRisk(dtt[0].riskPercentage);
        console.log(dtt[0].riskPercentage);
      });
    db.collection("riders")
      .doc(id)
      .onSnapshot((snapshot) => {
        setRider(snapshot.data());
      });
  }, [id]);

  return { rider, highestRisk };
};

export default useFireStoreRiderID;

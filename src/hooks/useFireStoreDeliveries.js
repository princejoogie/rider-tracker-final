import { useState, useEffect, useMemo } from "react";
import { db } from "../base";

const useFireStoreDeliveries = (id) => {
  const [deliveries, setDeliveries] = useState([]);
  const today = useMemo(() => new Date(), []);
  today.setDate(today.getDate() - 14);
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    let total = 0;
    if (deliveries.length <= 0) {
      db.collection("riders").doc(id).set(
        {
          averageRiskLevel: 0,
        },
        { merge: true }
      );
    } else {
      for (let i = 0; i < deliveries.length; i++)
        total += deliveries[i].riskPercentage;
      total = total / deliveries.length;
      db.collection("riders")
        .doc(id)
        .set(
          {
            averageRiskLevel: parseFloat(total.toFixed(2)),
          },
          { merge: true }
        );
    }
  }, [deliveries, id]);

  useEffect(() => {
    db.collection("riders")
      .doc(id)
      .collection("deliveries")
      .where("timeEnd", ">=", today)
      .orderBy("timeEnd", "desc")
      .onSnapshot((snapshot) => {
        setDeliveries(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
  }, [id, today]);

  return { deliveries };
};

export default useFireStoreDeliveries;

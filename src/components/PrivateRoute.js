import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth";
import { useHistory } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setAuthenticated(false);
      history.replace("/login");
    } else {
      setAuthenticated(true);
    }
  }, [isAdmin]);

  return authenticated ? children : <div>loading</div>;
}

export default PrivateRoute;

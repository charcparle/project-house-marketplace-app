import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true); // something similar to "loading"
  const auth = getAuth();
  useEffect(()=>{
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
      return unsub
  })

  return { loggedIn, checkingStatus };
};

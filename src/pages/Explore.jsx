import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
function Explore() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  useEffect(() => {
    // console.lßog(auth)
    if (auth.currentUser === null) {
      setIsSignedIn(false);
    } else {
      setIsSignedIn(true);
      setUser(auth.currentUser);
    }
  }, []);

  return (
    <div>
      <h2>Explore</h2>
      {isSignedIn && <h4> Welcome, {user.displayName}</h4>}
    </div>
  );
}

export default Explore;

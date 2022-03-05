import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {db} from "../firebase.config"
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import {toast} from "react-toastify"

function Profile() {
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const {name, email} = formData
  const [changeDetails, setChangeDetails] = useState(false)
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const handleSubmit = async () => {
    console.log("inside submit fn")
    try {
      if(auth.currentUser.displayName !== name) {
        // Update display name in db (auth)
        await updateProfile(auth.currentUser,{
          displayName: name
        })
        // Update firestore
        const userRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error("Could not update profile")
      console.log(error)
    }
  }
  const handleChange = (e) => {
    console.log(e.target)
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={()=>{
            changeDetails && handleSubmit()
            setChangeDetails((prev)=>(!prev))}}>
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={handleChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;

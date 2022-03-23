import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [changeDetails, setChangeDetails] = useState(false); // indicate whether user has entered the editing mode
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listingsArr = [];
      querySnap.forEach((doc) => {
        return listingsArr.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listingsArr);
      setListings(listingsArr);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const handleSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in db (auth)
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile");
      console.log(error);
    }
  };
  const handleChange = (e) => {
    // console.log(e.target)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleDelete = async (id,listingName) => {
    if (window.confirm(`Are you sure you want to delete this listing (${listingName})?`)) {
      await deleteDoc(doc(db, "listings", id));
      const updatedListings = listings.filter((listing) => listing.id !== id);
      setListings(updatedListings)
      toast.success(`Successfully deleted ${listingName}`)
      console.log(`delete listing ${listingName}`);
    }
  };

  const handleEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  if (loading) {
    return <Spinner />;
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
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && handleSubmit();
              setChangeDetails((prev) => !prev);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={handleChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent a home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map(({ data, id }) => (
                <ListingItem
                  listing={data}
                  id={id}
                  key={id}
                  onDelete={() => handleDelete(id,data.name)}
                  onEdit={()=>handleEdit(id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;

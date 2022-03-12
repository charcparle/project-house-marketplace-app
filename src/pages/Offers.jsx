import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listings");

        // Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc", limit(10))
        );

        // Execute the query
        const querySnap = await getDocs(q);
        // console.log(typeof querySnap);
        const listingsArr = [];
        querySnap.forEach((doc) => {
          return listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        console.log(listingsArr);
        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
        console.log(error);
      }
    };
    fetchListings();
  }, []);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        listings.map((listing) => (
          <ListingItem
            listing={listing.data}
            id={listing.id}
            key={listing.id}
            // onDelete={onDelete}
          />
        ))
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;

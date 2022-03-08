import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listings");

        // Create a query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
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
        console.log(listings)
      } catch (error) {
        toast.error("Could not fetch listings");
        console.log(error);
      }
    };
    fetchListings();
  }, [params.categoryName]);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : ((listings && listings.length > 0) ? (
        listings.map((listing)=>(<ListingItem listing={listing.data} id={listing.id} key={listing.id}/>))
      ) : (
        <p>No listings for {params.categoryName}</p>
      ))}
    </div>
  );
}

export default Category;

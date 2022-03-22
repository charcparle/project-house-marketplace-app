import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "./Spinner";
import {toast} from 'react-toastify'

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp",'desc'),limit(5));
        const querySnap = await getDocs(q);
        let listingsArr = [];
        querySnap.forEach((doc) => {
          return listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(()=>listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
        console.log(error);
      }
    };
    fetchListings()
  }, []);
  if (loading) {
      return <Spinner />
  }
  return listings && (<>
  <p className="exploreHeading"> Recommended</p>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        slidesPerView={1}
        scrollbar={{ draggable: true }}
      >
        {listings.map(({data,id}) => (
          <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
            <div key={id + "-div"} className="swiper-container">
              <div
                style={{
                  backgroundImage: `url(${data.imgUrls[0]})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              >
                  <p className="swiperSlideText">{data.name}</p>
                  <p className="swiperSlidePrice">${(data.discountedPrice??data.regularPrice).toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{''}{(data.type==='rent'&&' / Month')}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  </>);
}

export default Slider;

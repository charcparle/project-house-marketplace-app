import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {useAuthStatus} from '../hooks/useAuthStatus'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from "../components/Slider";
function Explore() {
  const {loggedIn} = useAuthStatus();
  const [user, setUser] = useState({});
  const auth = getAuth();
  
  useEffect(() => {
    // console.log(auth)
    if (loggedIn) {
      setUser(auth.currentUser);
    }
  },[loggedIn, auth]);

  // console.log(user)

  return (
      <div className='explore'>
      <header>
        <p className='pageHeader'>Explore</p>
      {loggedIn && (<h4> Welcome, {user.displayName}</h4>)}
      </header>

      <main>
        <Slider />

        <p className='exploreCategoryHeading'>Categories</p>
        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img
              src={rentCategoryImage}
              alt='rent'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for rent</p>
          </Link>
          <Link to='/category/sale'>
            <img
              src={sellCategoryImage}
              alt='sell'
              className='exploreCategoryImg'
            />
            <p className='exploreCategoryName'>Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;

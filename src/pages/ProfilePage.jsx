import { getAuth, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { HiArrowRightCircle } from "react-icons/hi2";
import ListingItem from '../components/ListingItem';
import "../styles/profilePage.css";
export default function ProfilePage() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onsubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        });
        toast.success('Profile details updated');
      }
      
    } catch (error) {
      toast.error("Could not update the profile details")
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingId) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updateListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updateListings)
      toast.success('Successfully deleted the listing');
    }
  }

  function onEdit(listingId) {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <>
      <section className="py-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-4xl text-center font-bold text-white mb-6">Profile & Settings</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
          <div className="md:w-[60%] lg:w-[50%] mb-12 md:mb-6 rounded-xl shadow-lg overflow-hidden">
            <img
              className="w-full rounded-xl hover:scale-105 transition-all duration-300"
              src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              alt="Profile"
            />
          </div>
          <div className="w-full md:w-[60%] lg:w-[40%] lg:ml-20 p-8 bg-white shadow-lg rounded-xl">
            <form>
              <input
                className="w-full mb-6 rounded-xl px-4 py-3 text-xl bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                type="email"
                id="email"
                value={email} disabled 
                placeholder="Email address"
              />

              <input
                className={`w-full mb-6 rounded-xl px-4 py-3 text-xl bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 ${changeDetail && "bg-gray-200"}`}
                id="name"
                value={name} 
                disabled={!changeDetail} 
                onChange={onChange}
                placeholder="Full name"
              />

              <div className="flex justify-between whitespace-nowrap text-sm sm:text-sm mb-6">
                <p>Do you want to change your name?
                  <span 
                    onClick={() => {
                        if (changeDetail) onsubmit();
                        setChangeDetail(prevState => !prevState);
                    }} 
                    className="text-blue-600 cursor-pointer hover:text-blue-700 transition duration-300 ease-in-out ml-3"
                  >
                    {changeDetail ? "Apply change" : "Update Account"}
                  </span>
                </p>
              </div>

              <button className="w-full bg-blue-600 text-white px-6 py-3 text-sm font-medium rounded-full shadow-md hover:bg-blue-700 transition duration-200 ease-in-out mb-6">
                <Link to='/sells' className="flex justify-center items-center">
                  <HiArrowRightCircle className="mr-2 text-3xl" />
                  Sell on Booking.com
                </Link>
              </button>

              <button onClick={onLogout} className="w-full bg-red-600 text-white px-6 py-3 text-sm font-medium rounded-full shadow-md hover:bg-red-700 transition duration-200 ease-in-out">
                Log out
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

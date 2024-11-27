import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";
import "../styles/HomePage.css";

export default function Home() {
  // Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Places for rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Places for sale
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <Slider />
      {/* Container tùy chỉnh bao quanh tất cả các section */}
      <div className="full-width-container">
        {offerListings && offerListings.length > 0 && (
          <div className="offers-section">
            <h1 className="mb-2 fw-bold fs-3">Offers</h1>
            <Link to="/explore" className="text-decoration-none">
              <p className="text-light mb-3">
                Promotions, deals, and special offers for you
              </p>
            </Link>
            <div className="row">
              {offerListings.map((listing) => (
                <div key={listing.id} className="col-6 col-lg-3 mb-3">
                  <ListingItem id={listing.id} listing={listing.data} />
                </div>
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="rent-section">
            <h2 className="mb-2 fw-bold fs-3">Places for Rent</h2>
            <Link to="/category/rent" className="text-decoration-none">
              <p className="text-light mb-3">Show more places for rent</p>
            </Link>
            <div className="row">
              {rentListings.map((listing) => (
                <div key={listing.id} className="col-6 col-lg-3 mb-3">
                  <ListingItem id={listing.id} listing={listing.data} />
                </div>
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="sale-section">
            <h2 className="mb-2 fw-bold fs-3">Places for Sale</h2>
            <Link to="/category/sale" className="text-decoration-none">
              <p className="text-light mb-3">Show more places for sale</p>
            </Link>
            <div className="row">
              {saleListings.map((listing) => (
                <div key={listing.id} className="col-6 col-lg-3 mb-3">
                  <ListingItem id={listing.id} listing={listing.data} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

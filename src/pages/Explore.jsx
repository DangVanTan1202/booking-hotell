import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import "animate.css";
import "../styles/Explore.css"; // Tạo file Explore.css riêng để kiểm soát các lớp CSS

export default function Explore() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listing");
      }
    }

    fetchListings();
  }, []);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  }

  return (
    <div className="full-width-container explore-container">
      <h1 className="explore-title animate__animated animate__fadeInDown">
        Discover the world at your own pace
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <div className="listings-grid">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="listing-item animate__animated animate__zoomIn"
                  style={{
                    animationDuration: `${Math.random() + 0.5}s`,
                  }}
                >
                  <div className="hover-card">
                    <ListingItem id={listing.id} listing={listing.data} />
                  </div>
                </div>
              ))}
            </div>
          </main>
          {lastFetchedListing && (
            <div className="load-more-button">
              <button
                onClick={onFetchMoreListings}
                className="btn btn-gradient shadow-lg"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="no-offers-text">There are no current offers</p>
      )}
    </div>
  );
}

import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "../styles/Listing.css";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopy, setShareLinkCopy] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
      } else {
        console.error("Listing does not exist!");
      }
      setLoading(false);
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  if (!listing) {
    return <p>Listing not found!</p>;
  }

  return (
    <div className="listing-page">
      <main>
        {/* Header Section with Background */}
        <div
          className="position-relative full-width-container"
          style={{
            background: "linear-gradient(135deg, #FF5722, #D32F2F)", // Gradient màu
            color: "white",
          }}
        >
          {/* Swiper for images */}
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            autoplay={{ delay: 3000 }}
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
          >
            {listing.imgUrls?.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="position-relative w-100 overflow-hidden"
                  style={{
                    height: "300px",
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div
            className="position-absolute top-0 end-0 mt-3 me-3 bg-white border border-secondary rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "50px", height: "50px", cursor: "pointer", zIndex: 10 }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShareLinkCopy(true);
              setTimeout(() => {
                setShareLinkCopy(false);
              }, 2000);
            }}
          >
            <FaShare className="text-secondary fs-5" />
          </div>
          {shareLinkCopy && (
            <p
              className="position-absolute top-0 end-0 mt-5 me-3 bg-white border border-secondary rounded px-3 py-2 fw-semibold"
              style={{ zIndex: 10 }}
            >
              Link Copied
            </p>
          )}

          {/* Listing Title and Address */}
          <div className="full-width-container py-4">
            <h1 className="text-white fw-bold">
              {listing.name} - $
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" ? " / month" : ""}
            </h1>
            <p className="d-flex align-items-center mt-3 mb-0 fw-semibold">
              <FaMapMarkerAlt className="text-success me-2" />
              {listing.address}
            </p>
          </div>
        </div>

        {/* Listing Details */}
        <div className="full-width-container my-4">
          <div className="row">
            {/* Left Section */}
            <div className="col-12 col-md-8">
              <div className="d-flex mb-3">
                <span className="badge bg-danger text-white me-2 p-2">
                  {listing.type === "rent" ? "Rent" : "Sale"}
                </span>
                {listing.offer && (
                  <span className="badge bg-success text-white p-2">
                    ${+listing.price - +listing.discountedPrice} discount
                  </span>
                )}
              </div>
              <p>
                <strong>Description -</strong> {listing.description}
              </p>
              <ul className="list-unstyled d-flex flex-wrap mt-3 mb-4">
                <li className="me-4">
                  <FaBed className="me-1" />
                  {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                </li>
                <li className="me-4">
                  <FaBath className="me-1" />
                  {+listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </li>
                <li className="me-4">
                  <FaParking className="me-1" />
                  {listing.parking ? "Parking Spot" : "No Parking"}
                </li>
                <li>
                  <FaChair className="me-1" />
                  {listing.furnished ? "Furnished" : "Not Furnished"}
                </li>
              </ul>
              {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                <button
                  onClick={() => setContactLandlord(true)}
                  className="btn btn-primary btn-lg w-100"
                >
                  Contact Landlord
                </button>
              )}
              {contactLandlord && (
                <Contact userRef={listing.userRef} listing={listing} />
              )}
            </div>

            {/* Right Section (Map) */}
            <div className="col-12 col-md-4">
              <div
                style={{ height: "300px", width: "100%" }}
                className="mt-4 mt-md-0"
              >
                <MapContainer
                  center={[listing.geolocation.lat, listing.geolocation.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      listing.geolocation.lat,
                      listing.geolocation.lng,
                    ]}
                  >
                    <Popup>{listing.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

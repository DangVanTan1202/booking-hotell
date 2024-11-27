import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "../styles/Slider.css";

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <Swiper
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      effect="fade"
      autoplay={{ delay: 3000 }}
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      className="slider-container"
    >
      {listings.map(({ data, id }) => (
        <SwiperSlide
          key={id}
          onClick={() => navigate(`/category/${data.type}/${id}`)}
        >
          <div
            style={{
              background: `url(${data.imgUrls[0]}) center no-repeat`,
              backgroundSize: "cover",
            }}
            className="slider-image"
          >
            {/* Title */}
            <p className="slider-title">{data.name}</p>

            {/* Price */}
            <p className="slider-price">
              ${data.discountedPrice ?? data.price}
              {data.type === "rent" && " / month"}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

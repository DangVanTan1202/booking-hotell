import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";


export default function UpdateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    price: 0,
    discountedPrice: 0,
    images: {},
  });

  const { name, type, bedrooms, bathrooms, address, description, price, discountedPrice, images, offer } = formData;
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData(docSnap.data());
      } else {
        toast.error("Listing does not exist");
        navigate("/");
      }
      setLoading(false);
    }
    fetchListing();
  }, [navigate, params.listingId]);

  const onChange = (e) => {
    let value = e.target.value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setFormData((prevState) => ({ ...prevState, [e.target.id]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (offer && discountedPrice >= price) {
      toast.error("Discounted price should be less than the regular price");
      setLoading(false);
      return;
    }

    const formDataCopy = { ...formData, timestamp: serverTimestamp() };
    delete formDataCopy.images;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);

    toast.success("Listing updated successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    setLoading(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container my-5">
      <div className="card shadow rounded">
        <div className="card-body">
          <h1 className="text-center mb-4">Update Listing</h1>
          <form onSubmit={onSubmit}>
            {/* Type Selector */}
            <div className="mb-4">
              <label className="form-label">Type</label>
              <div className="btn-group w-100">
                <button
                  type="button"
                  id="type"
                  value="sale"
                  onClick={onChange}
                  className={`btn ${type === "sale" ? "btn-primary" : "btn-outline-primary"}`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  id="type"
                  value="rent"
                  onClick={onChange}
                  className={`btn ${type === "rent" ? "btn-primary" : "btn-outline-primary"}`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-3">
              <label className="form-label">Property Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={onChange}
                className="form-control"
                placeholder="Enter property name"
                required
              />
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                id="address"
                value={address}
                onChange={onChange}
                className="form-control"
                rows="3"
                placeholder="Enter full address"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={onChange}
                className="form-control"
                rows="3"
                placeholder="Enter property description"
                required
              />
            </div>

            {/* Pricing */}
            <div className="mb-3">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>

            {/* Discounted Price */}
            {offer && (
              <div className="mb-3">
                <label className="form-label">Discounted Price</label>
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
            )}

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="offer"
                checked={offer}
                onChange={onChange}
                className="form-check-input"
              />
              <label htmlFor="offer" className="form-check-label">
                Offer Discount?
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-success w-100">
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

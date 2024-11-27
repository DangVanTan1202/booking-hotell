import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Sell.css";  


export default function Sell() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
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
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    price,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +price) {
      setLoading(false);
      toast.error("Discounted price needs to be less than digital list price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="container py-5">
      <h1 className="text-center mb-5">Start selling today</h1>
      <form onSubmit={onSubmit}>
        <p className="h4 mb-4">Sell / Rent</p>
        <div className="btn-group btn-group-toggle mb-4" data-toggle="buttons">
          <label
            className={`btn ${type === "rent" ? "btn-success" : "btn-danger"}`}
            onClick={() => setFormData({ ...formData, type: "rent" })}
          >
            <input type="radio" name="type" id="rent" autoComplete="off" />
            Rent
          </label>
          <label
            className={`btn ${type === "sale" ? "btn-success" : "btn-danger"}`}
            onClick={() => setFormData({ ...formData, type: "sale" })}
          >
            <input type="radio" name="type" id="sale" autoComplete="off" />
            Sell
          </label>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            maxLength={64}
            minLength="10"
            required
            className="form-control"
          />
        </div>

        <div className="row mb-4">
          <div className="col">
            <label htmlFor="bedrooms">Beds</label>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="form-control text-center"
            />
          </div>
          <div className="col">
            <label htmlFor="bathrooms">Baths</label>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="form-control text-center"
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Parking Spot</label>
          <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label
              className={`btn ${!parking ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, parking: false })}
            >
              <input type="radio" name="parking" value="false" />
              No
            </label>
            <label
              className={`btn ${parking ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, parking: true })}
            >
              <input type="radio" name="parking" value="true" />
              Yes
            </label>
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Furnished</label>
          <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label
              className={`btn ${!furnished ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, furnished: false })}
            >
              <input type="radio" name="furnished" value="false" />
              No
            </label>
            <label
              className={`btn ${furnished ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, furnished: true })}
            >
              <input type="radio" name="furnished" value="true" />
              Yes
            </label>
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={onChange}
            placeholder="Address"
            required
            className="form-control"
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={onChange}
            placeholder="Description"
            maxLength={500}
            required
            className="form-control"
          />
        </div>

        <div className="form-group mb-4">
          <label>Offer</label>
          <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
            <label
              className={`btn ${!offer ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, offer: false })}
            >
              <input type="radio" name="offer" value="false" />
              No
            </label>
            <label
              className={`btn ${offer ? "btn-success" : "btn-danger"}`}
              onClick={() => setFormData({ ...formData, offer: true })}
            >
              <input type="radio" name="offer" value="true" />
              Yes
            </label>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={onChange}
              min="50"
              max="750000000"
              required
              className="form-control"
            />
          </div>
          {offer && (
            <div className="col">
              <label htmlFor="discountedPrice">Discounted Price</label>
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onChange}
                min="50"
                max="750000000"
                required={offer}
                className="form-control"
              />
            </div>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="images">Images</label>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.jpeg,.png"
            multiple
            required
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            {loading ? "Uploading..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}

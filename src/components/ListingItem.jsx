import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import 'animate.css'; // Để sử dụng hiệu ứng động

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="list-group-item position-relative bg-light shadow-lg rounded mb-4 animate__animated animate__fadeInUp">
      {/* Link to the listing detail page */}
      <Link className="text-decoration-none" to={`/category/${listing.type}/${id}`}>
        {/* Hiển thị ảnh (có kiểm tra lỗi ảnh) */}
        {listing.imgUrls?.length > 0 ? (
          <img
            className="w-100 h-48 object-cover rounded-top"
            loading="lazy"
            src={listing.imgUrls[0]}
            alt={`${listing.name || 'Listing'} image`}
            style={{
              borderTopLeftRadius: "10px", // Bo góc của ảnh
              borderTopRightRadius: "10px", 
            }}
          />
        ) : (
          <div className="h-48 d-flex align-items-center justify-content-center bg-light text-muted rounded-top">
            No Image Available
          </div>
        )}

        {/* Hiển thị thời gian đăng */}
        {listing.timestamp?.toDate ? (
          <Moment
            className="position-absolute top-0 left-0 bg-danger text-white text-uppercase small font-weight-bold rounded px-2 py-1 shadow"
            fromNow
          >
            {listing.timestamp.toDate()}
          </Moment>
        ) : (
          <p className="position-absolute top-0 left-0 bg-secondary text-white text-uppercase small font-weight-bold rounded px-2 py-1 shadow">
            Unknown Time
          </p>
        )}

        {/* Hiển thị thông tin chi tiết */}
        <div className="p-4">
          {/* Địa chỉ */}
          <div className="d-flex align-items-center mb-3">
            <MdLocationOn className="h-5 w-5 text-success" />
            <p className="font-weight-semibold mb-0 text-truncate text-dark ms-2">
              {listing.address || 'Address not available'}
            </p>
          </div>

          {/* Tên listing */}
          <p className="font-weight-semibold mt-0 text-xl text-dark text-truncate">
            {listing.name || 'Unnamed Listing'}
          </p>

          {/* Giá */}
          <p className="text-muted mt-2 font-weight-semibold">
            <span className="text-danger">
              ${listing.offer
                ? listing.discountedPrice
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.price
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            {listing.type === 'rent' && ' / month'}
          </p>

          {/* Số phòng */}
          <div className="d-flex mt-3">
            {/* Số phòng ngủ */}
            <div className="d-flex align-items-center me-3">
              <p className="font-weight-bold text-xs">
                {listing.bedrooms
                  ? `${listing.bedrooms} ${listing.bedrooms > 1 ? 'Beds' : 'Bed'}`
                  : 'N/A'}
              </p>
            </div>
            {/* Số phòng tắm */}
            <div className="d-flex align-items-center">
              <p className="font-weight-bold text-xs">
                {listing.bathrooms
                  ? `${listing.bathrooms} ${listing.bathrooms > 1 ? 'Baths' : 'Bath'}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Xóa và sửa (nếu có props onDelete hoặc onEdit) */}
      {onDelete && (
        <FaTrash
          className="position-absolute bottom-3 end-3 h-20px cursor-pointer text-danger animate__animated animate__fadeIn"
          onClick={() => {
            console.log('Deleting listing:', id); // Debug
            onDelete(id);
          }}
        />
      )}
      {onEdit && (
        <MdEdit
        //  className="position-absolute bottom-3 end-8 h-20px cursor-pointer text-success animate__animated animate__fadeIn"
          onClick={() => {
            console.log('Editing listing:', id); // Debug
            onEdit(id);
          }}
        />
      )}
    </li>
  );
}

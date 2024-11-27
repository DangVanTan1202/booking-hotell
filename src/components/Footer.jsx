import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";  // Đảm bảo rằng bạn đã tạo file Footer.css như tôi đã chỉ dẫn

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Logo và mô tả */}
        <div className="footer-logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Booking.com_Logo.svg/1280px-Booking.com_Logo.svg.png"
            alt="logo"
          />
          <p>Find your perfect place anywhere!</p>
        </div>

        {/* Các liên kết */}
        <div className="footer-links">
          <a onClick={() => navigate("/")}>Home</a>
          <a onClick={() => navigate("/explore")}>Explore</a>
          <a onClick={() => navigate("/account")}>Account</a>
          <a onClick={() => navigate("/contact")}>Contact Us</a>
          <a onClick={() => navigate("/terms")}>Terms & Conditions</a>
        </div>

        {/* Thông tin liên hệ */}
        <div className="footer-contact">
          <p>Email: tandang1202@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Xuan dieu Street, Quy Nhon City</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Your Website Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

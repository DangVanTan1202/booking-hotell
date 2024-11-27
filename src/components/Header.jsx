import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "animate.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState("Sign In");
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    return route === location.pathname;
  }
  return (
    <>
      {/* Header */}
      <div
        className="position-fixed w-100 d-flex justify-content-center"
        style={{
          top: "0",
          zIndex: 100,
        }}
      >
        <header
          className="d-flex align-items-center px-3 py-2 animate__animated animate__fadeInDown shadow-lg"
          style={{
            background: "linear-gradient(135deg, #8B4513, #A52A2A)", // Gradient màu nâu
            borderRadius: "20px",
            maxWidth: "90%",
            width: "100%",
            justifyContent: "space-between",
            color: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            height: "175px", // Tăng chiều cao Header trên desktop
          }}
        >
          {/* Logo */}
          <div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Booking.com_Logo.svg/1280px-Booking.com_Logo.svg.png"
              alt="logo"
              className="cursor-pointer animate__animated animate__rubberBand"
              style={{
                width: "400px", // Logo to hơn trên desktop
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Menu */}
          <nav
            className="d-flex align-items-center justify-content-end flex-grow-1 flex-wrap"
            style={{ gap: "20px", marginLeft: "20px" }}
          >
            {/* Home */}
            <li
              className={`list-unstyled mx-2 cursor-pointer py-1 px-3 text-lg fw-bold ${
                pathMatchRoute("/")
                  ? "text-white border-bottom-2 border-danger animate__animated animate__pulse"
                  : "text-brown hover:text-white hover:border-bottom-2 hover:border-danger"
              }`}
              onClick={() => navigate("/")}
              style={{
                fontSize: "2rem", // Font chữ lớn hơn trên desktop
              }}
            >
              Home
            </li>

            {/* Explore */}
            <li
              className={`list-unstyled mx-2 cursor-pointer py-1 px-3 text-lg fw-bold ${
                pathMatchRoute("/explore")
                  ? "text-white border-bottom-2 border-danger animate__animated animate__pulse"
                  : "text-brown hover:text-white hover:border-bottom-2 hover:border-danger"
              }`}
              onClick={() => navigate("/explore")}
              style={{
                fontSize: "1.5rem",
              }}
            >
              Explore
            </li>

            {/* Account */}
            <li
              className={`list-unstyled mx-2 cursor-pointer py-1 px-3 text-lg fw-bold ${
                pathMatchRoute("/account") || pathMatchRoute("/login")
                  ? "text-white border-bottom-2 border-danger animate__animated animate__pulse"
                  : "text-brown hover:text-white hover:border-bottom-2 hover:border-danger"
              }`}
              onClick={() => navigate("/account")}
              style={{
                fontSize: "1.5rem",
              }}
            >
              {pageState}
            </li>
          </nav>
        </header>
      </div>

      {/* Add padding to content */}
      <div style={{ paddingTop: "140px" }}></div>

      {/* Responsive styles */}
      <style>
        {`
        @media (max-width: 768px) {
          header {
            height: 40x; /* Giữ kích thước nhỏ trên mobile */
            padding: 0.5rem 1rem;
          }
          img {
            width: 40px; /* Logo nhỏ trên mobile */
          }
          nav {
            justify-content: flex-end;
            gap: 2.5px; /* Khoảng cách nhỏ hơn trên mobile */
          }
          li {
            font-size: 0.1rem; /* Font chữ nhỏ hơn trên mobile */
            margin: 0;
          }
          div[style*="paddingTop"] {
            padding-top: 30px; /* Giảm padding trên mobile */
          }
        }
        
        @media (min-width: 768px) {
          header {
            height: 175px; /* Tăng chiều cao Header trên desktop */
          }
          img {
            width: 400px; /* Logo lớn hơn trên desktop */
          }
          nav {
            gap: 40px; /* Khoảng cách rộng hơn trên desktop */
          }
          li {
            font-size: 1.5rem; /* Font chữ lớn hơn */
          }
          div[style*="paddingTop"] {
            padding-top: 160px; /* Tăng padding để không bị che nội dung */
          }
        }
        `}
      </style>
    </>
  );
}

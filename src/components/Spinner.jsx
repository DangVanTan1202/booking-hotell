import spinner from "../assets/images/spinner.svg";

export default function Spinner() {
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-center position-fixed bg-dark bg-opacity-50"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}
      >
        <img src={spinner} alt="Loading..." style={{ height: "6rem" }} />
      </div>
    </div>
  );
}

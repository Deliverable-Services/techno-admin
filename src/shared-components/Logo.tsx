import logo from "../assets/logo.jpg";
const Logo = () => {
  return (
    <div className="d-flex justify-content-start">
      <div className="logo text-left ml-4">
        <img src={logo} alt="logo" />
        {/* <h2 style={{ color }}>Carwash</h2> */}
      </div>
    </div>
  );
};

export default Logo;

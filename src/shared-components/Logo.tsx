import logo from "../assets/logo.svg";

const Logo = () => {
  return (
    <div className="d-flex justify-content-start">
      <div className="logo text-left ml-4">
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Logo;

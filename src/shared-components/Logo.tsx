import logo from '../assets/logo.jpg'
const Logo = () => {
    return (
        <div className="logo-wrapper">
            <div className="logo">
                <img src={logo} alt="logo" />
                {/* <h2 style={{ color }}>Carwash</h2> */}
            </div>
        </div>
    )
}

export default Logo

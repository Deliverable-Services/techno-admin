interface IOverlay {
    onClick?: () => void
}
const Overlay = ({ onClick }: IOverlay) => {
    return (
        <div className="overlay" onClick={onClick ? onClick : () => { }}>

        </div>
    )
}

export default Overlay

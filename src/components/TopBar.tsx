import { useContext } from 'react'
import { Container } from 'react-bootstrap'
import { BiMenuAltLeft } from 'react-icons/bi'
import { BsBell } from 'react-icons/bs'
import { IsDesktopContext } from '../context/IsDesktopContext'
import Logo from '../shared-components/Logo'
import { INavBar } from '../types/interface'
import { primaryColor } from '../utils/constants'
import profile from '../assets/profile.svg'

const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
    const isDesktop = useContext(IsDesktopContext)
    const openNavBar = () => {
        if (setIsNavOpen) {
            setIsNavOpen(true)
        }
    }

    return (
        <Container fluid className="top-bar d-flex align-items-center justify-content-between w-100" >
            {
                !isDesktop ?
                    <div className="menu-hamburger">
                        {
                            !isNavOpen ?
                                <BiMenuAltLeft size={32} onClick={openNavBar} color={primaryColor} /> :
                                null

                        }
                    </div> : null
            }

            {
                !isDesktop ?
                    <Logo /> : null
            }

            <div className={isDesktop ? "d-flex ml-auto" : "d-flex"}>
                <div className="notification">
                    <BsBell size={24} />
                    <div className="circle bg-primary text-secondary d-flex  justify-content-center">
                        <p><b>1</b></p>
                    </div>
                </div>
                <div className="profile ml-4">
                    <button>
                        <img src={profile} alt="profile" />
                    </button>
                </div>
            </div>
        </Container>
    )
}

export default TopBar

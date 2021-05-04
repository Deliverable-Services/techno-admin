import React, { useContext } from 'react'
import { Button, Container, Dropdown } from 'react-bootstrap'
import { BiMenuAltLeft } from 'react-icons/bi'
import { BsBell } from 'react-icons/bs'
import { IsDesktopContext } from '../context/IsDesktopContext'
import Logo from '../shared-components/Logo'
import { INavBar } from '../types/interface'
import { primaryColor } from '../utils/constants'
import profile from '../assets/profile.svg'
import useTokenStore from '../hooks/useTokenStore'
import useUserProfileStore from '../hooks/useUserProfileStore'

const TopBar = ({ isNavOpen, setIsNavOpen }: INavBar) => {
    const isDesktop = useContext(IsDesktopContext)
    const removeToken = useTokenStore(state => state.removeToken)
    const removeUser = useUserProfileStore(state => state.removeUser)
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

            <div className={isDesktop ? "d-flex align-items-center ml-auto" : "d-flex align-items-center"}>
                <div className="notification">
                    <BsBell size={24} />
                    <div className="circle bg-primary text-secondary d-flex  justify-content-center">
                        <p><b>1</b></p>
                    </div>
                </div>

                {/* <button>
                        <img src={profile} alt="profile" />
                    </button> */}
                <Dropdown className="ml-4">
                    <Dropdown.Toggle id="dropdown-basic" className="filter-button bg-transparent border-0 text-primary">

                        <img src={profile} alt="profile" className="profile" />

                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            removeUser()
                            removeToken()
                        }}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </div>
        </Container>
    )
}

export default TopBar

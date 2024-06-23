import React, { useState, useEffect } from "react"
import Logo from "./logo"
import WalletConnectBtn from "../walletconnect"
import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const NavBar: React.FC = () => {
    const [navbarIndex, setNavbarIndex] = useState<Number>()

    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") setNavbarIndex(1)
        if (location.pathname === "/myoffer") setNavbarIndex(2)
        if (location.pathname === "/history") setNavbarIndex(3)
    }, [location]);

    return (
        <header className="w-[80%] flex flex-col items-center lg:flex-row lg:justify-between ">
            <div className="absolute right-10 top-3 block lg:hidden" id="ConnectWallet">
                <WalletConnectBtn />
            </div>

            <div className="mt-20 lg:mt-3 flex ">
                <Logo />
            </div>

            <div className="flex" id="NavBar">
                <nav className="flex mt-10">
                    <ul className="flex w-[80vw] lg:w-[30vw]  items-center justify-between">

                        <li>
                            <a href="/"
                                className={`${navbarIndex == 1 ? "text-[#00b3ba]" : "text-[white]"} hover:text-[#00b3ba] text-[20px] hover:no-underline`}
                                onClick={() => {
                                    setNavbarIndex(1)
                                }}>
                                EXPLORE
                            </a>
                        </li>

                        <li>
                            <a href="/myoffer"
                                className={`${navbarIndex == 2 ? "text-[#00b3ba]" : "text-[white]"} hover:text-[#00b3ba] text-[20px] hover:no-underline`}
                                onClick={() => {
                                    setNavbarIndex(1)
                                }}>
                                MY OFFERS
                            </a>
                        </li>

                        <li>
                            <a href="/history"
                                className={`${navbarIndex == 3 ? "text-[#00b3ba]" : "text-[white]"} hover:text-[#00b3ba] text-[20px] hover:no-underline`}
                                onClick={() => {
                                    setNavbarIndex(1)
                                }}>
                                HISTORY
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="mt-8 hidden lg:block" id="ConnectWallet">
                <WalletConnectBtn />
            </div>
        </header>

    )
}

export default NavBar
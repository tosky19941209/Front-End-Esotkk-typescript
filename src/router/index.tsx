import NavBar from "../component/navbar/navbar";
import MyOffer from "../component/myoffer"
import AllOffer from "../component/alloffer"
import Footer from "../component/footer/footer"
import ShowOffer from '../component/showoffer/showoffer';
import Admin from "../component/adminpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
function ProjectRouter() {
    return (
        <div className='flex flex-col min-h-screen items-center justify-between'
            style={{
                "background": "url('./img/background.png')",
                "backgroundRepeat": "no-repeat",
                "backgroundSize": "cover"
            }}
        >
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<AllOffer />} />
                    <Route path="/myoffer" element={<MyOffer />} />
                    <Route path="/showoffer" element={<ShowOffer />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>

                <Footer />
            </Router>
        </div>
    )
}
export default ProjectRouter
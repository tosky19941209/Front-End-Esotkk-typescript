import NavBar from "../component/navbar/navbar";
import Dashboard from "../component/dashboard/dashboard"
import Footer from "../component/footer/footer"
import ShowOffer from '../component/showoffer/showoffer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function ProjectRouter() {
    return (
        <Router>
            <div className='flex flex-col items-center justify-between'
                style={{
                    "background": "url('./background.png')",
                    "backgroundRepeat": "no-repeat",
                    "backgroundSize": "cover"
                }}
            >
                <NavBar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/showoffer" element={<ShowOffer />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default ProjectRouter
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from '../src/Components/Home/Home';
import MapContainer from '../src/page/mainMap/Map';
import Navbar from './Components/Navbar/navbar';
import Uploadvideo from './Components/Uploadvideo/Uploadvideo';
import LoginSignup from './Components/Login-signup/login';
function App() {


  return (
    <>
      <Router>
        <Navbar/>
            <Routes>
              <Route exact path="/" element={  <Home/>  } />
              <Route path="/map" element={<MapContainer/>} />
              <Route path="/uploadvideo" element={<Uploadvideo/>} />
              <Route path="/Login-Signup" element={<LoginSignup/>} />
            </Routes>
          
        </Router>

    </>
  )
}

export default App

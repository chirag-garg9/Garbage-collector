import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from '../src/Components/Home/Home';
import MapContainer from '../src/page/mainMap/Map';
import Navbar from './Components/Navbar/navbar';
import Uploadvideo from './Components/Uploadvideo/Uploadvideo';
function App() {


  return (
    <>
      <Router>
        <Navbar/>
            <Routes>
              <Route exact path="/" element={  <Home/>  } />
              <Route path="/map" element={<MapContainer/>} />
              <Route path="/uploadvideo" element={<Uploadvideo/>} />
            </Routes>
          
        </Router>

    </>
  )
}

export default App

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MiddleContent from './main_component/MiddleContent'
import Footer from './main_component/Footer'
import Home from './main_component/middleContent/Home'
import Collection from './main_component/middleContent/Collection'
import Navbar from './main_component/Navbar'
import Wishlist from './main_component/middleContent/Wishlist'
import Addbag from './main_component/middleContent/Addbag'
import Trends from './main_component/middleContent/Trends'
import Login from './auth/Login'
import Signup from './auth/Signup'

function Layout() {
  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideChrome && <Navbar />}
      {!hideChrome && <br/>}
      {!hideChrome && <br/>}
      <div>
        <Routes>
          <Route path="/collection" element={<Collection />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/bag" element={<Addbag />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
      {!hideChrome && <Footer/>}
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Layout />
      </Router>
    </>
  )
}

export default App

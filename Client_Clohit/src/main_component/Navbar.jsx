import React, { useState, useEffect } from 'react';
import Collection from './middleContent/Collection';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const [color, setColor] = useState('#252422');
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const colors = ['#252422', '#eb5e28'];

  useEffect(() => {
    const interval = setInterval(() => {
      setColor((prevColor) => {
        const currentIndex = colors.indexOf(prevColor);
        return currentIndex === colors.length - 1 ? colors[0] : colors[currentIndex + 1];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('clohit_user');
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  const navbar = {
    backgroundColor: '#eb5e28',
    color: '#252422',
    boxShadow: '0 4px 4px -2px #eb5e28',
    fontFamily: "'Lobster' , sans-serif ",
    fontSize: '1.2rem',
    width: '100%'
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search Query:', searchQuery);
    // Perform search functionality here (e.g., filtering collections or fetching data)
  };

  const handleLogout = () => {
    localStorage.removeItem('clohit_token');
    localStorage.removeItem('clohit_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div style={navbar} className='nav-class p-2 fixed-top' >
      <div className="d-flex flex-wrap  align-items-center">
        <div className="col-4">
          <Link to={'/'} style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>
          <div className="d-flex align-items-center flex-wrap ">
            <div className="fs-3 mx-2">Clohit</div>
            <div style={{ color: color, fontSize: '1rem' }} className='mx-2'>Delivery in 60 minutes</div>
          </div>
          </Link>
        </div>

        {/* Search bar */}
        <form className="d-flex col-3" role="search" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            data-bs-theme="dark"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update state when input changes
          />
          <button className="btn btn-outline-dark" type="submit">Search</button>
        </form>

        <div className="d-flex flex-wrap col-5 justify-content-end">
          <Link className="mx-2" to="/collection" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Collection</Link>
          <Link className="mx-2" to="/trends" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Trends</Link>
          <Link className="mx-2" to="/wishlist" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Wishlist</Link>
          <Link className="mx-2" to="/bag" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Bag</Link>
          {!user ? (
            <>
              <Link className="mx-2" to="/login" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Login</Link>
              <Link className="mx-2" to="/signup" style={{ cursor: 'pointer', color: '#252422', textDecoration: 'none' }}>Signup</Link>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <span className="mx-2">Hi, {user.name}</span>
              <button className="btn btn-outline-dark" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  
  );
};

export default Navbar;

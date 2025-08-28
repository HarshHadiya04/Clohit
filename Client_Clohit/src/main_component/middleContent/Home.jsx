import React, { useState, useEffect } from 'react';
import Female from "./home/Female"
import Male from "./home/Male"
import Slideshow from './home/Slideshow';


function Home() {
  const style = {
    color: '#eb5e28',
    fontFamily: "'Lobster' , sans-serif ",
    fontSize: '1.2rem'
  }
  const [activeGender, setActiveGender] = useState('male');
  return (
    <>
    <br/>
      <div className="d-flex justify-content-evenly p-2" style={style}>
        {/* Male button */}
        <div
          className={`box btn ${activeGender === 'male' ? 'active' : ''}`} // Conditionally apply 'active'
          
          aria-pressed={activeGender === 'male'}
          onClick={() => setActiveGender('male')} // Set active to 'male' on click
        >
          Male
        </div>

        {/* Female button */}
        <div
          className={`box btn ${activeGender === 'female' ? 'active' : ''}`} // Conditionally apply 'active'
          role="button"
          aria-pressed={activeGender === 'female'}
          onClick={() => setActiveGender('female')} // Set active to 'female' on click
        >
          Female
        </div>
      </div>
      <Slideshow/>
      <div>
        {activeGender === 'male' ? <Male /> : <Female />}
        </div>
    </>
  )
}

export default Home

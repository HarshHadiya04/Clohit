import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

function Slideshow() {
  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    'media/images/slide_1.png',
    'media/images/slide_2.png',
    'media/images/slide_3.png',
    'media/images/slide_4.png',
    'media/images/slide_5.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  const goToNextImage = () => {
    setImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPreviousImage = () => {
    setImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <>
      <div className="d-flex justify-content-center position-relative">
        {/* Image */}
        <img
          className="rounded"
          style={{ height: '450px', width: '90%' }}
          src={images[imageIndex]}
          alt="slide image"
        />

        {/* Left arrow */}
        <button
          className="position-absolute top-50 start-0 translate-middle-y btn btn-light"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '50%', padding: '10px' }}
          onClick={goToPreviousImage}
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Right arrow */}
        <button
          className="position-absolute top-50 end-0 translate-middle-y btn btn-light"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '50%', padding: '10px' }}
          onClick={goToNextImage}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </>
  );
}

export default Slideshow;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShieldHalved, faStar, faBox, faBagShopping, faHeart } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";




function Footer() {

  return (
    <>
      <div className="icon d-flex p-2  border-top border-dark flex-wrap justify-content-evenly" style={{backgroundColor:'rgba(0, 0, 0, 0.097)', marginTop:'3rem'}}>
        <div className='d-flex '>
          <div className="d-flex p-2 flex-column">
            <FontAwesomeIcon icon={faShieldHalved} />
            Secure Payments
          </div>
          <div className="d-flex p-2 flex-column">
            <FontAwesomeIcon icon={faStar} />
            Genuine Product
          </div>
          <div className="d-flex p-2 flex-column">
            <FontAwesomeIcon icon={faBagShopping} />
            Try & Buy
          </div>
          <div className="d-flex p-2 flex-column">
            <FontAwesomeIcon icon={faBox} />
            7 Day Return
          </div>
        </div>
        <div>
          <div className="d-flex flex-column">
            <div ><FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faFacebook} />
              <FontAwesomeIcon icon={faInstagram} /></div>
            <div>Show us some <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} /> on our social media</div>
          </div>

        </div>
      </div>
      <div className="d-flex flex-wrap p-3 border-bottom border-dark" style={{backgroundColor:'#eb5f2824'}}>
        <div className="col-3">
          <h1 style={{fontFamily: "'Lobster' , sans-serif ",}}>Clohit</h1>
          <p>Experince the Clohit App on your web</p>
          <p>Subscribe to our newsletter</p>
          <button type="button" className="btn btn-dark rounded-3 p-2" >SUBSCRIBE</button>
        </div>
        <div className="col-9 d-flex flex-wrap justify-content-evenly">
          <div>
            <h5>HELP</h5>
            <ul>
              <li>Contact Us</li>
              <li>FAQ's</li>
              <li>Track Order</li>
            </ul>
          </div>
          <div>
            <h5>QUICK LINKS</h5>
            <ul>
              <li>Offer Zone</li>
              <li>Brands</li>
            </ul>
          </div>
          <div>
            <h5>TOP CATEGORIES</h5>
            <ul>
              <li>Top Wear</li>
              <li>Bottom Wear</li>
              <li>Athleisure</li>
              <li>Co-ords</li>
            </ul>
          </div>
          <div>
            <h5>ABOUT US</h5>
            <ul>
              <li>Who are we</li>
            </ul>
          </div>
          <div>
            <h5>POLICIES</h5>
            <ul>
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className='col-12' style={{textAlign:'center'}}>© 2024 All Rights Reserved.</p>
      </div>
      <br/>
      
    </>
  )
}

export default Footer

import React, { useEffect } from 'react';
import { useWishlist } from '../../WishlistContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useAddbag } from '../../AddbagContext';

function Wishlist() {
    const { wishlist, setWishlist } = useWishlist();
    const { Addbag , setAddbag} = useAddbag();
    
    const heartClick = (item) => {
        const updatedWishlist = wishlist.filter(likedItem => likedItem.Description !== item.Description);
        setWishlist(updatedWishlist); // Update the wishlist state
        console.log('Item removed:', item);
    };

    const bagClick = (item) => {
        const isLiked = Addbag.some(likedItem => likedItem.Description === item.Description);
        if (!isLiked) {
            setAddbag([...Addbag, item]);
        }
    };

    return ( 
    <>
        {wishlist.length === 0 ? (
            <div className="text-center" style={{margin:'8rem'}}>
            <h4>Your wishlist is empty</h4>
            <p>Add some wishitems to your Wishlist!</p>
        </div>
        ) : (
            <div className="d-flex p-3 flex-wrap justify-content-evenly">
            {wishlist.map((item) => (
                <div className="m-2 p-3 border rounded-4 shadow" style={{ marginBottom: '20px', width: '300px' }} key={item.Description}>
                    <img className="rounded m-3" src={item.Image} alt={item.Description} style={{ width: '250px' ,height:'350px', objectFit:'contain'}} />
                    
                    <h4 className='m-1' style={{ textAlign: 'center' }}>{item.Brand}</h4>
                    <p style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 1, // This limits the text to 2 lines
                        lineClamp: 2,
                        textAlignLast: 'center'
                    }}>{item.Description}</p>
                    <p>MRP: ₹{item.Mrp}</p>
                    <p>Price: ₹{item.Price}</p>
                    
                    
                    <div className="d-flex p-3 border-top border-dark pb-3 flex-wrap justify-content-evenly">
                    <FontAwesomeIcon
                        icon={faHeartSolid} 
                        onClick={() => heartClick(item)} 
                        style={{ cursor: 'pointer', height:'1.8rem' }} 
                    />
                    
                    <button type="button" class="btn btn-dark rounded-3" onClick={() => bagClick(item)}>Add to Bag</button>
                    </div>
                </div>
                
            ))}
        </div>
        )
        }
    </>
     );
}

export default Wishlist;
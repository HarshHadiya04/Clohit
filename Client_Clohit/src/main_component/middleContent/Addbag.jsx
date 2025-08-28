import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useAddbag } from '../../AddbagContext';
import { useWishlist } from '../../WishlistContext';

function Addbag() {
    const { Addbag, setAddbag } = useAddbag();
    const { wishlist, setWishlist } = useWishlist();

    const heartClick = (item) => {
        const isLiked = wishlist.some(likedItem => likedItem.Description === item.Description);
        if (isLiked) {
            setWishlist(wishlist.filter(likedItem => likedItem.Description !== item.Description));
        } else {
            setWishlist([...wishlist, item]);
        }
    };

    const bagClick = (item) => {
        const updatedAddbag = Addbag.filter(likedItem => likedItem.Description !== item.Description);
        setAddbag(updatedAddbag); // Update the wishlist state
        console.log('Item removed:', item);
    };

    return (<>
        {Addbag.length === 0 ? (
            <div className="text-center" style={{margin:'8rem'}}>
                <h4>Your bag is empty</h4>
                <p>Add some items to your bag!</p>
            </div>
        ) : (
            <div className="d-flex p-3 flex-wrap justify-content-evenly">
                {Addbag.map((item) => (
                    <div className="m-2 p-3 border rounded-4 shadow" style={{ marginBottom: '20px', width: '300px' }} key={item.Description}>
                        <img className="rounded m-3" src={item.Image} alt={item.Description} style={{ width: '250px', height: '350px', objectFit: 'contain' }} />

                        <h4 className='m-1' style={{ textAlign: 'center' }}>{item.Brand}</h4>
                        <p style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 1, // Limits the text to 1 line
                            lineClamp: 2,
                            textAlignLast: 'center'
                        }}>{item.Description}</p>
                        <p>MRP: ₹{item.Mrp}</p>
                        <p>Price: ₹{item.Price}</p>

                        <div className="d-flex p-3 border-top border-dark pb-3 flex-wrap justify-content-evenly">
                            <FontAwesomeIcon
                                icon={wishlist.some(wishItem => wishItem.Description === item.Description) ? faHeartSolid : faHeartRegular}
                                onClick={() => heartClick(item)}
                                style={{ cursor: 'pointer', height: '1.8rem' }}
                            />

                            <button type="button" className="btn btn-dark rounded-3" onClick={() => bagClick(item)}>Remove from Bag</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </>);
}

export default Addbag;
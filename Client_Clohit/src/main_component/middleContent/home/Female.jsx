import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from '../../../WishlistContext';
import { useAddbag } from '../../../AddbagContext';

function Female() {
    const {wishlist,setWishlist} = useWishlist();
    const {Addbag,setAddbag} = useAddbag();
    
    const [women, setWomen] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        const fetchWomen = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await fetch('http://localhost:5000/api/women-products');
                if (!res.ok) {
                    throw new Error('Failed to fetch women products');
                }
                const data = await res.json();
                setWomen(data || []);
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        fetchWomen();
    }, []);

    const heartClick = (item) => {
        const isLiked = wishlist.some(likedItem => likedItem.Description === item.Description);
        if (isLiked) {
            setWishlist(wishlist.filter(likedItem => likedItem.Description !== item.Description));
        } else {
            setWishlist([...wishlist, item]);
        }
    };

    const bagClick = (item) => {
        const isLiked = Addbag.some(likedItem => likedItem.Description === item.Description);
        if (!isLiked) {
            setAddbag([...Addbag, item]);
        }
    };
    return (
    <>
        <div className="d-flex p-3 flex-wrap justify-content-evenly">
                {loading && <div>Loading...</div>}
                {error && !loading && <div className="text-danger">{error}</div>}
                {!loading && !error && women.map((item) => (
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
                            icon={wishlist.some(wishItem => wishItem.Description === item.Description) ? faHeartSolid : faHeartRegular} 
                            onClick={() => heartClick(item)} 
                            style={{ cursor: 'pointer' ,height:'1.8rem'}} 
                        />
                        
                        <button type="button" class="btn btn-dark rounded-3" onClick={() => bagClick(item)}>Add to Bag</button>
                        </div>
                    </div>
                    
                ))}
            </div>
    </>
    );
}

export default Female;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from '../../WishlistContext'; // Adjust the path
import { useAddbag } from '../../AddbagContext';

function Trends() {
    const { wishlist, setWishlist } = useWishlist(); // Destructure the wishlist context
    const { Addbag, setAddbag } = useAddbag();
    const boys = [
        {
            Image: 'media/images/Trends/boy_1.jpg',
            Brand: 'BONKERS CORNER',
            Description: "Little Snitch Black Joggers",
            Mrp: '1299',
            Price: '1199'
        },
        {
            Image: 'media/images/Trends/boy_2.jpg',
            Brand: 'CAMPUS SUTRA',
            Description: "Contrast Heathered Activewear T-Shirt",
            Mrp: '1399',
            Price: '699'
        },
        {
            Image: 'media/images/Trends/boy_3.jpg',
            Brand: 'BALLER ATHLETIK',
            Description: "Hi Top Wayne Tracks",
            Mrp: '1999',
            Price: '1849'
        },
        {
            Image: 'media/images/Trends/boy_4.jpg',
            Brand: 'BALLER ATHLETIK',
            Description: "Boost tea",
            Mrp: '1499',
            Price: '899'
        },
    ];

    const girls = [
        {
            Image: 'media/images/girl_9.jpg',
            Brand: 'SIRIL',
            Description: "SIRIL Women's Bandhani Printed Chiffon Saree with Blouse",
            Mrp: '2150',
            Price: '473'
        },
        {
            Image: 'media/images/girl_10.jpg',
            Brand: 'ANNI DESIGNER',
            Description: "ANNI DESIGNER Women's Cotton Blend Kurta with Palazzo",
            Mrp: '2599',
            Price: '439'
        },
        {
            Image: 'media/images/girl_1.jpg',
            Brand: 'GoSriKi',
            Description: "GoSriKi Women's Rayon Blend Anarkali Printed Kurta with Palazzo & Dupatta",
            Mrp: '2599',
            Price: '689'
        },
        {
            Image: 'media/images/girl_3.jpg',
            Brand: 'Amazon Brand - Myx',
            Description: "Amazon Brand - Myx Women's Printed Straight Cotton Short Kurti",
            Mrp: '799',
            Price: '329'
        },
    ];

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

    return (<>
        <div className='d-flex m-2'>
            <img className="rounded p-2" src="media/images/Trends/boy.png" style={{ objectFit: 'contain' }} />
            <div className="d-flex p-3 justify-content-evenly overflow-auto" >
                {boys.map((item) => (
                    <div className="m-2 p-3 border rounded-4 shadow" style={{ marginBottom: '20px', width: '300px' }} key={item.Description}>
                        <img className="rounded m-3" src={item.Image} alt={item.Description} style={{ width: '250px', height: '350px', objectFit: 'contain' }} />

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
                                style={{ cursor: 'pointer', height: '1.8rem' }}
                            />

                            <button type="button" class="btn btn-dark rounded-3" onClick={() => bagClick(item)}>Add to Bag</button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
        <div className='d-flex m-2'>
            <img className="rounded p-2" src="media/images/Trends/girl.png" style={{ objectFit: 'contain' }} />
            <div className="d-flex p-3 justify-content-evenly overflow-auto" >
                {girls.map((item) => (
                    <div className="m-2 p-3 border rounded-4 shadow" style={{ marginBottom: '20px', width: '300px' }} key={item.Description}>
                        <img className="rounded m-3" src={item.Image} alt={item.Description} style={{ width: '250px', height: '350px', objectFit: 'contain' }} />

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
                                style={{ cursor: 'pointer', height: '1.8rem' }}
                            />

                            <button type="button" class="btn btn-dark rounded-3" onClick={() => bagClick(item)}>Add to Bag</button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    </>);
}

export default Trends;
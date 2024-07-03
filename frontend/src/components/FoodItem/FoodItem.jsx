import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // PropTypes import karo
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItem, addToCart, removeCart, url } = useContext(StoreContext);

  // cartItem[id] ki value console par print karo
  console.log(cartItem[id]);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        {/* Image ko sahi tarah se render karo */}
        <img src={`${url}/images/${image}`} alt="" className="food-item-image" />
        {!cartItem[id] ? (
          // Cart item add karne ke liye button render karo
          <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
        ) : (
          <div className="food-item-counter">
           
            <img onClick={() => removeCart(id)} src={assets.remove_icon_red} alt="" />
            {/* Cart item ki quantity render karo */}
            <p>{cartItem[id]}</p>
            {/* Cart item add karne ke liye button render karo */}
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          {/* Food item ka name render karo */}
          <p>{name}</p>
          {/* Food item ka rating render karo */}
          <img src={assets.rating_starts} alt="" />
        </div>
        {/* Food item ka description render karo */}
        <p className="food-item-desc">{description}</p>
        {/* Food item ka price render karo */}
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

// PropTypes ka use karke props ko validate karo
FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default FoodItem;

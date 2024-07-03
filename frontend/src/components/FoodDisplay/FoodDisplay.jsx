import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import "./FoodDisplay.css";
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

function FoodDisplay({ category }) {
  const { food_list } = useContext(StoreContext);

  return (
    <div>
      <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
          {food_list.map((item, index) => {
            if (category === 'All' || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// Define prop types
FoodDisplay.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FoodDisplay;

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItem, setCartItem] = useState({});
    const [token, setToken] = useState("");
    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    console.log(cartItem);
    

    const addToCart = async (itemId) => {
        if (!cartItem[itemId]) {
            setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            try {
                await axios.post(url+"/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Error adding to cart:", error.response ? error.response.data : error.message);
            }
        }
    };

    const removeCart = async (itemId) => {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            try {
                await axios.post(url+"/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error("Error removing from cart:", error.response ? error.response.data : error.message);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItem) {
            if (cartItem[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItem[item];
            }
        }
        return totalAmount;
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();

            if (localStorage.getItem("token"))
         {
                console.log("Stored token found:",localStorage.getItem("token"));

                setToken(localStorage.getItem("token"));
           
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (token) {
            console.log("Token set, loading cart data:", token); // Debugging line
            loadCartData(token);
        }
    }, [token]);

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error.response ? error.response.data : error.message);
        }
    };

   const loadCartData = async (token) => {
    try {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } });
        if (response && response.data && response.data.cartData) {
            setCartItem(response.data.cartData);
        }
    } catch (error) {
        console.error("Error loading cart data:", error.response ? error.response.data : error.message);
    }
};

    useEffect(()=>{
        console.log(cartItem);
    },[cartItem])

    const contextValue = {
        food_list,
        addToCart,
        removeCart,
        cartItem,
        setCartItem,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

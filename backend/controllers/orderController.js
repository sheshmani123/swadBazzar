import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  console.log("Request Body Before Order Creation:", req.body); // Debugging: Log the request body

  try {
    const { userId, items, amount, address } = req.body; // Destructure necessary fields

    // Ensure all required fields are present
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "Food Processing",
      date: new Date(),
      payment: false,
    });

    await newOrder.save();
    console.log("Order saved successfully");

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error('Error in placeOrder:', error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

 

export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  console.log(`verifyOrder called with orderId: ${orderId}, success: ${success}`);

  try {
    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      if (updatedOrder) {
        res.json({ success: true, message: "Payment successful" });
      } else {
        res.json({ success: false, message: "Order not found" });
      }
    } else {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);
      if (deletedOrder) {
        res.json({ success: false, message: "Payment not successful, order deleted" });
      } else {
        res.json({ success: false, message: "Order not found" });
      }
    }
  } catch (error) {
    console.error('Error in verifyOrder:', error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

export default placeOrder;

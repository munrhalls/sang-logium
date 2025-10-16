// should mimic existing structure of other library GROQ files
// should export a function to add an order to Sanity backend
// should use imported GROQ to issue GROQ query to Sanity backend
// should handle errors and return appropriate responses

// should take inputs for order details, shipping info, payment info, and cart items
// should return order confirmation or error message

import { defineMutation } from "next-sanity";
import { client } from "../client";

export const addOrder = defineMutation({
  name: "addOrder",
  async resolve(_, { orderDetails, shippingInfo, paymentInfo, cartItems }) {
    try {
      const result = await client.create({
        _type: "order",
        orderDetails,
        shippingInfo,
        paymentInfo,
        cartItems,
      });
      return { success: true, orderId: result._id };
    } catch (error) {
      console.error("Error adding order:", error);
      return { success: false, error: "Failed to add order" };
    }
  },
});

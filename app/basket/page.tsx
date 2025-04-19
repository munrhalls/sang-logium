import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import ProductQuantityControl from "../components/basket/ProductQuantityControl";

/**
 * BasketPage component displaying the current basket items and checkout options
 */
export default function BasketPage() {
  // Sample data - would be replaced with actual state/data fetching
  const basketItems = [
    {
      id: "1",
      name: "Studio Headphones Pro",
      brand: "AudioTech",
      price: 249.99,
      image: "/placeholder.jpg", // Would use actual image path
      quantity: 1
    },
    {
      id: "2",
      name: "Wireless Earbuds X2",
      brand: "SoundMaster",
      price: 99.99,
      image: "/placeholder.jpg", // Would use actual image path
      quantity: 2
    }
  ];

  // Calculate subtotal - would be handled by actual business logic in integration
  const subtotal = basketItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Shipping cost - would be determined by actual business logic
  const shipping = 15.99;
  
  // Total cost
  const total = subtotal + shipping;

  // Placeholder for empty basket display
  if (basketItems.length === 0) {
    return (
      <div className="container mx-auto my-12 px-4">
        <h1 className="text-2xl font-semibold mb-8">Your Basket</h1>
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-md shadow-sm">
          <ShoppingCartIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Your basket is empty</h2>
          <p className="text-gray-500 mt-2 mb-6">Add some products to your basket to continue shopping</p>
          <Link 
            href="/products"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 px-4">
      <h1 className="text-2xl font-semibold mb-8">Your Basket</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basket Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            {/* Headers */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_auto] p-4 border-b text-sm font-medium text-gray-500">
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div></div>
            </div>
            
            {/* Product List */}
            {basketItems.map((item) => (
              <div 
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_auto] p-4 border-b gap-4 items-center"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    {/* In real implementation, would use actual product image */}
                    <ShoppingCartIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-center lg:justify-center">
                  <div className="lg:hidden text-sm font-medium text-gray-500">Price:</div>
                  <div className="ml-auto lg:ml-0 font-medium">${item.price.toFixed(2)}</div>
                </div>
                
                {/* Quantity Control */}
                <div className="flex items-center lg:justify-center">
                  <div className="lg:hidden text-sm font-medium text-gray-500">Quantity:</div>
                  <div className="ml-auto lg:ml-0">
                    <ProductQuantityControl
                      productId={item.id}
                      quantity={item.quantity}
                    />
                  </div>
                </div>
                
                {/* Remove Button */}
                <button 
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
                  aria-label="Remove item"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <div className="text-gray-600">Subtotal</div>
                <div className="font-medium">${subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-600">Shipping</div>
                <div className="font-medium">${shipping.toFixed(2)}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <div>Total</div>
                  <div>${total.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <button
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
            >
              Proceed to Checkout
            </button>
            
            <Link 
              href="/products"
              className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium flex items-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
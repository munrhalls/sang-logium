"use client";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import { useState } from "react";
function ActiveOrders() {
  const [orders] = useState([]);
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
        Active Orders
      </h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">You have no active orders.</div>
      ) : (
        <div>Order list here</div>
      )}
    </div>
  );
}
function OrdersHistory() {
  const [orders] = useState([]);
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
        Order History
      </h2>
      {orders.length === 0 ? (
        <div className="text-gray-500">No past orders found.</div>
      ) : (
        <div>Order history list here</div>
      )}
    </div>
  );
}
function Preferences() {
  const [prefs, setPrefs] = useState({
    newsletter: false,
    sms: false,
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrefs({ ...prefs, [e.target.name]: e.target.checked });
  }
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
        Preferences
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={prefs.newsletter}
            onChange={handleChange}
            className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
          />
          <label
            htmlFor="newsletter"
            className="ml-2 block text-sm text-gray-700"
          >
            Receive product updates by email
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="sms"
            name="sms"
            type="checkbox"
            checked={prefs.sms}
            onChange={handleChange}
            className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
          />
          <label htmlFor="sms" className="ml-2 block text-sm text-gray-700">
            Receive order status by SMS
          </label>
        </div>
      </div>
    </div>
  );
}
export default function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
      <div className="mb-8">
        <SegmentTitle title="Your Account" />
      </div>
      <div className="space-y-8">
        <ActiveOrders />
        <OrdersHistory />
        {}
        <Preferences />
      </div>
    </div>
  );
}

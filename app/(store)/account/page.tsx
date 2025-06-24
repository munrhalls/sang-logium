"use client";

import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import AddressForm from "@/app/components/features/delivery-information/AddressForm";
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

function ContactInformationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          autoComplete="name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          autoComplete="tel"
        />
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="px-6 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors font-medium disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

function DeliveryInformation() {
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">
        Delivery Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Address</h3>
          <AddressForm />
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">
            Contact Information
          </h3>
          <ContactInformationForm />
        </div>
      </div>
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
        <DeliveryInformation />
        <Preferences />
      </div>
    </div>
  );
}

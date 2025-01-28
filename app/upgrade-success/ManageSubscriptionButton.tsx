// components/ManageSubscriptionButton.tsx

'use client';

import React from 'react';

const ManageSubscriptionButton: React.FC = () => {
  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.url) {
        // Redirect to the Customer Portal
        window.location.href = data.url;
      } else {
        console.error('Failed to create portal session');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <button
      onClick={handleManageSubscription}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Manage Subscription
    </button>
  );
};

export default ManageSubscriptionButton;

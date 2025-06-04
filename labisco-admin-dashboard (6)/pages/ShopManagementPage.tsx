
import React, { useState, useEffect } from 'react';
import type { ShopSettings } from '../types.js';
import { INITIAL_SHOP_SETTINGS, ChevronDownIcon } from '../constants.js';

const timezones = [
  "Africa/Lagos (GMT+1)",
  "America/New_York (GMT-4)",
  "Europe/London (GMT+1)",
  "Asia/Tokyo (GMT+9)",
  "Australia/Sydney (GMT+10)",
  "Pacific/Auckland (GMT+12)"
];

const currencies = ["NGN", "USD", "EUR", "GBP", "JPY", "AUD"];

const ShopManagementPage: React.FC = () => {
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // In a real app, fetch settings from a backend
    setSettings(INITIAL_SHOP_SETTINGS);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('notifications.')) {
        const notifKey = name.split('.')[1] as keyof ShopSettings['notifications'];
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [notifKey]: (e.target as HTMLInputElement).checked
            }
        }));
    } else {
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessMessage(true);
      console.log("Shop settings saved:", settings);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 1500);
  };

  const inputBaseClasses = "block w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500";
  const labelBaseClasses = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  return (
    <div className="max-w-2xl mx-auto bg-cardLight dark:bg-cardDark p-6 sm:p-8 rounded-xl shadow-xl border border-borderLight dark:border-borderDark">
      <h2 className="text-2xl font-semibold text-textLight dark:text-textDark mb-6 border-b border-borderLight dark:border-borderDark pb-4">Shop Settings</h2>
      
      {showSuccessMessage && (
        <div className="mb-4 p-3 bg-secondary-light/20 dark:bg-secondary-dark/20 text-secondary-dark dark:text-secondary-light rounded-md border border-secondary-DEFAULT/30">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="shopName" className={labelBaseClasses}>Shop Name</label>
          <input
            type="text"
            name="shopName"
            id="shopName"
            value={settings.shopName}
            onChange={handleChange}
            className={`mt-1 ${inputBaseClasses}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="currency" className={labelBaseClasses}>Currency</label>
            <div className="relative mt-1">
              <select
                name="currency"
                id="currency"
                value={settings.currency}
                onChange={handleChange}
                className={`appearance-none ${inputBaseClasses} pr-8`}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="timezone" className={labelBaseClasses}>Timezone</label>
            <div className="relative mt-1">
            <select
              name="timezone"
              id="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className={`appearance-none ${inputBaseClasses} pr-8`}
            >
              {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div>
            <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-200 mb-2">Notification Settings</h3>
            <div className="space-y-3 p-4 bg-neutral-50 dark:bg-neutral-700/40 rounded-md border border-borderLight dark:border-borderDark">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="notifications.newOrders"
                        checked={settings.notifications.newOrders}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-primary-DEFAULT bg-neutral-200 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500 rounded focus:ring-primary-light focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300">Email on new orders</span>
                </label>
                 <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        name="notifications.lowStock"
                        checked={settings.notifications.lowStock}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-primary-DEFAULT bg-neutral-200 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500 rounded focus:ring-primary-light focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300">Alert for low stock items</span>
                </label>
            </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-primary-DEFAULT transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopManagementPage;
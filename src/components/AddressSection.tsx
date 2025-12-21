'use client';

import { useState, useEffect } from 'react';
import AddressForm from './AddressForm';
import { createClient } from '@/app/utils/supabase/client';

interface AddressSectionProps {
  userId: string;
}

const AddressIconComponent = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const PlusIcon = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function AddressSection({addresses, userId}: {addresses: any[], userId: string}) {
  console.log('addresses from address section', addresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const handleAddAddress = () => {
    setShowAddressForm(true);
  };

  const handleCloseForm = () => {
    setShowAddressForm(false);
  };

  const handleSuccess = () => {
    // Form will refresh the page on success
    setShowAddressForm(false);
  };

  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     const supabase = createClient();
  //     const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId);
  //     console.log('addresses', data);
  //     setAddresses(data || []);
  //   };
  //   fetchAddresses();
  // }, [userId,showAddressForm]);



  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AddressIconComponent className="w-5 h-5" />
          Saved Addresses
        </h2>
        
     
          { addresses && addresses.length > 0 ? (
            <div className="mt-4 text-sm text-gray-600 bg-gray-200 flex flex-col items-center gap-2
            p-2 rounded-md
            ">
             
              {addresses && addresses.map((address) => (
                <div key={address.address_id} className=" p-2 rounded-md flex flex-row items-center gap-2">
                   <AddressIconComponent className="shrink-0 w-5 h-5 text-black" />
                  <p>
                    <span>{address.street_address}</span>
                    <span>{address.city}</span>
                    <span>{address.state}</span>
                    <span>{address.postal_code}</span>
                    <span>{address.country}</span>
                    <span>[{address.address_type}]</span>
                    <span className="text-green-500">{address.is_default ? 'Default Address' : ''}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600">No saved addresses</p>
          )}
          <button 
            onClick={handleAddAddress}
            className="group relative mt-4 px-6 py-3 bg-theme-sage hover:bg-theme-olive text-white font-medium text-sm rounded-lg 
                       transition-all duration-300 ease-in-out
                       transform hover:scale-105 active:scale-95
                       shadow-md hover:shadow-xl hover:shadow-theme-sage/30
                       flex items-center gap-2
                       overflow-hidden
                       border border-transparent hover:border-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <PlusIcon className="w-5 h-5 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span className="transition-all duration-300 group-hover:tracking-wide">Add Address</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           opacity-0 group-hover:opacity-100
                           transform -skew-x-12 -translate-x-full group-hover:translate-x-full
                           transition-transform duration-1000 ease-in-out"></span>
          </button>
       
      </div>

      {showAddressForm && (
        <AddressForm
          userId={userId}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}


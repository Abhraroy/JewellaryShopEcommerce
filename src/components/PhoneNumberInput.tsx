import { useStore } from '@/zustandStore/zustandStore';
import { useState } from 'react';

export default function PhoneNumberInput() {
    const { setOtpInputState, setMobnoInputState } = useStore();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
  
    const handlePhoneSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation for 10-digit phone number
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      if (cleanedPhone.length === 10) {
        setError('');
        console.log('Phone number:', cleanedPhone);
        // Handle phone number submission here
        // You can add your logic to store or verify the phone number
        setMobnoInputState();
        setOtpInputState();
      } else {
        setError('Please enter a valid 10-digit phone number');
      }
    };
  
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Automatically filter out all non-numeric characters (letters, symbols, etc.)
      const cleaned = value.replace(/\D/g, '');
      
      // Only update if the cleaned value is 10 digits or less
      if (cleaned.length <= 10) {
        // Set the cleaned value (only numbers) to the state
        setPhoneNumber(cleaned);
        setError('');
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      // Get pasted text and filter out non-numeric characters
      const pastedText = e.clipboardData.getData('text');
      const cleaned = pastedText.replace(/\D/g, '').slice(0, 10);
      setPhoneNumber(cleaned);
      setError('');
    };


    return (
        <>
        <div className='w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 fixed top-[70px] md:top-[80px] z-50 shadow-sm flex items-center justify-center
        transition-all duration-300
        '>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4'>
          <form onSubmit={handlePhoneSubmit} className='flex flex-col sm:flex-row sm:items-end gap-3 md:gap-4'>
            <div className='flex-1 w-full sm:w-auto max-w-md'>
              <label htmlFor="phone-input" className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-center sm:text-left'>
                <span className='hidden sm:inline'>Enter your phone number to continue shopping:</span>
                <span className='sm:hidden'>Enter phone number to continue:</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 text-sm'>+91</span>
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onPaste={handlePaste}
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters from being typed
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                      e.preventDefault();
                    }
                  }}
                  placeholder='9876543210'
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className='w-full pl-12 pr-4 py-2.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all'
                  maxLength={10}
                />
              </div>
              {error && (
                <p className='mt-1 text-xs text-red-600 text-center sm:text-left'>{error}</p>
              )}
            </div>
            <button
              type="submit"
              className='w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 whitespace-nowrap'
            >
              Continue
            </button>
          </form>
        </div>
      </div>
        </>
    )
}
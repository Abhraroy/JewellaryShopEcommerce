import { createClient } from '@/app/utils/supabase/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';


// Icon Components
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.924-6.375a48.567 48.567 0 0 0-8.563-4.137M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

const AddressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log('data', data)
  if (error || !data?.user) {
    redirect('/');
  }

  const res = await supabase.from("users").select("*").eq("phone_number","+"+data.user.phone).single();
  console.log('userData', res)
  const user = res.data;
  const formattedPhone = user.phone_number || 'Not provided';
  const formattedEmail = user.email || 'Not provided';
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={0} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon />
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <PhoneIcon />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Phone Number</span>
                  </div>
                  <span className="text-gray-900 font-medium">{formattedPhone}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-6 min-w-[120px]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                          <EmailIcon />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Email</span>
                      </div>
                      <span className="text-gray-900 font-medium">{formattedEmail}</span>
                    </div>
                  <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">Update Email</button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <CalendarIcon />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Member Since</span>
                  </div>
                  <span className="text-gray-900 font-medium">{createdAt}</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <OrderIcon />
                Recent Orders
              </h2>
              
              <div className="text-center py-12">
                <OrderIcon />
                <p className="mt-4 text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500 mt-2">Your order history will appear here</p>
                <a 
                  href="/" 
                  className="inline-block mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Start Shopping
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side (1 column) */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <a 
                  href="/collection" 
                  className="block w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg transition-colors duration-200 text-center"
                >
                  Browse Collections
                </a>
                <a 
                  href="/" 
                  className="block w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-center"
                >
                  Continue Shopping
                </a>
              </div>
            </div>

            {/* Addresses Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AddressIcon />
                Saved Addresses
              </h2>
              
              <div className="text-center py-8">
                <AddressIcon />
                <p className="mt-4 text-sm text-gray-600">No saved addresses</p>
                <button className="mt-4 px-4 py-2 text-amber-600 hover:text-amber-700 font-medium text-sm">
                  Add Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

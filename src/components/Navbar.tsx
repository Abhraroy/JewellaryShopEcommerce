'use client';

import { useState, useEffect } from 'react';
import { useStore } from '../zustandStore/zustandStore';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  cartCount?: number;
  isAuthenticated?: boolean;
  onCartClick?: () => void;
}

interface IconProps {
  className?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

interface DesktopIcon {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}

// SVG Icon Components
const SearchIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const UserIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const WishlistIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const CartIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.924-6.375a48.567 48.567 0 0 0-8.563-4.137M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

const MenuIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon = ({ className = 'w-6 h-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SettingsIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.297 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const OrdersIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h11.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
    />
  </svg>
);

const HelpIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
    />
  </svg>
);

const AboutIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    />
  </svg>
);

export default function Navbar({ cartCount = 0, isAuthenticated = false, onCartClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setMobnoInputState,AuthenticatedState } = useStore();
  const router = useRouter();
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Sidebar menu items configuration
  const menuItems: MenuItem[] = [
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: <WishlistIcon className="w-5 h-5" />,
      requiresAuth: true,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />,
      requiresAuth: true,
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: <OrdersIcon />,
      requiresAuth: true,
    },
    {
      label: 'My Account',
      href: isAuthenticated ? '/account' : '/login',
      icon: <UserIcon className="w-5 h-5" />,
      requiresAuth: false,
    },
    {
      label: 'Help & Support',
      href: '/help',
      icon: <HelpIcon />,
      requiresAuth: false,
    },
    {
      label: 'About',
      href: '/about',
      icon: <AboutIcon />,
      requiresAuth: false,
    },
  ];

  // Filter menu items based on authentication
  const filteredMenuItems = menuItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  // Desktop icons configuration
  const desktopIcons: DesktopIcon[] = [
    {
      label: 'Account',
      icon: <UserIcon className="w-6 h-6 md:w-7 md:h-7" />,
      onClick: () => {
        if(AuthenticatedState){
          console.log("isAuthenticated",AuthenticatedState)
          router.push('/account');
        }
        else{
          console.log("not authenticated")
          setMobnoInputState();
        }
      },
    },
    {
      label: 'Wishlist',
      icon: <WishlistIcon className="w-6 h-6 md:w-7 md:h-7" />,
      onClick: () => {},
    },
    {
      label: 'Shopping Cart',
      icon: <CartIcon className="w-6 h-6 md:w-7 md:h-7" />,
      badge: cartCount,
      onClick: onCartClick || (() => {}),
    },
  ];

  // Mobile icons configuration
  const mobileIcons = [
    {
      label: 'Search',
      icon: <SearchIcon className="w-6 h-6" />,
      onClick: () => setShowMobileSearch(!showMobileSearch),
    },
    {
      label: 'Account',
      icon: <UserIcon className="w-6 h-6" />,
      onClick: () => {
        setMobnoInputState();
      },
    },
    {
      label: 'Shopping Cart',
      icon: <CartIcon className="w-6 h-6" />,
      badge: cartCount,
      onClick: onCartClick || (() => {}),
    },
    {
      label: 'Menu',
      icon: <MenuIcon className="w-6 h-6" />,
      onClick: () => setIsSidebarOpen(true),
    },
  ];

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#E94E8B] tracking-tight">
                JWEL
              </span>
            </a>
          </div>

          {/* Search Bar Section - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 md:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 md:h-12 px-4 pr-10 bg-gray-100 rounded-lg border-none outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base focus:bg-gray-200 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SearchIcon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Desktop Icons Section */}
          <div className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-6">
            {desktopIcons.map((iconItem, index) => (
              <button
                key={index}
                onClick={iconItem.onClick}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
                aria-label={iconItem.label}
              >
                {iconItem.icon}
                {iconItem.badge !== undefined && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {iconItem.badge > 0 ? iconItem.badge : 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Icons Section */}
          <div className="md:hidden flex items-center gap-3">
            {mobileIcons.map((iconItem, index) => (
              <button
                key={index}
                onClick={iconItem.onClick}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
                aria-label={iconItem.label}
              >
                {iconItem.icon}
                {iconItem.badge !== undefined && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {iconItem.badge > 0 ? iconItem.badge : 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Search Bar - Shows when search icon is clicked */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 pr-10 bg-gray-100 rounded-lg border-none outline-none text-gray-700 placeholder-gray-400 text-sm focus:bg-gray-200 transition-colors"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SearchIcon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Mobile Only */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 md:hidden"
            onClick={handleCloseSidebar}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform translate-x-0 transition-transform duration-300 ease-in-out md:hidden">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-4">
                  {filteredMenuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={handleCloseSidebar}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}


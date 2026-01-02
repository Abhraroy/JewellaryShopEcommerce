"use client";
import { useStore } from "@/zustandStore/zustandStore";
import Navbar from "./Navbar";
import OtpInput from "./OtpInput";
import PhoneNumberInput from "./PhoneNumberInput";
import Cart from "./Cart";
export default function ParentNavbar() {
    const { setIsCartOpen, MobnoInputState, OtpInputState, isCartOpen, cartItems } = useStore();
    const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
    const handleOpenCart = () => {
        setIsCartOpen(true);
    };
    const handleCloseCart = () => {
        setIsCartOpen(false);
    };
    return (
        <div>
            <Navbar cartCount={cartCount} onCartClick={handleOpenCart} />
            {MobnoInputState && !OtpInputState && <PhoneNumberInput />}
            {OtpInputState && !MobnoInputState && <OtpInput />}
            {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} />}
        </div>
    )
}
"use client";
import { useStore } from "@/zustandStore/zustandStore";
import Navbar from "./Navbar";
import OtpInput from "./OtpInput";
import PhoneNumberInput from "./PhoneNumberInput";
import Cart from "./Cart";
import { useState } from "react";
export default function ParentNavbar() {
    const { setIsCartOpen, MobnoInputState, OtpInputState, isCartOpen } = useStore();
    const handleOpenCart = () => {
        setIsCartOpen(true);
    };
    const handleCloseCart = () => {
        setIsCartOpen(false);
    };
    return (
        <div>
            <Navbar cartCount={0} onCartClick={handleOpenCart} />
            {MobnoInputState && !OtpInputState && <PhoneNumberInput />}
      {OtpInputState && !MobnoInputState && <OtpInput />}
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} />}
        </div>
    )
}
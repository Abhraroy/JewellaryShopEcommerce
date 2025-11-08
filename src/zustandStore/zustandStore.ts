import { create } from "zustand"

interface StoreState {
    MobnoInputState: boolean;
    setMobnoInputState: () => void;
    customerMobno: string;
    setCustomerMobno: (mobno: string) => void;
    OtpInputState: boolean;
    setOtpInputState: () => void;
    updateEmailState: boolean;
    setUpdateEmailState: () => void;
    AuthenticatedState: boolean;
    setAuthenticatedState: (auth: boolean) => void;
    cartItems: any;
    setCartItems: (items: any) => void;
    checkoutState: boolean;
    setCheckoutState: (state: boolean) => void;
    AuthUserId: string;
    setAuthUserId: (userId: string) => void;
    CartId: string;
    setCartId: (cartId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
    MobnoInputState: false,
    setMobnoInputState: () => set((state) => ({ MobnoInputState: !state.MobnoInputState })),
    customerMobno: '',
    setCustomerMobno: (mobno: string) => set({ customerMobno: mobno }),
    OtpInputState: false,
    setOtpInputState: () => set((state) => ({ OtpInputState: !state.OtpInputState })),
    updateEmailState: false,
    setUpdateEmailState: () => set((state) => ({ updateEmailState: !state.updateEmailState })),
    AuthenticatedState: false,
    setAuthenticatedState: (auth: boolean) => set({ AuthenticatedState: auth }),
    cartItems: [],
    setCartItems: (items: any) => set({ cartItems: items }),
    checkoutState:false,
    setCheckoutState: (state: boolean) => set({ checkoutState: state }),
    AuthUserId:"",
    setAuthUserId: (userId: string) => set({ AuthUserId: userId }),
    CartId:"",
    setCartId: (cartId: string) => set({ CartId: cartId }),
}))


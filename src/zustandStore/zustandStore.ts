import { create } from "zustand"

interface StoreState {
    MobnoInputState: boolean;
    setMobnoInputState: () => void;
    customerMobno: string;
    setCustomerMobno: (mobno: string) => void;
    OtpInputState: boolean;
    setOtpInputState: () => void;
}

export const useStore = create<StoreState>((set) => ({
    MobnoInputState: false,
    setMobnoInputState: () => set((state) => ({ MobnoInputState: !state.MobnoInputState })),
    customerMobno: '',
    setCustomerMobno: (mobno: string) => set({ customerMobno: mobno }),
    OtpInputState: false,
    setOtpInputState: () => set((state) => ({ OtpInputState: !state.OtpInputState })),
}))


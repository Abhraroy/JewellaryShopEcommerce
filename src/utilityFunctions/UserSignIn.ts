import axios from 'axios';
import { useStore } from '@/zustandStore/zustandStore';

export const userSignIn = async (completeOtp: string, customerMobno: string, supabase: any) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    phone: customerMobno,
    token: completeOtp,
    type: 'sms',
  });

  console.log('session', session);
  console.log('error', error);

  if (session && !error) {
    try {
      const response = await axios.post('/api/userRoutes', {
        phone: customerMobno,
      });
      console.log('response from /api/userRoutes', response);

      // Update global auth/cart state via zustand store
      const { setAuthenticatedState, setAuthUserId, setCartId } = useStore.getState();
      setAuthenticatedState(true);
      const userId = response.data?.user?.user_id;
      if (userId) setAuthUserId(userId);
      const cartId = Array.isArray(response.data?.cart)
        ? response.data?.cart?.[0]?.cart_id
        : response.data?.cart?.cart_id ?? response.data?.cart_id;
      if (cartId) setCartId(cartId);

      return { success: true, error: null, session: session, message: "User signed in successfully", completeResponse: response.data };
    } catch (apiError) {
      console.error('create user api error', apiError);
    }

    return { success: true, error: null, session: session, message: "User signed in successfully" };
  } else {
    return { success: false, error: error, session: null, message: "User not signed in" };
  }
}
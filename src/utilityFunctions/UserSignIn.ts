import {createMyUser} from "@/utilityFunctions/UserFunctions";
export const userSignIn = async (completeOtp:string,customerMobno:string,supabase:any) =>{
    const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: customerMobno,
        token: completeOtp,
        type: 'sms',
      })
      console.log('session', session)
      console.log('error', error)
      if (session && !error) {
        createMyUser(customerMobno);
        return {success:true,error:null,session:session,message:"User signed in successfully"};
      }
      else{
        return {success:false,error:error,session:null,message:"User not signed in"};
      }
}
import axios from "axios";


const requestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const requestBodyJson = {
    "client_version": process.env.PHONEPE_CLIENT_VERSION,
    "grant_type": process.env.PHONEPE_GRANT_TYPE,
    "client_id": process.env.PHONEPE_CLIENT_ID,
    "client_secret": process.env.PHONEPE_CLIENT_SECRET
  };

  const requestBody = new URLSearchParams(requestBodyJson as Record<string, string>).toString();

const sandbox = "https://api-preprod.phonepe.com/apis/pg-sandbox"

export async function getAuthToken(){
    console.log('requestBody', requestBody)
    const res = await axios.post(sandbox+"/v1/oauth/token",requestBody,{headers:requestHeaders})
    console.log('res', res)
}
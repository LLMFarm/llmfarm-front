import http from "@/utils/http.js";

const prefix = "/api/wxPayment/";
const wxPayment = {
  buy(productId){
     //wxPayment/buy
    const uri = prefix +"buy"
    return http.post(uri, { productId });
  },
};
export default wxPayment;

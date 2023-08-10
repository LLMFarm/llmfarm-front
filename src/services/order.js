import http from "@/utils/http.js";
const prefix = "/api/order/";
const order = {
  //http://127.0.0.1:8000/api/order/list
  orderList(pageNum, pageSize, { paymentTime, createTime, productPrice, status }) {
    const uri = prefix + "list";
    return http.get(uri, { pageNum, pageSize, paymentTime, createTime, productPrice, status });
  },
  // http://127.0.0.1:8000/api/order/detail
  orderDetail(id) {
    const uri = prefix + "detail";
    return http.get(uri, { orderNumber: id });
  },
  // http://127.0.0.1:8000/api/wxPayment/buy
  buy(id) {
    const uri = "/api/wxPayment/buy";
    return http.post(uri, { productId: id });
  }
};
export default order;
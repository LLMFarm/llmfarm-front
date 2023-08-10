import http from "@/utils/http.js";
const prefix = "/api/product/";
const product = {
  //http://127.0.0.1:8000/api/product/list
  productList() {
    const uri = prefix + "list";
    return http.get(uri, { status: "上架" });
  },
  // http://127.0.0.1:8000/api/product/detail
  productDetail(id) {
    const uri = prefix + "detail";
    return http.get(uri, { id: id });
  }
};
export default product;
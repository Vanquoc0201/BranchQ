class API {
    fetchData(){
        const promise = axios({
            url:"https://676199c546efb37323725008.mockapi.io/Api/Products",
            method:"GET"
        })
        return promise;
    }
    deleteDataById(id){
        const promise = axios({
            url:`https://676199c546efb37323725008.mockapi.io/Api/Products/${id}`,
            method:"DELETE"
        })
        return promise;
    }
    addData(product){
        const promise = axios({
            url:`https://676199c546efb37323725008.mockapi.io/Api/Products`,
            method:"POST",
            data: product
        })
        return promise;
    }
    getDataById(id){
        const promise = axios({
            url:`https://676199c546efb37323725008.mockapi.io/Api/Products/${id}`,
            method:"GET"
        });
        return promise;
    }
    updateData(product) {
        const promise = axios({
            url: `https://676199c546efb37323725008.mockapi.io/Api/Products/${product.id}`,
            method: "PUT", // Dùng PUT hoặc PATCH để cập nhật
            data: product,
        });
        return promise;
    }
}
export default new API();
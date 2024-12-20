import api from "./../Services/api.js"
import Product from "./../Models/product.js"
import Validation from "../Models/validation.js";
const validation = new Validation();
export const getEleId = (id) => document.getElementById(id);
const renderListProduct = (data)=>{
    let content = "";
    data.forEach((product,i)=>{
        const {id,name,price,screen,backCamera,frontCamera,img,desc,type} = product
        content +=`
        <tr>
        <td>${i+1}</td>
        <td>${name}</td>
        <td>$${price}</td>
        <td>${screen}</td>
        <td>${backCamera}</td>
        <td>${frontCamera}</td>
        <td>
            <img src="../img/${img}" width="50px" height="50px">
        </td>
        <td>${desc}</td>
        <td>${type === "Iphone" ? "Iphone" : "Samsung"}</td>
        <td>
        <button class="btn btn-info" onclick="handleDelete('${id}')">Delete</button>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#myModal" onclick="handleEdit('${id}')">Edit</button>
        </td>
        </tr>
        `;
    })
    getEleId("tblDanhSachSP").innerHTML = content;
}
/**
 * Fetch Product
 */
const getListProduct = () =>{
    const promise = api.fetchData()
    promise
    .then((result)=>{
        // console.log(result.data);
        renderListProduct(result.data);
    })
    .catch((error)=>{
    })
}
getListProduct();
/**
 * Add product
 */
getEleId("btnThemSP").addEventListener("click",()=>{
    // update title modal
    document.getElementsByClassName("modal-title")[0].innerHTML="Add product"
    // create button "Add" => footer modal
    const btnAdd = `<button class="btn btn-success" onclick="handleAdd()">Add</button>`
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
    document.getElementById("formProduct").reset()
});
const handleAdd = () =>{
    const name = getEleId("TenSP").value;
    const price = getEleId("GiaSP").value;
    const screen = getEleId("ScreenSP").value;
    const backCamera = getEleId("BackCameraSP").value;
    const frontCamera = getEleId("FrontCameraSP").value;
    const img = getEleId("HinhSP").value;
    const desc = getEleId("MoTa").value;
    const type = getEleId("LoaiSP").value;
    let isValid = true;
    isValid &= validation.checkEmpty(name,"tbTenSP","Please input name Product")
    isValid &= validation.checkEmpty(price,"tbGiaSP","Please input price Product") && validation.checkPrice(price,"tbGiaSP","Please input price number");
    isValid &= validation.checkEmpty(screen,"tbScreenSP","Please input screen Product")
    isValid &= validation.checkEmpty(backCamera,"tbBackCameraSP","Please input Backcamera Product")
    isValid &= validation.checkEmpty(frontCamera,"tbFrontCameraSP","Please input FrontCamera Product")
    isValid &= validation.checkEmpty(img,"tbHinhSP","Please input Image Product")
    validation.checkSelect("LoaiSP","tbLoaiSP","Please choose type Product")
    if(!isValid) return null;
    const product = new Product("",name,price,screen,backCamera,frontCamera,img,desc,type);
    if(!product) return;
    const promise = api.addData(product)
    promise
    .then((result)=>{
        getListProduct();
        document.getElementsByClassName("close")[0].click();
    })
    .catch((error)=>{
        console.log(error);
        
    })
}
window.handleAdd = handleAdd
/** 
 * Delete Product
 */
const handleDelete = (id) =>{
    const promise = api.deleteDataById(id)
    promise
    .then((result)=>{
        alert(`Delete product id: ${result.data.id} success!`);
        getListProduct();
    })
    .catch((error)=>{
        console.log(error);
    })
    
}
window.handleDelete = handleDelete;
/**
 * Edit Product
 */
const handleEdit = (id) =>{
    document.getElementsByClassName("modal-title")[0].innerHTML="Edit product"
    // create button "Update" => footer modal
    const btnUpdate = `<button id="btnCapNhat" class="btn btn-success" onclick="handleUpdate(${id})">Update</button>`
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;
    const promise = api.getDataById(id)
    promise
    .then((result)=>{
        const {data} = result;
        getEleId("TenSP").value = data.name
        getEleId("GiaSP").value = data.price
        getEleId("ScreenSP").value = data.screen
        getEleId("BackCameraSP").value = data.backCamera
        getEleId("FrontCameraSP").value = data.frontCamera
        getEleId("HinhSP").value = data.img
        getEleId("MoTa").value = data.desc
        getEleId("LoaiSP").value = data.type
    })
    .catch((error)=>{
        console.log(error);
    })
}
window.handleEdit = handleEdit;
/**
 * Handle update product
 */
const handleUpdate = (id) =>{
    const name = getEleId("TenSP").value;
    const price = getEleId("GiaSP").value;
    const screen = getEleId("ScreenSP").value;
    const backCamera = getEleId("BackCameraSP").value;
    const frontCamera = getEleId("FrontCameraSP").value;
    const img = getEleId("HinhSP").value;
    const desc = getEleId("MoTa").value;
    const type = getEleId("LoaiSP").value;
    const product = new Product(id,name,price,screen,backCamera,frontCamera,img,desc,type);
     const promise = api.updateData(product);
     promise
     .then((result)=>{
         getListProduct();
         document.getElementsByClassName("close")[0].click();
     })
     .catch((error)=>{
         console.log(error);
         
     })
 }
 window.handleUpdate = handleUpdate
 /**
  * Search Name
  */
 const searchProducts = (keyword) =>{
    const promise = api.fetchData()
    promise
    .then((result =>{
        const data=result.data
        const  filteredProducts = data.filter(product => product.name.toLowerCase().includes(keyword.toLowerCase()))
        renderListProduct(filteredProducts)
    }))
    .catch((error)=>{
        console.log(error);
    })
 }
 getEleId("searchName").addEventListener(("keyup"),function(){
    const keyword = getEleId("searchName").value;
    searchProducts(keyword);
 })
/**
 * Filter Price Products
 */
getEleId("sortPrice").addEventListener(("change"),function(){
    const sortOrder = getEleId("sortPrice").value;
    if(sortOrder === "filter"){
        getListProduct();
    } else {
        sortProducts(sortOrder);
    }
})
const sortProducts = (sortOrder) =>{
    const promise =api.fetchData();
    promise
    .then((result)=>{
        const data = result.data;
        const sortedProducts = sortProductsByPrice(data,sortOrder);
        renderListProduct(sortedProducts);
    })
    .catch((error)=>{
        console.log(error);
    })
}
const sortProductsByPrice = (product,sortOrder) =>{
    return product.sort((a,b) =>{
        const priceA = a.price;
        const priceB = b.price;
        if(sortOrder==="asc"){
            return priceA - priceB;
        } else {
            return priceB-priceA;
        }
    });
}
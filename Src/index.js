const getEleId = (id) => document.getElementById(id);
const renderListProduct = (data) => {
  let content = "";
  data.forEach((product) => {
    const {id,name,price,screen,backCamera,frontCamera,img,desc,type} = product
    content += `
      <div class="col-12 col-md-6 col-lg-4">
          <div class="card cardPhone">
              <img src="./img/${img}" class="card-img-top" alt="..." />
              <div class="card-body">
              <div class="d-flex justify-content-between">
                  <div>
                  <h3 class="cardPhone__title">${name}</h3>
                  <h3 class="cardPhone__title">Screen${screen}</h3>
                  <h3 class="cardPhone__title">FrontCamera:${frontCamera}</h3>
                  <h3 class="cardPhone__title">BackCamera${backCamera}</h3>
                  <p class="cardPhone__text">${desc}</p>
                  </div>
                  <div>
                  <h3 class="cardPhone__title">$${price}</h3>
                  <h3 class="cardPhone__title">${type === "Iphone"? "Iphone":"Samsung"}</h3>
                  </div>
              </div>
              <div class="d-flex justify-content-between">
                  <div class="cardPhone__rating">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  </div>
                  <div>
                  <button id="btn-buy" class="btnPhone-shadow" data-id="${id}">
                      <i class="fa fa-shopping-cart"></i> Buy Now
                  </button>
                  </div>
              </div>
              </div>
          </div>
      </div>
  `;
  });
  // show products to UI
  getEleId("main-product").innerHTML = content;
  addEventListeners(data)
};
/**
 * Select Type
 */
const filterProduct = (type) => {
  // Gọi API để lấy toàn bộ danh sách sản phẩm
  axios({
    url: "https://67563d2e11ce847c992c3910.mockapi.io/api/Products",
    method: "GET",
  })
    .then((result) => {
      // Lọc danh sách sản phẩm dựa trên loại
      const filteredProducts = result.data.filter((product) => {
        if (type === "") {
          // Nếu không chọn loại nào thì trả về toàn bộ sản phẩm
          return true;
        }
        return product.type === type;
      });

      // Gọi hàm render để hiển thị danh sách sản phẩm đã lọc
      renderListProduct(filteredProducts);
    })
    .catch((error) => {
      console.error("Lỗi khi lọc sản phẩm:", error);
    });
};
getEleId("LoaiSP").addEventListener("change",()=>{
  const selectedType = getEleId("LoaiSP").value
  filterProduct(selectedType);
})
/**
 * Cart
 */
let cart = [];
// Hàm cập nhật footer giỏ hàng
const updateCartFooter = () => {
  const footerElement = document.getElementById("cart-footer"); // ID của phần footer
  if (cart.length === 0) {
    footerElement.style.display = "none"; // Ẩn footer nếu giỏ hàng trống
  } else {
    footerElement.style.display = "block"; // Hiển thị footer nếu giỏ hàng có sản phẩm
  }
};
/** 
 * Add Item
 */
const addToCart = (product) =>{
  const existProduct = cart.find((item)=> item.id ===product.id)
  if(existProduct){
    existProduct.quantity +=1;
  } else {
    cart.push({...product,quantity:1});
    updateCartCount();
  } 
  setLocalStorage();
  renderCart(); 
  updateCartFooter();
}
const updateCartCount = () => {
  const cartCount = cart.length; // Số lượng sản phẩm khác nhau
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
};
/**
 * Render Item in Cart
 */
const renderCart = () => {
  // Lấy container cho danh sách sản phẩm và footer
  const cartProductList = document.getElementById("cart-product-list");
  const cartFooter = document.getElementById("cart-footer");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count"); // Biến đếm giỏ hàng

  // Kiểm tra nếu các phần tử không tồn tại
  if (!cartProductList || !cartFooter || !cartTotal || !cartCount) {
    console.error("Cart elements not found.");
    return;
  }

  // Xóa nội dung cũ của giỏ hàng
  cartProductList.innerHTML = "";
  if (cart.length === 0) {
    cartFooter.style.display = "none";
    cartCount.textContent = "0";  // Hiển thị đếm bằng 0 nếu giỏ trống
  } else {
    cartFooter.style.display = "flex";
    cartCount.textContent = cart.length
  }

  // Khởi tạo nội dung giỏ hàng và tổng giá trị
  let content = "";
  let total = 0;

  // Duyệt qua các sản phẩm trong giỏ hàng và tạo nội dung
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    content += `
      <div class="cart-item d-flex align-items-center mb-3">
        <div class="col-2">${index + 1}</div>
        <div class="col-3">${item.name}</div>
        <div class="col-2">
          <img src="./img/${item.img}" alt="${item.name}" class="img-thumbnail" style="max-width: 50px;">
        </div>
        <div class="col-2">
          <button class="btn btn-sm btn-secondary" id="btn-decrease-${item.id}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-secondary" id="btn-increase-${item.id}">+</button>
        </div>
        <div class="col-2">$${item.price}</div>
        <div class="col-1">
           <button class="btn btn-sm btn-danger" id="btn-remove-${item.id}">Xóa</button>
        </div>
      </div>
    `;
  });
  // Render nội dung vào container
  cartProductList.innerHTML = content;
  // Cập nhật tổng giá trị trong footer
  cartTotal.textContent = total.toFixed(0);
  cart.forEach((item) => {
    // Lấy các nút tương ứng cho mỗi sản phẩm
    const increaseButton = document.getElementById(`btn-increase-${item.id}`);
    const decreaseButton = document.getElementById(`btn-decrease-${item.id}`);
    const removeButton = document.getElementById(`btn-remove-${item.id}`);

    // Thêm sự kiện tăng số lượng
    if (increaseButton) {
      increaseButton.addEventListener("click", () => {
        increaseQuantity(item.id);
      });
    }

    // Thêm sự kiện giảm số lượng
    if (decreaseButton) {
      decreaseButton.addEventListener("click", () => {
        decreaseQuantity(item.id);
      });
    }

    // Thêm sự kiện xóa sản phẩm
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        removeFromCart(item.id);
      });
    }
  });
};
const setLocalStorage = () =>{
  const dataJSON = cart;
  const dataString = JSON.stringify(dataJSON);
  localStorage.setItem("PRODUCT-LIST",dataString)
}
const getLocalStorage = () =>{
  const dataString = localStorage.getItem("PRODUCT-LIST");
  if(!dataString) return;
  const dataJSON = JSON.parse(dataString);
  cart = dataJSON;
  renderCart()
};
getLocalStorage();
const decreaseQuantity = (productId) =>{
  const product = cart.find((item)=> item.id === productId)
  if(product){
    product.quantity -=1;
    if(product.quantity===0){
      cart = cart.filter((item)=> item.id !== productId);
    }
    renderCart();
  }
};
const increaseQuantity = (productId) => {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += 1;
    renderCart();
  }
};
/**
 * Remove Item
 */
const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  setLocalStorage();
  renderCart();
};
// Hàm để thêm sự kiện vào tất cả các nút
const addEventListeners = (data) => {
  // Thêm sự kiện cho các nút mua hàng
  const buttons = document.querySelectorAll(".btnPhone-shadow");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      const product = data.find((item) => item.id === productId);
      if (product) {
        addToCart(product);
      }
    });
  });
};
/**
 * Clear cart
 */
const clearCart = () => {
  // Đặt lại mảng giỏ hàng thành mảng rỗng
  cart = [];

  // Xóa giỏ hàng khỏi localStorage
  localStorage.removeItem("PRODUCT-LIST");

  // Render lại giỏ hàng (cập nhật UI)
  renderCart(cart);

  // Cập nhật lại số đếm giỏ hàng
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = "0";
  document.getElementsByClassName("btn-close")[0].click();
};

// Thêm sự kiện click vào nút Checkout
const checkoutButton = document.getElementById("checkout-btn");
if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    clearCart();  // Gọi hàm clearCart khi người dùng nhấn nút
  });
}
/**
 * Fetch Product
 */
const fetchListProduct = () => {
  const promise = axios({
    url: "https://67563d2e11ce847c992c3910.mockapi.io/api/Products",
    method: "GET",
  });

  promise
    .then((result) => {
      renderListProduct(result.data)
      // addEventListeners(result.data)
    })
    .catch((error) => {
      console.log(error);
    });
};
fetchListProduct();


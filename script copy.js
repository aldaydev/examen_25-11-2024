//Llamada automática a la API para cargar los productos
(async function getProducts(){
    try{
        let response = await fetch('https://fakestoreapi.com/products');
        //Si la solicitud falla, lanzamos un error
        if(!response.ok){
            throw 'Ha habido un problema para acceder a los productos';
        //Si todo está ok
        }else{
            //Convertimos los datos a json
            let data = await response.json();
            //Mostramos todos los productos
            showProducts(data);
            //Cargamos el carrito por si había algo en localStorage previamente
            loadCart();
        }
    }catch(error){
        alert(error);
    }
})();

//Mostramos los productos
function showProducts(products){
    //Seleccionamos la sección que incluirá los productos
    let productSection = document.querySelector('.productSection');
    //Si la sección no existía, la creamos
    if(!productSection){
        productSection = document.createElement('section');
        productSection.setAttribute('class', 'productSection');
        const main = document.getElementById('main');
        main.appendChild(productSection);
    }
    //Limpiamos la sección
    productSection.innerHTML = "";

    //Recorremos los productos y vamos pintando cada uno
    products.forEach(product=>{
        renderProduct(productSection, product, 'product');
    });
}

//Función para pintar cada producto
function renderProduct(section, data, type){

    //Creamos contenedor
    const productContainer = document.createElement('div');
    productContainer.classList.add('productContainer');
    section.appendChild(productContainer);

    //Creamos imagen
    const productImg = document.createElement('img');
    productImg.classList.add('productImg');
    productImg.setAttribute('src', data.image);
    productContainer.appendChild(productImg);

    //Creamos title
    const productTitle = document.createElement('h3');
    productTitle.classList.add('productTitle');
    productTitle.textContent = data.title;
    productContainer.appendChild(productTitle);

    //Creamos category
    const productCategory = document.createElement('span');
    productCategory.classList.add('productCategory');
    productCategory.textContent = `Category: ${data.category}`;
    productContainer.appendChild(productCategory);

    //Creamos id
    const productId = document.createElement('span');
    productId.classList.add('productId');
    productId.textContent = `ID: ${data.id}`;
    productContainer.appendChild(productId);

    //Creamos description
    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.textContent = data.description;
    productContainer.appendChild(productDescription);

    //Creamos precio
    const productPrice = document.createElement('p');
    productPrice.classList.add('productPrice');
    productPrice.textContent = `Price: ${data.price}€`;
    productContainer.appendChild(productPrice);

    //Creamos rating
    const productRating = document.createElement('p');
    productRating.classList.add('productRating');
    productRating.textContent = `Rate: ${data.rating.rate} / Count: ${data.rating.count}`;
    productContainer.appendChild(productRating);

    //Creamos CART Button
    const cartBtn = document.createElement('button');
    
    //Si el elemento se está creando para mostrarse como producto...
    if(type == 'product'){
        cartBtn.classList.add('cartBtn');
        //Al hacer click ejecutará "addToCart"
        cartBtn.addEventListener('click', ()=>{
            addToCart(data);
        })
        cartBtn.textContent = 'ADD TO CART';
    //Si el elemento se está creando para mostrarse en el carrito
    }else if (type == 'cart'){
        cartBtn.classList.add('deleteCartBtn');
        //Al hacer click ejecutará "deleteFromCart"
        cartBtn.addEventListener('click', ()=>{
            deleteFromCart(data, section, productContainer);
        })
        cartBtn.textContent = 'DELETE FROM CART';
    }
    productContainer.appendChild(cartBtn);
}

//Al añadir un producto al carrito
function addToCart(product){
    //Metemos la info del producto en localStorage
    localStorage[product.id] = JSON.stringify(product);
    //Actualizamos el carrito
    loadCart();
}

//Mostrar los elementos que haya en el carrito
function loadCart() {
    //Seleccionamos la sección del carrito
    let cartSection = document.querySelector('.cartSection');
    //Si la sección del carrito no existe, la creamos
    if(!cartSection){
        cartSection = document.createElement('section');
        cartSection.classList.add('cartSection');
    //Si la sección del carrito existe, la vaciamos
    }else{
        cartSection.innerHTML = '';
    }
    //Añadimos título a la sección del carrito
    const cartTitle = document.createElement('h2');
    cartTitle.classList.add('cartTitle');
    cartTitle.textContent = 'CART';
    cartSection.appendChild(cartTitle);

    //Recorremos localStorage con lo que haya en el carrito
    for (const key in localStorage) {
        //Si la clave es un número...
        if (!isNaN(key)) {
            const product = JSON.parse(localStorage.getItem(key));
            renderProduct(cartSection, product, 'cart');
            main.appendChild(cartSection);
        }
    }
}

//Borramos el contenedor con el producto de la sección
function deleteFromCart(data, section, container){
    localStorage.removeItem(data.id);
    console.log(section.children);
    //Si es el único producto que hay en el carrito, borramos la sección entera
    if(section.children.length == 2){
        const main = document.getElementById('main');
        main.removeChild(section);
    //Si hay más productos en el carrito, borramos el contenedor del que sea
    }else{
        section.removeChild(container);
    }
}









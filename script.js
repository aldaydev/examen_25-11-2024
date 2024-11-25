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
            //Si hay algo en localStorage (carrito), lo recuperamos
            if(localStorage.length > 0){
                loadCart();
            }
        }
    }catch(error){
        alert(error);
    }
})();

//Mostramos los productos
function showProducts(products){
    //Creamos la sección que tendrá los productos
    const productSection = document.createElement('section');
    productSection.setAttribute('class', 'productSection');
    //Metemos la sección en el main
    const main = document.getElementById('main');
    main.appendChild(productSection);

    //Recorremos los productos y vamos pintando cada uno
    products.forEach(product=>{
        renderProduct(productSection, product, 'product');
    });
}

//Función para pintar cada producto (vale tanto para productos como para el carrito)
function renderProduct(section, data, type){

    //Creamos contenedor
    const productContainer = document.createElement('div');
    if(type == 'cart'){
        productContainer.classList.add('productCartContainer');
    }else if( type == 'product'){
        productContainer.classList.add('productContainer');
    }
    section.appendChild(productContainer);

    //Creamos imagen
    const productImg = document.createElement('img');
    productImg.classList.add('productImg');
    productImg.setAttribute('src', data.image);
    productContainer.appendChild(productImg);

    //Creamos id
    const productId = document.createElement('span');
    productId.classList.add('productId');
    productId.textContent = `Product ID: ${data.id}`;
    productContainer.appendChild(productId);

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

    //Creamos description
    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.textContent = data.description;
    productContainer.appendChild(productDescription);

    //Creamos precio
    const productPrice = document.createElement('span');
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
    //Metemos la info del producto en localStorage (La clave será la ID del producto)
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
    const cartHeader = document.createElement('div');
    cartHeader.classList.add('cartHeader');
    cartSection.appendChild(cartHeader);
    const cartTitle = document.createElement('h2');
    cartTitle.classList.add('cartTitle');
    cartTitle.textContent = 'CART';
    cartHeader.appendChild(cartTitle);
    const buyBtn = document.createElement('button');
    buyBtn.classList.add('buyBtn');
    buyBtn.setAttribute('onclick', 'buyProducts()');
    buyBtn.textContent = 'BUY SELECTED';
    cartHeader.appendChild(buyBtn);

    //Añadimos la sección cart al main
    main.appendChild(cartSection);

    //Recorremos localStorage con lo que haya en el carrito
    for (const key in localStorage) {
        //Si la clave es un número (ya que cada clave es el ID del producto añadido)
        if (!isNaN(key)) {
            //Recogemos la data del producto que guardamos en localStorage
            const product = JSON.parse(localStorage.getItem(key));
            //Renderizamos el producto (con type 'cart' para asociarlo al carrito);
            renderProduct(cartSection, product, 'cart');
        }
    }
}

//Al borrar un elemento del carrito
function deleteFromCart(data, section, container){
    //Lo eliminamos de localStorage
    localStorage.removeItem(data.id);
    //Si es el único producto que hay en el carrito (más el título), borramos la sección entera
    if(section.children.length == 2){
        const main = document.getElementById('main');
        main.removeChild(section);
    //Si hay más productos en el carrito, borramos el contenedor del que sea
    }else{
        section.removeChild(container);
    }
}

//Si compramos los productos en el carrito
function buyProducts(){
    //Alerta de confirmación
    alert ('All products bought');
    //Limpiamos localStorage
    localStorage.clear();
    //Recargamos la página
    location.reload();
}







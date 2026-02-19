const API_URI = window.location.origin;

let favList = {};
let cart = JSON.parse(localStorage.getItem('cart')) || {};

function formatCurrency(priceCents){
    return (priceCents/100).toFixed(2);
}

// Mobile menu toggle
function toggleMobileMenu(){
    const navDropDown = document.getElementById('navDropDown');
    navDropDown.classList.toggle('open');
}

function getUsername() {
    const wtUser = localStorage.getItem('wt_user');
    if (!wtUser) return null;
    try {
        const parsed = JSON.parse(wtUser);
        return typeof parsed === 'string' ? parsed : (parsed.name || parsed.username || parsed);
    } catch (e) {
        return wtUser;
    }
}

function renderProducts(products){
    let innerHtml = "";
    
    if(!products || products.length === 0 || products == {}){
        // console.log("No products found");
        innerHtml = `
            <div class="no-fav-container">
                <div class="no-fav">
                    <img src="../assets/favourites-icon.png" alt="heart-img">
                    <h1>Your Favorites is Empty</h1>
                    <p>Start adding products you love!</p>
                    <a href="../index.html"><button class="shop-now-btn">Shop Now</button></a>
                </div>
            </div>
        `;
        document.querySelector(".js-favourites-body").innerHTML = innerHtml;
        return;
    }

    // Add title
    innerHtml += `<h1 class="fav-page-title">My Favorites</h1>`;
    
    products.forEach(product => {
            innerHtml += `
                <div class="browse-card js-card-${product._id}">
                    <div class="browse-card-img">
                        <a href="../product_pages/productSinglePage.html?id=${product._id}" style="cursor: pointer;">
                            <img src="${product.image[0]}" alt="${product.name}">
                        </a>
                    </div>
                    <div class="browse-card-information">
                        <div class="browse-card-information-area">
                            <div class="browse-card-information-area-text">
                                <p class="browse-card-information-text">${product.brandName}</p>
                                <p class="browse-card-information-text">${product.name}</p>
                                <p class="browse-card-information-text">Price: $<span class="browse-card-information-price">${formatCurrency(product.priceCents)}</span></p>
                            </div>
                        </div>
                        <button class="add-to-cart-button js-fav-remove" data-product-id="${product._id}">Remove from Favorites</button>
                        <button class="add-to-cart-button js-add-to-cart" data-product-id="${product._id}">Add To Cart</button>
                    </div>
                </div>
            `;
        });

    document.querySelector(".js-favourites-body").innerHTML = innerHtml;
    
    // Re-attach event listeners
    attachRemoveListeners();
    attachCartListeners();
    updateCounts();
}

function saveFavList(){
    // localStorage.setItem("favList", JSON.stringify(favList));
    if(Object.keys(favList).length == 0){
        renderProducts(Object.values(favList));
    }
    // Send to backend
    sendFavoritesToBackend();
}

function attachRemoveListeners() {
    document.querySelectorAll('.js-fav-remove').forEach(fav => {
        fav.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let productId = fav.dataset.productId;
            
            // Remove from favList
            delete favList[productId];
            
            // Update localStorage
            localStorage.setItem(`${productId}-fav-status`, 'unchecked');
            let favCount = parseInt(localStorage.getItem('favCount') || 0);
            favCount--;
            localStorage.setItem('favCount', favCount);
            
            saveFavList();
            
            // Re-render
            renderProducts(Object.values(favList));
        });
    });
}

function sendCartToBackend(cartToSend) {
    const username = getUsername();
    
    if (!username) {
        return false;
    }
    
    const cartItems = [];
    // console.log("cartToSend",cartToSend);
    Object.keys(cartToSend).forEach(cartKey => {
        const item = cartToSend[cartKey];
        // console.log('Cart item to send:', cartKey);
        // console.log("inside sendcart",item);
        cartItems.push({
            cartKey: cartKey,
            _id: item._id,
            name: item.name,
            image: item.image,
            brandName: item.brandName,
            about: item.about,
            priceCents: item.priceCents,
            keyword: item.keyword,
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize
        });
    });
    console.log("cartItems",cartItems);
    const payload = { username, items: cartItems };
    // console.log("payload",payload);
    fetch(`${API_URI}/api/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .catch(error => {
        console.error('Error syncing cart:', error);
    });
    
    return true;
}

function attachCartListeners() {
    document.querySelectorAll('.js-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let productId = button.dataset.productId;
            
            // Find product in favList
            let product = null;
            Object.values(favList).forEach(items => {
                items.forEach(item => {
                    if (item._id === productId) {
                        product = item;
                    }
                });
            });
            
            if (product) {
                // Add to cart
                if (!cart[productId]) {
                    cart[productId] = { ...product, quantity: 1 };
                } else {
                    cart[productId].quantity++;
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                
                sendCartToBackend(cart);

                // Update cart count
                let cartCount = parseInt(localStorage.getItem('cartCount') || 0);
                cartCount++;
                localStorage.setItem('cartCount', cartCount);
                
                // Visual feedback
                button.innerHTML = "Added";
                setTimeout(() => {
                    button.innerHTML = "Add To Cart";
                    button.style.backgroundColor = "";
                }, 1500);
                
                updateCounts();
            }
        });
    });
}

function updateCounts() {
    const favCountElement = document.querySelector('.js-favourites-count');
    const cartCountElement = document.querySelector('.js-cart-count');
    
    if (favCountElement) {
        favCountElement.textContent = localStorage.getItem('favCount') || 0;
    }
    if (cartCountElement) {
        cartCountElement.textContent = localStorage.getItem('cartCount') || 0;
    }
}

// Backend functions
async function sendFavoritesToBackend() {
    const username = getUsername();
    
    if (!username) {
        // console.log("No user logged in, skipping favorites save");
        return false;
    }
    
    const favItems = [];
    console.log(favList);
    for(let i in favList){
        item = favList[i];
        console.log(item);
        favItems.push({
            _id: item._id,
            name: item.name,
            image: item.image,
            brandName: item.brandName,
            about: item.about,
            priceCents: item.priceCents,
            keyword: item.keyword
        });
    };
    
    // console.log("Sending favorites to backend:", { username, itemCount: favItems });

    const payload = { username, items: favItems };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const url = `${API_URI}/api/favorites`;

    const ok = navigator.sendBeacon(url, blob);
    // console.log('sendBeacon returned', ok);
    return ok;
}

async function fetchFavoritesFromBackend() {
    const username = getUsername();
    
    if (!username) {
        // console.log("No user logged in, can't fetch favorites");
        return null;
    }

    try {
        const url = `${API_URI}/api/favorites/${username}`;
        // console.log("Fetching favorites from:", url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        if (!response.ok) {
            console.error('Failed to fetch favorites:', response.status);
            return null;
        }

        const data = await response.json();
        // console.log('Favorites fetched from backend:', data);
        return data.items || [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return null;
    }
}

function mergeFavoritesData(backendItems) {
    
    // const localFavList = JSON.parse(localStorage.getItem('favList')) || {};
    
    if (!backendItems || backendItems.length === 0) {
        // console.log('No backend favorites data, using local');
        renderProducts(false);
        return;
    }

    // Start with local favorites
    // favList = { ...localFavList };
    
    // Add backend items
    console.log('backend',backendItems);
    backendItems.forEach(item => {
        console.log(item);
        if (item._id && !favList[item._id]) {
            favList[item._id] = item;
            localStorage.setItem(`${item._id}-fav-status`, 'checked');
        }
    });

    console.log('Favorites after merge:', favList);

    // Save merged favorites
    localStorage.setItem('favList', JSON.stringify(favList));
    
    // Update count
    let favCount = 0;
    Object.keys(favList).forEach(key => {
        favCount++;
    });
    localStorage.setItem('favCount', favCount);
    
    // console.log('Favorites merged. Total items:', favCount);
    
    // Re-render
    renderProducts(Object.values(favList));
    
}

async function initializeFavorites() {
    const username = getUsername();
    
    if (username) {
        // console.log("User logged in:", username);
        // console.log("Fetching favorites from backend...");
        
        const backendItems = await fetchFavoritesFromBackend();
        console.log(backendItems);
        mergeFavoritesData(backendItems);
    } else {
        // console.log("No user logged in");
        console.log(JSON.parse(localStorage.getItem('favList')));
        List = JSON.parse(localStorage.getItem('favList')) || {};
        renderProducts(Object.values(List));
    }
    
    updateCounts();
}

// Initialize on load
window.addEventListener('load', initializeFavorites);

// Save on beforeunload
window.addEventListener('beforeunload', () => {
    sendFavoritesToBackend();
});

// Login token handling
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.get('login') === 'success'){
    localStorage.setItem('login-token', true);
    localStorage.setItem('wt_user', JSON.stringify({
        name: urlParams.get('wt_user'),
        email: urlParams.get('email')
    }));
    // console.log(JSON.parse(localStorage.getItem('wt_user')));
    document.querySelector(".login-token").href = "../user/user.html";
    document.querySelector(".login-token-info").innerHTML = "My Account";
}

if(localStorage.getItem('login-token') === 'true'){
    document.querySelector(".login-token").href = "../user/user.html";
    document.querySelector(".login-token-info").innerHTML = "My Account";
}
else{
    document.querySelector(".login-token").href = "../login.html";
    document.querySelector(".login-token-info").innerHTML = "Sign in/up";
}
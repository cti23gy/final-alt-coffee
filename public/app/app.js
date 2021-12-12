var loggedIn = false;

var CART = [
];

function route() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/", "");

    if(!pageID) { //default
        navToPage("home");
    } else if (pageID == "home") {
        navToPage("home");
    } else if (pageID == "cart") {
        loadCart();
        navToPage("cart");
    } else if (pageID == "loginfire") { //login buttons
        login();
        navToPage("loginpage");
    } else if (pageID == "signupfire") {
        createUser();
        navToPage("loginpage");
    } else if (pageID == "signoutfire") {
        signOut();
        navToPage("loginpage");
    } else if (pageID == "buynow") {
        //addToCart(); onclick happens first then this...
        navToPage("cart");
        if (loggedIn) {
            updateModal("cart");
        } else {
            updateModal("errorlogin");
        }
    } else if (pageID == "emptycart") {
        navToPage("cart");
        updateModal("dumpcart");
    }else {
        navToPage(pageID);
    }

    loadProducts();
}

function navToPage(pageName) {
    $.get(`pages/${pageName}/${pageName}.html`, function(data) {
        $("#app").html(data);
        if(loggedIn) {
            //style changes between versions
            $(".navlogin").css("display", "none");
            $(".navsignout").css("display", "block");
        } else {
            $(".navlogin").css("display", "block");
            $(".navsignout").css("display", "none");
        }
        if (CART.length != 0) {
            $("#number").css("display", "block");
            $("#number").html(CART.length);
        } else {
            $("#number").css("display", "none");
        }
        loadCart();
        loadProducts();
    });
}

////////////////////Firebase Code Start!

function initFirebase() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //user is signed in get information
            console.log("connected");

            firebase.auth().currentUser.updateProfile({
                //displayName: User.fullname,
            })
            .then(() => {
                // Update successful
                //updateSiteWithInfo();  //ADD UPDATE WITH SITE INFO FUNCTION!!!
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
            });  
            loggedIn = true;
            
            $(".navlogin").css("display", "none");
            $(".navsignout").css("display", "block");    
        } else {
            console.log("user is not there");
            loggedIn = false;

            $(".navlogin").css("display", "block");
            $(".navsignout").css("display", "none");
        }
        loadCart();
        loadProducts();
    });
}

function createUser() {
    let password = $("#c_password").val();
    let email = $("#c_email").val();
    let firstname = $("#c_firstname").val();
    let lastname = $("#c_lastname").val();

    

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log(user);
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // ..
        });
}

function login() {
    let password = $("#l_password").val();
    let email = $("#l_email").val();
    
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("signed in");
      updateModal("login");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("signed out");
        updateModal("signout");
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
}

////////////////////Firebase Code End!


function loadCart() { 
    $("#cartitem").empty();
        if (loggedIn == false) {
            $("#cartitem").append(`
            <h1>Y o u &nbsp; a r e &nbsp; n o t &nbsp; L o g g e d &nbsp; I n</h1>
            `);
        }
        else if (CART.length == 0) {
            $("#cartitem").append(`
            <h1>Y o u &nbsp; d o n ' t &nbsp; h a v e &nbsp; a n y &nbsp; i t e m s &nbsp; i n &nbsp; y o u r &nbsp; s h o p p i n g &nbsp; c a r t</h1>
            `);
        }  else {
        $.each(CART, function(index, item) {
            $("#cartitem").append(`
            <div class="cartblock">
            <img class="image" src="${item.image}"/>
            <div class="content">
                <h3>${item.name}</h3>
                <div class="saleblock"><h4>$${item.saleprice}</h4> <p>with Keurig Starter Set</p></div>
                <h4>$${item.price}</h4>
                <h5>★★★★★ ${item.scorereviews} | (${item.totalreviews})</h5>
                <div class="truck"><div class="truck-icon"></div><h5>Free Shipping</h5></div>
            </div>
            </div>
            `);
        });
        }
}

function loadProducts() {
    $("#product").empty();
    $.getJSON("data/data.json", function(items) {
        $.each(items.COFFEE_ITEMS, function(index, item) {
            $("#product").append(`
            <div class="itemblock">
                <img class="image" src="${item.image}"/>
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="saleblock"><h4>$${item.saleprice}</h4> <p>with Keurig Starter Set</p></div>
                    <h4>$${item.price}</h4>
                    <h5>★★★★★ ${item.scorereviews} | (${item.totalreviews})</h5>
                    <div class="truck"><div class="truck-icon"></div><h5>Free Shipping</h5></div>
                </div>
                <a href="#/buynow" class="buynow" onclick="addToCart(${index})">BUY NOW</a>
            </div>
            `);
        });
    })
    .fail(function(jqxhr, textStatus, error) {
        console.log(jqxhr);
        console.log(textStatus);
        console.log(error);
    });
}

function addToCart(curIndex) {
    if (loggedIn == true) {
    $.getJSON("data/data.json", function(items) {
        $.each(items.COFFEE_ITEMS, function(index, item) {
            if (index == curIndex) {
                CART.push({
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    saleprice: item.saleprice,
                    scorereviews: item.scorereviews,
                    totalreviews: item.totalreviews
                });
                console.log(CART);
            }
            
        });
    })
    .fail(function(jqxhr, textStatus, error) {
        console.log(jqxhr);
        console.log(textStatus);
        console.log(error);
    });
    } else {
        console.log("not logged in");
    }
}

function emptyCart() {
    CART = [];
    console.log(CART);
    navToPage("cart");
}

function updateModal(modal_code) {
    $("#modal").empty();
    if (modal_code == "login") {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Log In</h1>
            <p>You are now logged in!</p>
        </div>
        `);
    } else if (modal_code == "signout") {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Sign Out</h1>
            <p>You are now signed out!</p>
        </div>
        `);
    } else if (modal_code == "cart") {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Cart</h1>
            <p>Item added to Cart!</p>
        </div>
        `);
    } else if (modal_code == "dumpcart") {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Cart</h1>
            <p>Cart has been emptied!</p>
        </div>
        `);
    } else if (modal_code == "errorlogin") {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Please Log In</h1>
            <p>You are not logged in!</p>
        </div>
        `);
    } else {
        $("#modal").append(`
        <div class="modalblock">
            <h1>Notice</h1>
            <p>There is a Modal Error</p>
        </div>
        `);
    }
    $('#modal').css("display", "block");
}

function addModalListener() {
    $("#app").click(function(e){
        $('#modal').css("display", "none");
    });
}

function initListeners() {
    $(window).on("hashchange", route);
    route();
}

$(document).ready(function() {
    //navToPage("home");
    try {
        let app = firebase.app();
        initListeners();
        addModalListener();
        initFirebase();
    } catch {
        console.error(e);
    }
    
});
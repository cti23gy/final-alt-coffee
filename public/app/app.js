var loggedIn = false;

var USER_RECIPES = [
];

function route() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/", "");

    if(!pageID) { //default
        navToPage("home");
    } 
    else {
        navToPage(pageID);
    }
}

function navToPage(pageName) {
    $.get(`pages/${pageName}/${pageName}.html`, function(data) {
        $("#app").html(data);
        if(loggedIn) {
            //style changes between versions
        } else {
            
        }
        
    });
}

////////////////////Firebase Code Start!

function initFirebase() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //user is signed in get information
            console.log("connected");

            firebase.auth().currentUser.updateProfile({
                displayName: User.fullname,
            })
            .then(() => {
                // Update successful
                updateSiteWithInfo();
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
            });  
            loggedIn = true;
            //style changes go here for firebase login
        } else {
            console.log("user is not there");
            loggedIn = false;
            
        }
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
        console.log("signed out")
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
}

////////////////////Firebase Code End!

function initListeners() {
    $(window).on("hashchange", route);
    route();
}

$(document).ready(function() {
    //navToPage("home");
    try {
        let app = firebase.app();
        initListeners();
        initFirebase();
    } catch {
        console.error(e);
    }
    
});
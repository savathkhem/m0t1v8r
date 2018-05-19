// Initialize Firebase
var config = {
    apiKey: "AIzaSyByRhhek59x3vV1xPtrpXQkyk4yCmSkEC0",
    authDomain: "m0t1v8r-8155f.firebaseapp.com",
    databaseURL: "https://m0t1v8r-8155f.firebaseio.com",
    projectId: "m0t1v8r-8155f",
    storageBucket: "m0t1v8r-8155f.appspot.com",
    messagingSenderId: "251309343361"
};
firebase.initializeApp(config);

// // Create a variable to reference the database.
// var database = firebase.database();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var provider = new firebase.auth.FacebookAuthProvider();
var provider = new firebase.auth.TwitterAuthProvider();
var provider = new firebase.auth.GithubAuthProvider();

var uiConfig = {
    callbacks: {
        signInSuccess: function (currentUser, credential, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/users/user',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

window.onload = function () {
    document.querySelector('#sign-out').addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        firebase.auth().signOut();
    });
}



$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            console.log('id: '+uid)
            var providerData = user.providerData;
            console.log(displayName)
            $("#welcome").html("Welcome " + displayName + "!")
            getGoals(uid);
            //Create new goal click listener
            $("#submit-goal").on("click", function (event) {
                event.preventDefault();
                var goalObj = {
                    userId: uid,
                    goalName: $("#goal-name").val().trim()
                };
                newGoal(goalObj);
            });

            //Track Activity click listener
            $("#submit-activity").on("click", function (event) {
                event.preventDefault();
                var activityObj = {
                    userId: uid,
                    goalId: ""//from some data attribute in our html
                };
                logActivity(activityObj);
            });

            //Delete Goal click listener
            $(".delete-goal").on("click", function (event) {
                event.preventDefault();
                var goalId = $("#fake-id").val().trim();
                deleteGoal(goalId);
            });

            //Mark Complete Listener
            $(".mark-complete").on("click", function (event) {
                event.preventDefault();
                var id = "";//TBD Grab from oAuth...
                var completeObj = {
                    id: $("#fake-id").val().trim(),
                };

                markComplete(completeObj, id)
            })

            //Edit Goal Listener
            $(".edit-goal").on("click", function (event) {
                event.preventDefault();
                var id = "";//TBD Grab from oAuth...
                var goalObj = {
                    id: $("#fake-id").val().trim(),
                    goalName: $("#goal-name").val().trim()
                };

                updateGoal(goalObj, id);
            })




        } else {
            // User is signed out.
            // ...
            $("#welcome").html("You are Signed Out!")
        }
    });



    //****************   Click Listeners  **********************************//






    //************************** AJAX functions ******************************//

    //GET all Goals for a user after login:
    function getGoals(id) {
        console.log(id)
        $.get("/api/goals/"+id,)
            .then(function (data) {
                console.log(data)
                for (var i = 0; i < data.length; i++) {
                    $("#goals-go-here").append(`<li> Goal Id: ${data[i].id}    |   Goal: ${data[i].goalName} </li>`)
                }
            })
    }

    //POST function for new goals
    function newGoal(goalInfo) {
        $.post("/api/goals", goalInfo)
            .then(function (data) {
                console.log("New Goal:" + data);
                location.reload();
            })
    }

    //POST function for logging activity
    function logActivity(activity) {
        $.post("/api/tracking", activity)
            .then(function (data) {
                console.log("Track:" + data);
                location.reload();
            })
    }

    function deleteGoal(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/goals/" + id
        }).then(function (data) {
            console.log("Delete: " + data)
        })
    }

    function markComplete(complete, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/complete" + id,
            data: complete
        }).then(function (data) {
            console.log(data)
        })
    }

    function updateGoal(edit, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/" + id,
            data: edit
        }).then(function (data) {
            console.log(data)
        })
    }

    function loginUser() {
        $.ajax({
            method: "POST",
            url: "/login",
            data: "poop"
        })
    }

});



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
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

//Sign out button, MOVE THIS LATER!
window.onload = function () {
    document.querySelector('#sign-out').addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        firebase.auth().signOut();
    });
}


//Sets up jQuery, on DOM load
$(document).ready(function () {
    //Checks for login status, page renders data if logged in.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user)
            renderPage(user)
            //Create new goal click listener
        } else {
            // User is signed out.
            // ...
            $("#welcome").html("You are Signed Out!")
        }
    });


    //Our big fat render page function, uses 'user' object returned from Firebase Auth
    var renderPage = function (userObject) {
        //Populate page with user info
        $("#welcome").html("Welcome " + userObject.displayName + "!");
        //Retrieves goals from database
        getGoals(userObject.uid);

        //Click Listeners
        $(document).on("click", "#submit-goal", function (event) {
            event.preventDefault();
            var goalObj = {
                userId: userObject.uid,
                goalName: $("#goal-name").val().trim(),
                activity: $("#activity-name").val().trim(),
                reminderTime: $("#remind-me").val().trim(),
            };
            newGoal(goalObj);
        });
        //Track Activity click listener
        $(document).on("click",".submit-activity", function (event) {
            event.preventDefault();
            var activityObj = {
                goalId: $(this).data('id'),
                activityName: $(this).data('activity'),
            };
            console.log('activObj: '+ activityObj)
            logActivity(activityObj);
        });

        //Delete Goal click listener
        $(document).on("click", ".delete-goal", function (event) {
            console.log("delete click");
            event.preventDefault();
            var goalId = $(this).data('id');
            console.log('delete id: ' + goalId)
            deleteGoal(goalId);
        });

        //Mark Complete Listener
        $(document).on("click", ".mark-complete", function (event) {
            console.log("complete click");
            event.preventDefault();
            var id = "";//TBD Grab from oAuth...
            var completeObj = {
                id: $(this).data("id"),
            };
            markComplete(completeObj, id)
        })
        //Edit Goal Listener
        $(document).on("click", ".edit-goal", function (event) {
            event.preventDefault();
            var id = "";//TBD Grab from oAuth...
            var goalObj = {
                id: $(this).data("id"),
                goalName: $("#goal-name").val().trim()
            };
            updateGoal(goalObj, id);
        })
    }


    //************************** AJAX functions ******************************//

    //GET all Goals for a user after login:
    var getGoals = function (id) {
        console.log(id)
        $.get("/api/goals/"+id,)
            .then(function (data) {
                console.log(data)
                for (var i = 0; i < data.length; i++) {
                    var goalId = data[i].id
                    getCharts(goalId)
                    $("#goals-go-here").append(`
                    <li> Goal Id: ${data[i].id}    |   Goal: ${data[i].goalName} Complete: ${data[i].completed}
                    <button class = "submit-activity" data-id = "${data[i].id}" data-activity = "${data[i].activity}">Track It</button>
                    <button class = "delete-goal" data-id = "${data[i].id}">Delete</button>
                    <button class= "mark-complete" data-id = "${data[i].id}">Complete!</button>
                    </li>
                    `)
                }
            })
    }

    //POST function for new goals
    var newGoal = function (goalInfo) {
        $.post("/api/goals", goalInfo)
            .then(function (data) {
                console.log("New Goal:" + data);
                location.reload();
            })
    }

    //POST function for logging activity
    var logActivity = function (activity) {
        $.post("/api/goals/track", activity)
            .then(function (data) {
                console.log("Track:" + data);
                location.reload();
            })
    }

    var deleteGoal = function (id) {
        $.ajax({
            method: "DELETE",
            url: "/api/goals/" + id
        }).then(function (data) {
            console.log("Delete: " + data)
            location.reload();
        })
    }

    var markComplete = function (complete, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/complete" + id,
            data: complete
        }).then(function (data) {
            console.log(data)
            location.reload();
        })
    }

    var updateGoal = function (edit, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/" + id,
            data: edit
        }).then(function (data) {
            console.log(data)
            location.reload();
        })
    }

    var getCharts = function (id) {
        $.get("/api/activities/"+id,)
        .then(function (data) {
            console.log(data)

            for (i= 0; i < data.length; i++) {
                var m = data[i].createdAt
                console.log('created at: '+ m);
                var mon = moment(m).month();
                console.log('month: ' + mon)
                for (n= 0; n < graphData.length; n++){
                    if (mon == n) {
                        graphData[n]++;
                    }
                }
            }
            console.log('chartdata: ' + graphData)
            var ctx = $("#myChart");
            ctx.height = 100;
            var myChart = new Chart (ctx, {
                type: 'bar',
                type: 'line',
                data: {
                  labels: months,
                  datasets: [
                    { 
                      data: graphData
                    }
                  ]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Chart.js bar Chart'
                    },
                    animation: {
                        animateScale: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) { if (Number.isInteger(value)) { return value; } },
                                stepSize: 1
                            }
                        }]
                    }
                }
            })
        })
    }
});

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December']
var graphData = [0,0,0,0,0,0,0,0,0,0,0,0,]




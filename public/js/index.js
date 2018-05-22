// require("dotenv").config();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyByRhhek59x3vV1xPtrpXQkyk4yCmSkEC0",
    authDomain: "m0t1v8r-8155f.firebaseapp.com",
    databaseURL: "https://m0t1v8r-8155f.firebaseio.com",
    projectId: "m0t1v8r-8155f",
    storageBucket: "m0t1v8r-8155f.appspot.com",
    messagingSenderId: "251309343361"
    // apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
    // projectId: process.env.FIREBASE_PROJECT_ID,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
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
        setTimeout(function () {
            window.location.replace("/");
        }, 1000);
    });
};

//Sets up jQuery, on DOM load
$(document).ready(function () {
    //Checks for login status, page renders data if logged in.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user);
            renderPage(user);
            //Create new goal click listener
        } else {
            // User is signed out.
            // ...
            $("#welcome").html("You are Signed Out!");
        }
    });

    //Our big fat render page function, uses 'user' object returned from Firebase Auth
    var renderPage = function (userObject) {
        console.log('render page');
        //Check if user exists in db or not
        getUsers(userObject.uid);
        //Populate page with user info
        $("#welcome").html("Welcome " + userObject.displayName + "!");
        $("#user-pic").html(`<img style="width:70%" src= "${userObject.photoURL}">`);
        //Retrieves goals from database
        getGoals(userObject.uid);


        //Click Listeners

        //DROP DOWN FOR CHARTS
        $(document).on("click", ".dropchart", function (event) {
            event.preventDefault();
            var id = $(this).data('id');
            var name = $(this).data('name');
            getCharts(id, name);
        });


        //New User'
        $(document).on("click", "#submit-new-user", function (event) {
            event.preventDefault();
            console.log("submit!");
            var userObj = {
                userId: userObject.uid,
                name: $("#name").val().trim(),
                phoneNumber: $("#phoneNumber").val().trim(),
            };
            newUser(userObj);
        });

        //New Goal!
        $(document).on("click", "#submit-goal", function (event) {
            event.preventDefault();
            console.log("submit!");
            var goalObj = {
                userId: userObject.uid,
                goalName: $("#goal-name").val().trim(),
                activity: $("#activity-name").val().trim(),
                reminderTime: $("#remind-me").val().trim(),
                phoneNumber: userPhone
            };
            newGoal(goalObj);
        });
        //Track Activity click listener
        $(document).on("click", ".submit-activity", function (event) {
            event.preventDefault();
            var activityObj = {
                goalId: $(this).data('id'),
                activityName: $(this).data('activity'),
            };
            console.log('activObj: ' + activityObj);
            logActivity(activityObj);
        });

        //Delete Goal click listener
        $(document).on("click", ".delete-goal", function (event) {
            console.log("delete click");
            event.preventDefault();
            var goalId = $(this).data('id');
            console.log('delete id: ' + goalId);
            deleteGoal(goalId);
        });

        //Mark Complete Listener
        $(document).on("click", ".mark-complete", function (event) {
            console.log("complete click");
            event.preventDefault();
            var id = ""; //TBD Grab from oAuth...
            var completeObj = {
                id: $(this).data("id"),
            };
            markComplete(completeObj, id);
        });
        //Edit Goal Listener
        $(document).on("click", ".edit-goal", function (event) {
            event.preventDefault();
            var id = ""; //TBD Grab from oAuth...
            var goalObj = {
                id: $(this).data("id"),
                goalName: $("#goal-name").val().trim()
            };
            updateGoal(goalObj, id);
        });
    };

    //************************** AJAX functions ******************************//

    //Get Users
    var getUsers = function (id) {
        $.get("/api/users/" + (id))
            .then(function (data) {
                console.log(data);
                if (data.length === 0) {
                    console.log('create a new user!');
                    //Opens modal for user to input settings
                    $("#settings").modal();
                } else {
                    console.log('User exists!');
                    userPhone = data[0].phoneNumber;
                    console.log('user phone: ' + userPhone);
                }
            });
    };

    //GET all Goals for a user after login:
    var getGoals = function (id) {
        console.log(id);
        $.get("/api/goals/" + id)
            .then(function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    console.log([i] + ': for get goal: ' + data[i].goalName);
                    var goalId = data[i].id;
                    getCharts(data[0].id, data[0].goalName);
                    getDropDown(data[i]);
                    if (data[i].completed == 0) {
                        $("#goals-go-here").append(`
                        <li> Goal: ${data[i].goalName}
                        <button class = "btn btn-primary submit-activity" data-id = "${data[i].id}" data-activity = "${data[i].activity}" data-toggle="tooltip" data-placement="top" title="Track Your Goals"><i class="fas fa-search-plus"></i></button>
                        <button class= "btn btn-primary mark-complete" data-id = "${data[i].id}" data-toggle="tooltip" data-placement="top" title="Completed This Goal"><i class="fas fa-check-circle"></i></button>
                        <button class = "btn btn-primary delete-goal" data-id = "${data[i].id}" data-toggle="tooltip" data-placement="top" title="Delete This Goal"><i class="fas fa-trash-alt"></i></button>
                        </li>
                        `);
                    } else if (data[i].completed == 1) {
                        $("#completed-go-here").append(`
                        <li> Goal: ${data[i].goalName}
                        <button class = "btn btn-success submit-activity" data-id = "${data[i].id}" data-activity = "${data[i].activity}" data-toggle="tooltip" data-placement="top" title="Track Your Goals"><i class="fas fa-search-plus"></i></button>
                        <button class = "btn btn-success delete-goal" data-id = "${data[i].id}" data-toggle="tooltip" data-placement="top" title="Delete This Goal"><i class="fas fa-trash-alt"></i></button>
                        </li>
                        `);
                    }
                }
            });
    };

    //POST function for new user
    var newUser = function (newUserObj) {
        $.post('/api/users', newUserObj)
            .then(function (data) {
                location.reload();
            });
    };

    //GET all Drop Down for a user after login:
    var getDropDown = function (data) {
        // for (var i = 0; i < data.length; i++) {
        console.log(data);
        // var goalId = data.id;
        $("#dropdowns-go-here").append(`
                <a class="dropdown-item text-danger dropchart" data-id="${data.id} "data-name= "${data.goalName}" ref="myCharts${data.id}">Goal: ${data.goalName}</a>
            `);
        // getCharts(data);
        // }
    };


    //POST function for new goals
    var newGoal = function (goalInfo) {
        console.log("ajax: POST NEW GOAL");
        $.post("/api/goals", goalInfo)
            .then(function (data) {
                console.log("New Goal:" + data);
                location.reload();
            });
    };

    //POST function for logging activity
    var logActivity = function (activity) {
        $.post("/api/goals/track", activity)
            .then(function (data) {
                console.log("Track:" + data);
                location.reload();
            });
    };

    var deleteGoal = function (id) {
        $.ajax({
            method: "DELETE",
            url: "/api/goals/" + id
        }).then(function (data) {
            console.log("Delete: " + data);
            location.reload();
        });
    };

    var markComplete = function (complete, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/complete" + id,
            data: complete
        }).then(function (data) {
            console.log(data);
            location.reload();
        });
    };

    var updateGoal = function (edit, id) {
        $.ajax({
            method: "PUT",
            url: "/api/goals/" + id,
            data: edit
        }).then(function (data) {
            console.log(data);
            location.reload();

        });
    };
    var getCharts = function (goalId, goalName) {
        $("#charts-go-here").html(`<canvas id="myChart${goalId}" width="400" height="200"></canvas>`)
        $.get("/api/activities/" + goalId)
            .then(function (data) {
                console.log("get charts:");
                console.log(data);
                //chartData will hold our chart's datasets
                var chartData = [];
                //Starting values for data array:
                var graphData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
                for (i = 0; i < data.length; i++) {
                    var m = data[i].createdAt;
                    console.log('created at: ' + m);
                    var mon = moment(m).month();
                    console.log('month: ' + mon);
                    for (n = 0; n < graphData.length; n++) {
                        if (mon == n) {
                            graphData[n]++;
                        }
                    }
                }

                console.log('chartdata: ' + graphData);
                var ctx = document.getElementById('myChart' + goalId);
                // var ctx = $('#myChart' + goalId);
                console.log(ctx)
                // ctx.height = 200;
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            data: graphData,
                            label: goalName,
                            borderColor: "#18ce0f",
                            backgroundColor: "#b5d0fc",
                            //   pointBorderColor: "#FFF",
                            pointBackgroundColor: "#18ce0f",
                            pointBorderWidth: 2,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 1,
                            //   pointRadius: 4,
                            fill: true,
                        }]
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Activity Log'
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Activity Log'
                            },
                            animation: {
                                animateScale: true
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        callback: function (value) {
                                            if (Number.isInteger(value)) {
                                                return value;
                                            }
                                        },
                                    },
                                }]
                            }
                        }
                    }
                });
            });

    };

});
var userPhone = "";
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var lineColors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',];

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
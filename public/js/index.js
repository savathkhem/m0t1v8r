$(document).ready(function () {
    //****************   Click Listeners  **********************************//

    //Create new goal click listener
    $("#submit-goal").on("click", function (event) {
        event.preventDefault();
        var goalObj = {
            UserId: $("#fake-id").val().trim(),//will change later to oAuth!
            goalName: $("#goal-name").val().trim()
        };

        newGoal(goalObj);
    });

    //Track Activity click listener
    $("#submit-activity").on("click", function (event) {
        event.preventDefault();
        var activityObj = {
            UserId: "",//From oAuth
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


    //************************** AJAX functions ******************************//

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

});
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

  // Create a variable to reference the database.
  var database = firebase.database();


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
    signInSuccessUrl: 'index.html',
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

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
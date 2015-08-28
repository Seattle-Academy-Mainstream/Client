function SignoutUser(Callback)
{
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () 
  {
    console.log('User signed out.');
    Callback();
  });
}

function onSignIn(googleUser) 
{
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());

  var id_token = googleUser.getAuthResponse().id_token;

  Cookies.set("token", id_token, {expires: 100});

  SignoutUser(function()
  {
    window.location = "index.html";
  });
}
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
  var id_token = googleUser.getAuthResponse().id_token;

  Cookies.set("username", profile.getEmail(), {expires: 100});
  Cookies.set("token", id_token, {expires: 100});

  SignoutUser(function()
  {
    window.location = "index.html";
  });
}
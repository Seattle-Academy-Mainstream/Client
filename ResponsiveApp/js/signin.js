var googleUser = {};

function AttachSignin(element)
{
  auth2.attachClickHandler(element, {},
    //when the button is clicked
    function(googleUser) 
    {
      var Token = googleUser.getAuthResponse().id_token;
      var Email = googleUser.getBasicProfile().getEmail();

      Cookies.set("email", Email, {expires: 100});
      Cookies.set("token", Token, {expires: 100});

      if(Email.indexOf("@seattleacademy.org" == -1))
      {
        SignoutUser(function()
        {
          alert("Not a Seattle Academy email address. Please Login again.");
        });
      }
    }, 
    function(error) 
    {
      alert(JSON.stringify(error, undefined, 2));
    });
}

$(document).ready(function()
{
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '533332380921-7m8eoi4968kvl1mmr0kk3clco25loemg.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
    });
    AttachSignin(document.getElementById('log-in'));
  });
});

function SignoutUser(Callback)
{
  auth2.signOut().then(function () 
  {
    Callback();
  });
}
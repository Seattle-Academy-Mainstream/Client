var googleUser = {};

function AttachSignin(element) {
  console.log("attached");

  auth2.attachClickHandler(element, {},
    function(googleUser) 
    {
      console.log(googleUser.getBasicProfile().getName());
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
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    AttachSignin(document.getElementById('log-in'));
  });
});
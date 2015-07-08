function onSignInCallback(resp) 
{
  gapi.client.load('plus','v1', function()
  {
    gapi.client.plus.people.get({'userId':'me'}).execute(
    function(resp)
    {
      //get and format the username from google
      Username = resp.emails[0].value;
      Username = Username.replace("@seattleacademy.org", "");

      //show the correct things
      $(".logged-out").fadeOut(0);
      $(".logged-in").show(0);
      $(".home").show(0);
      $(".logged-in-text").html(Username + " Logged In");

      //layout the posts
      //$('#Posts').masonry( 'layout');

      //initialize the connection to the server
      InitializeServer();
    });          
  });
}
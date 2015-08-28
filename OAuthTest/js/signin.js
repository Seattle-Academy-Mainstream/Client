function SignIn(resp) 
{
  gapi.client.load('plus','v1', function()
  {
    gapi.client.plus.people.get({'userId':'me'}).execute(
    function(resp)
    {
      $.cookie("username", resp.emails[0].value, {expires: 100});

      window.location = "index.html";
      //Username = Username.replace("@seattleacademy.org", "");

      //console.log(Username);

      //console.log(JSON.stringify(resp));
    });          
  });
}
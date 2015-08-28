function SignIn(resp) 
{
  gapi.client.load('plus','v1', function()
  {
    gapi.client.plus.people.get({'userId':'me'}).execute(
    function(resp)
    {
      Cookies.set("username", resp.emails[0].value, {expires: 100});

      window.location = "index.html";
    });          
  });
}
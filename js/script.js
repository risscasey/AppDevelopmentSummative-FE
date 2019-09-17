console.log('js has loaded');
$.ajax({
    url: './config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys){
        url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
    },
    error: function(){
        console.log('cannot find config.json file, cannot run application');
    }
});

$('#register').click(function() {
  event.preventDefault();
  console.log('button clicked');

  let fName = $('#fName').val();
  let username = $('#username').val();
  let password = $('#password').val();
  let email = $('#email').val();
  $.ajax({
    url: `${url}/users`,
    type: 'POST',
    data: {
      fullName: fName,
      username: username,
      password: password,
      email: email
    },
    success:function(result){
      console.log(result);
    },
    error: function(err) {
      console.log(err);
    }
  })
});

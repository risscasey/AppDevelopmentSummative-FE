$(document).ready(function() {
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

    let fName = $('fName').val();
    let username = $('username').val();
    let password = $('password').val();
  });
});

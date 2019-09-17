$.ajax({
    url: './config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys){
        url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
        console.log(url);
        getListingData();
    },
    error: function(){
        console.log('cannot find config.json file, cannot run application');
    }
});

$('#register').click(function() {
  event.preventDefault();
  console.log('button clicked');

  let username = $('#username').val();
  let password = $('#password').val();
  let email = $('#email').val();
  $.ajax({
    url: `${url}/users`,
    type: 'POST',
    data: {
      username: username,
      password: password,
      email: email
    },
    success:function(result){
      console.log(result);
    },
    error: function(err) {
      console.log(`${url}/users`);
      console.log(err);
      console.log('something went wrong with registering user');
    }
  });
});

// Annie codes untill here

$('#addListing').click(function() {
  event.preventDefault();
  $('#addlistingForm').removeClass('d-none');
});

getListingData = () => {
  $.ajax({
    url: `${url}/allListings`,
    type: 'GET',
    dataType: 'json',
    success:function(result){
      console.log(result);
      $('#listingDisplay').empty();

      for (var i = 0; i < result.length; i++) {
        $('#listingDisplay').append(`
          <div id="listingCard" class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
              <div class="card-body">
                <h5 class="card-title">${result[i].itemName}</h5>
                <p class="card-text">${result[i].itemDescription}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                  </div>
                  <small class="text-muted">${result[i].itemPrice}</small>
                </div>
              </div>
            </div>
          </div>
        `);
      }
    },
    error: function(err){
      console.log(err);
      console.log('something went wrong with getting all the products');
    }
  })
}

$('#subitNewListing').click(function(){
  let itemName = $('#itemName').val();
  let itemPrice = $('#itemPrice').val();
  let itemDescription = $('#itemDescription').val();

  let newListing = itemName + ' $' + itemPrice + ' ' + itemDescription;
  console.log(newListing);

  $.ajax({
    url: `${url}/listing`,
    type: 'POST',
    data: {
      itemName: itemName,
      itemPrice: itemPrice,
      itemDescription: itemDescription
    },
    success:function(result){
      console.log(result);
      $('#itemName').val(null);
      $('#itemPrice').val(null);
      $('#itemDescription').val(null);
      $('#itemSeller').val(null);
    },
    error: function(error){
      console.log(error);
      console.log('something went wrong with sending the data');
    }
  })
});

// Larissa codes untill here








// Katherine codes untill here

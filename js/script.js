$.ajax({
    url: './config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys) {
        url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
        console.log(url);
        getListingData();
    },
    error: function() {
        console.log('Cant connect to server, need the config file');
    }
});

if(sessionStorage['userName']) {
    console.log('you are logged in ');
    $('#login').hide();
    $('#logout').removeClass('d-none');
} else {
    console.log('please sign in');
}

console.log(sessionStorage);

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

$('#login').click(function() {
  let username = $('#lUsername').val();
  let password = $('#lPassword').val();

  console.log(username);
  console.log(password);

  $.ajax({
    url: `${url}/userLogin`,
    type: 'POST',
    data: {
      username: username,
      password: password
    },
    success:function(result) {
      if (result === 'invalid user') {
        console.log('Sorry, we couldn\'t find a user with that username.' );
      } else if (result === 'invalid password') {
        console.log('Incorrect password');
      } else {
        console.log('Login successful');

        sessionStorage.setItem('userID', result['_id']);
        sessionStorage.setItem('userName', result['username']);
        console.log(sessionStorage);

        $('#login').hide();
        $('#logout').removeClass('d-none');
      }
    },
    error: function(err) {
      console.log(err);
      console.log('Couldn\'t log you in');
    }
  });
});

$('#logout').click(function() {

    if(!sessionStorage['userID']) {
        console.log('You don\'t have permission to access. Please sign in.');
        return;
    }
    console.log('logout successful');
    sessionStorage.clear();
    $('#login').show();
    $('#logout').addClass('d-none');
});

$('#listingDisplay').on('click', '.deleteBtn', function() {
  if(!sessionStorage['userID']) {
      console.log('You don\'t have permission to delete this item. Please sign in.');
      return;
  }
  event.preventDefault();
  console.log('Ready to be deleted');

  const id = $(this).parent().parent().parent().data('id');
  console.log(id);
  const selected = $(this).parent().parent().parent().parent();

  $.ajax({
    url: `${url}/listing/${id}`,
    type: 'DELETE',
    data: {
        userId: sessionStorage['userID']
    },
    success:function(result){
      selected.remove();
    },
    error:function(err) {
      console.log(err);
      console.log('something went wrong deleting the product');
    }
  });

});

// Annie codes untill here

$('#addListing').click(function() {
  if(!sessionStorage['userID']) {
      console.log('You don\'t have permission to add an item. Please sign in.');
      return;
  }
  event.preventDefault();
  $('#addlistingForm').removeClass('d-none');
});

getListingData = () => {
  $.ajax({
    url: `http://192.168.33.10:3000/allListings`,
    type: 'GET',
    success:function(result){
      $('#listingDisplay').empty();
      for (var i = 0; i < result.length; i++) {
        $('#listingDisplay').append(`
          <div id="listingCard" class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
              <div class="card-body" data-id="${result[i]._id}">
                <h5 class="card-title">${result[i].itemName}</h5>
                <p class="card-text">${result[i].itemDescription}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">

                    <button id="editListing" type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    <button id="deleteListing" type="button" class="btn btn-sm btn-outline-secondary deleteBtn">Delete</button>

                  </div>
                  <small class="text-muted">$${result[i].itemPrice}</small>
                </div>
              </div>
            </div>
          </div>
        `);
      };
    },
    error: function(err){
      console.log(err);
      console.log('something went wrong with getting all the products');
    }
  })
}

$('#subitNewListing').click(function() {
  if(!sessionStorage['userID']) {
      console.log('You don\'t have permission to add an item. Please sign in.');
      return;
  }
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
  });
});

$('#listingDisplay').on('click', '#editListing', function() {
  event.preventDefault();

  const id = $(this).parent().parent().parent().data('id');
  console.log(id);

  // $('#listingCard').empty();
  $('#listingDisplay').append(`
    <div id="addlistingForm" class="d-none mt-4">

    </div>




    <div id="listingCard" class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
        <div class="card-body" data-id="${result[i]._id}">
          <div class="form-group">
            <label for="editedName">Item Name</label>
            <input type="text" name="editedName" id="editedName" class="form-control">
          </div>

          <div class="form-group">
            <label for="editedPrice">Item Price</label>
            <input type="number" name="editedPrice" id="editedPrice" class="form-control">
          </div>

          <div class="form-group">
            <label for="editedDescription">Item Description</label>
            <textarea type="text" name="editedDescription" id="editedDescription" rows="3" class="form-control"></textarea>
          </div>

          <div class="mt-3">
            <button id="editNewListing" type="button" class="btn btn-success">Edit Listing</button>
          </div>
        </div>
      </div>
    </div>




  `);


  // $.ajax({
  //   url: `${url}/updateListing/${id}`,
  //   type: 'get',
  //   // data: {
  //   //   userId: sessionStorage['userID']
  //   // },
  //   dataType: 'json',
  //   success:function(product){
  //     console.log(product);
  //     // if(product == '401'){
  //     //   alert('401 UNAUTHORIZED');
  //     // } else {
  //     //   // replace the input fields with the name and price from the database
  //     //   $('#productName').val(product['name']);
  //     //   $('#productPrice').val(product['price']);
  //     //   // we have a hidden input field which we need to give it the value of the products id
  //     //   $('#productID').val(product['_id']);
  //     //   // Change the buttons text to edit and add the warning class
  //     //   $('#addProductButton').text('Edit Product').addClass('btn-warning');
  //     //   // Change the heading text
  //     //   $('#heading').text('Edit Product');
  //     //   // set the global variable of editing to true
  //     //   editing = true;
  //     // }
  //   },
  //   error:function(err){
  //     console.log(err);
  //     console.log('something went wrong with getting the single product');
  //   }
  // })
});


// Larissa codes untill here

$('#submitForm').click(function(){
  event.preventDefault();

  let commentArea = $('#comments').val();

  $.ajax({
    url: `${url}/sendComments`,
    type: 'POST',
    data: {
      commentDescription: commentArea
    },
    success:function(result){
      console.log(result);
      $('#comments').val(null);
      $('#commentsDisplay').append(`
        <div id="commentsCard" class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <p class="card-text">${result.commentDescription}</p>
              </div>
          </div>
        </div>
      `);
    },
    error: function(error){
      console.log(error);
      console.log('something went wrong with sending the data');
    }
  });
});
// Katherine codes until here

// Annies code continued
$('#submitResponse').click(function(){
  event.preventDefault();

  let responseArea = $('#responses').val();

  $.ajax({
    url: `${url}/sendResponse`,
    type: 'POST',
    data: {
      responceDescription: responseArea
    },
    success:function(result){
      console.log(result);
      $('#commentsDisplay').append(`
        <div id="commentsCard" class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <p class="card-text">${result.responceDescription}</p>
              </div>
          </div>
        </div>
      `);
    },
    error: function(error){
      console.log(error);
      console.log('something went wrong with sending the data');
    }
  });
});

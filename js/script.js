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

$('#login').click(function() {
  let lUsername = $('#lUsername').val();
  let lPassword = $('#lPassword').val();

  console.log(lUsername);
  console.log(lPassword);

  $.ajax({
    url: `${url}/getUser`,
    type: 'POST',
    data: {
      username: username,
      password: password
    },
    success:function(result) {
      sessionStorage.setItem('userID', result['_id']);
      sessionStorage.setItem('userName', result['username']);
      sessionStorage.setItem('userEmail', result['email']);

      console.log(sessionStorage);
    },
    error: function(err) {
      console.log(err);
      console.log('Couldn\'t log you in');
    }
  });
});

// if (sessionStorage['username']) {
//   console.log('You have logged in successfully');
// } else {
//   console.log('Please sign in');
// }

// Annie codes untill here

$('#addListing').click(function() {
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
              <div class="card-body">
                <h5 class="card-title">${result[i].itemName}</h5>
                <p class="card-text">${result[i].itemDescription}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button id="editListing" type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    <button id="deleteListing" type="button" class="btn btn-sm btn-outline-secondary">Delete</button>
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





let editing = false;

$('#addListing').click(function(){
  event.preventDefault();

  let itemName = $('#itemName').val();
  let itemPrice = $('#itemPrice').val();
  let itemDescription = $('#itemDescription').val();

  let newListing = itemName + ' $' + itemPrice + ' ' + itemDescription;
  console.log(newListing);

  if (itemName.length === 0){
      console.log('please enter an Item Name');
  } else if (itemPrice.length === 0){
    console.log('please enter the Items Price');
  } else if (itemDescription.length === 0) {
    console.log('please enter the Items Description');
  } else {

    if(editing === true){
        // const id = $('#productID').val();

      $.ajax({
        url: `${url}/product/${id}`,
        type: 'PATCH',
        data: {
          itemName: itemName,
          itemPrice: itemPrice,
          itemDescription: itemDescription
        },
        success:function(result){
          console.log('clicked');
        },
        error: function(err){
            console.log(err);
            console.log('something went wront with editing the product');
        }
      });

    } else {
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
                  <div class="card-body">
                    <h5 class="card-title">${result[i].itemName}</h5>
                    <p class="card-text">${result[i].itemDescription}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button id="editListing" type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                        <button id="deleteListing" type="button" class="btn btn-sm btn-outline-secondary">Delete</button>
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
  }
})








// 
// $('#itemName').val(null);
// $('#itemPrice').val(null);
// $('#itemDescription').val(null);

// $('#listingCard').empty();
// for (var i = 0; i < result.length; i++) {
//   $('#listingDisplay').append(`
//     <div id="listingCard" class="col-md-4">
//     <div id="addlistingForm" class="d-none mt-4">
//       <div class="form-group">
//           <label for="itemName">Item Name</label>
//           <input type="text" name="itemName" id="itemName" class="form-control">
//       </div>
//       <div class="form-group">
//           <label for="itemPrice">Item Price</label>
//           <input type="number" name="itemPrice" id="itemPrice" class="form-control">
//       </div>
//       <div class="form-group">
//           <label for="itemDescription">Item Description</label>
//           <textarea type="text" name="itemDescription" id="itemDescription" rows="3" class="form-control"></textarea>
//       </div>
//       <div class="form-group">
//           <label for="itemCategory">Item Category</label>
//           <input type="text" name="category" id="itemCategory" class="form-control">
//       </div>
//       <div class="mt-3">
//           <button id="subitNewListing" type="button" class="btn btn-success">Submmit Listing</button>
//       </div>
//     </div>
//   `);
// };
//
// editing = false;
// // We need to change the value of the single product we just edited.
// // Get all of the products, all of the li's should have a class of productItem
// const allProducts = $('.productItem');
// // Loop over each of those items
// allProducts.each(function(){
//     // check to see if the data-id value of that li matches the id which we are editing
//     if($(this).data('id') === id){
//         // find the span which holds the name of the product and change it
//         $(this).find('.productName').text(productName);
//         // stop the each function
//         return false;
//     }
// });

// Larissa codes untill here








// Katherine codes untill here

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

// if(sessionStorage.userName) {
//     console.log('you are logged in ');
//     $('#login').hide();
//     // $('#logout').removeClass('d-none');
// } else {
//     console.log('please sign in');
// }

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
        $('#rego').addClass('d-none');
        $('#signIn').removeClass('d-none');
    },
    error: function(err) {
      console.log(`${url}/users`);
      console.log(err);
      console.log('something went wrong with registering user');
    }
  });
});

let seller;

$('#login').click(function() {
  let username = $('#lUsername').val();
  let password = $('#lPassword').val();

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

        sessionStorage.setItem('userID', result._id);
        sessionStorage.setItem('userName', result.username);

        seller = sessionStorage['userName'];
        console.log(sessionStorage);

        $('#lUsername').val(null);
        $('#lPassword').val(null);

        $('#login').addClass('d-none');
        $('#index').removeClass('d-none');
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

$('.listingDisplay').on('click', '.deleteBtn', function() {
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

let currentCardId;

getListingData = () => {
  $.ajax({
    url: `${url}/allListings`,
    type: 'GET',
    success:function(result) {
      // console.log(result[0]._id);
      // $('.listingDisplay').empty();

      for (var i = 0; i < result.length; i++) {
        $('.listingDisplay').append(`
          <div class="card cardListStyle mb-4 listingCard" data-toggle="modal" data-target="#listingModel" data-id="${result[i]._id}">
            <div>
              <img class="listingsImg" src="${url}/${result[i].itemImage}" class="card-img-top">
            </div>
            <div class="card-body d-flex justify-content-between flex-row">
              <div class="col-9">
                <h6 class="card-title">${result[i].itemName}</h6>
              </div>
              <div class="col-3 border-left">
                <small class="text-muted pl-2">$${result[i].itemPrice}</small>
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
  });
};

getCommentData = () => {
  $.ajax({
    url: `${url}/allComments`,
    type: 'GET',
    success:function(commentsResult){
      for (var i = 0; i < commentsResult.length; i++) {
        if (commentsResult[i].commentID === currentCardId) {
          $('#comments').val(null);
          $('#commentsDisplay').empty();
          $('#commentsDisplay').append(`
            <div id="commentsCard" class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <div class="card-body" id="commentBody">
                  <p class="card-text">${commentsResult[i].commentDescription}</p>
                  </div>
              </div>
            </div>
          `);
        } else {
          console.log('id no match');
        }
      }
    },
    error: function(err){
      console.log(err);
      console.log('something went wrong with getting all the products');
    }
  });
};

$('#submitForm').click(function(){
  event.preventDefault();
  console.log(currentCardId);

  if(!sessionStorage.userID) {
    $('#comments').val(null);
    $('#myModal').modal('hide')
    $('#invalidModal').modal('show')
  } else {
    let commentIdFromCard = currentCardId;
    let commentArea = $('#comments').val();

    $.ajax({
      url: `${url}/sendComments`,
      type: 'POST',
      data: {
        commentDescription: commentArea,
        commentID:commentIdFromCard
      },
      success:function(result){
        console.log(result);
        $('#comments').val(null);
        getCommentData();
        $('#commentsDisplay').append(`
          <div id="commentsCard" class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <div class="card-body" id="commentBody">
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
  }
});



$('.listingDisplay').on('click', '.listingCard', function(listingNumber){
  event.preventDefault();

  currentCardId = $(this).data('id');
  // console.log(this);
  // console.log(cardId);

  $.ajax({
    url: `${url}/listing/${currentCardId}`,
    type: 'GET',
    dataType: 'json',
    success:function(result){
      $('#myModal').modal('show')

      $('#listingImage').empty();
      $('#resultName').empty();
      $('#listingCardDescription').empty();
      $('#resultPrice').empty();
      $('#resultSeller').empty();

      $('#listingImage').append(`<img src="${url}/${result.itemImage}" class="card-img-top" style="width: 100%">`);
      $('#resultName').append(`${result.itemName}`);
      $('#resultPrice').append(`$${result.itemPrice}`);
      $('#resultSeller').append(seller);

      getCommentData();
    },
    error:function(err){
        console.log(err);
        console.log('something went wrong with getting the single product');
    }
  });
});

$('#addNewListing').click(function() {
  event.preventDefault();
  if(!sessionStorage.userID) {
    $('#invalidModal').modal('show')
  } else {
    $('#addLisingModal').modal('show')
    $('#itemSeller').val(seller)
    console.log(seller);
  }
});

$('#itemImage').change(function(e){
        console.log(e.target.files.length);
        if(e.target.files.length > 0){
            const fileName = e.target.files[0].name;
            $(this).next('.custom-file-label').html(fileName);
        }
    });

$('#subitNewListing').click(function() {

  let itemName = $('#itemName').val();
  let itemPrice = $('#itemPrice').val();
  let itemDescription = $('#itemDescription').val();
  let itemImage = $('#itemImage').val();
  let itemSeller = $('#itemSeller').val();
  let fd = new FormData();

  const file = $('#itemImage')[0].files[0];
  fd.append('uploadImage', file);
  fd.append('itemName', itemName);
  fd.append('itemPrice', itemPrice);
  fd.append('itemImage', itemImage);
  fd.append('itemSeller', itemSeller);

  // let newListing = itemName + ' $' + itemPrice + ' ' + itemDescription + ' ' + fd;
  // console.log(newListing);

  $.ajax({
    url: `${url}/listing`,
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    success:function(result){
      console.log(result);
      $('#addLisingModal').modal('hide')

      $('.listingDisplay').append(`
        <div class="card cardListStyle mb-4 listingCard" data-toggle="modal" data-target="#listingModel" data-id="${result._id}">
          <img class="listingsImg" src="${url}/${result.itemImage}" class="card-img-top" alt="...">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="col-9">
              <h6 class="card-title">${result.itemName}</h6>
            </div>
            <div class="col-3 border-left">
              <small class="text-muted">$${result.itemPrice}</small>
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

// $('.listingDisplay').on('click', '#editListing', function() {
//   event.preventDefault();
//
//   if(!sessionStorage.userID) {
//     $('#userListingButtons').addClass('d-none');
//   }
//
//   const id = $(this).parent().parent().parent().data('id');
//   console.log(id);
//
//   // $('#listingCard').empty();
//   $('#listingDisplay').append(`
//     <div id="addlistingForm" class="d-none mt-4">
//
//     </div>
//
//     <div id="listingCard" class="col-md-4">
//       <div class="card mb-4 shadow-sm">
//         <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/></svg>
//         <div class="card-body" data-id="${result[i]._id}">
//           <div class="form-group">
//             <label for="editedName">Item Name</label>
//             <input type="text" name="editedName" id="editedName" class="form-control">
//           </div>
//
//           <div class="form-group">
//             <label for="editedPrice">Item Price</label>
//             <input type="number" name="editedPrice" id="editedPrice" class="form-control">
//           </div>
//
//           <div class="form-group">
//             <label for="editedDescription">Item Description</label>
//             <textarea type="text" name="editedDescription" id="editedDescription" rows="3" class="form-control"></textarea>
//           </div>
//
//           <div class="mt-3">
//             <button id="editNewListing" type="button" class="btn btn-success">Edit Listing</button>
//           </div>
//         </div>
//       </div>
//     </div>
//
//   `);
//
//
//   $.ajax({
//     url: `${url}/updateListing/${id}`,
//     type: 'get',
//     // data: {
//     //   userId: sessionStorage['userID']
//     // },
//     dataType: 'json',
//     success:function(product){
//       console.log(product);
//       // if(product == '401'){
//       //   alert('401 UNAUTHORIZED');
//       // } else {
//       //   // replace the input fields with the name and price from the database
//       //   $('#productName').val(product['name']);
//       //   $('#productPrice').val(product['price']);
//       //   // we have a hidden input field which we need to give it the value of the products id
//       //   $('#productID').val(product['_id']);
//       //   // Change the buttons text to edit and add the warning class
//       //   $('#addProductButton').text('Edit Product').addClass('btn-warning');
//       //   // Change the heading text
//       //   $('#heading').text('Edit Product');
//       //   // set the global variable of editing to true
//       //   editing = true;
//       // }
//     },
//     error:function(err){
//       console.log(err);
//       console.log('something went wrong with getting the single product');
//     }
//   })
// });

$("#popularItemsCards" ).owlCarousel({
  loop:true,
  margin:10,
  responsive:{
      0:{
          items:3
      },
      600:{
          items:4
      },
      1000:{
          items:5
      }
  }
});

$(document).ready(function(){
  $(".owl-carousel").owlCarousel();
});

$('#hamburgerNav').click(function(){
  if ($('#navDropDown').hasClass('d-none')) {
    $('#navDropDown').removeClass('d-none');
    $('#hamburgerNav').empty();
    $('#hamburgerNav').append('<i class="fas fa-times pl-4"></i>');
  } else {
    $('#navDropDown').addClass('d-none');
    $('#hamburgerNav').empty();
    $('#hamburgerNav').append('<i class="fas fa-bars pl-4">');
  }
});

// larissa untill here


$('#logBtn').click(function(){
 $('#index').addClass('d-none');
 $('#signIn').removeClass('d-none');
 $('#logBtn').addClass('d-none');
 $('#regoBtn').addClass('d-none');
 $('#logout').removeClass('d-none');
});

$('#logout').click(function(){
 $('#logBtn').removeClass('d-none');
 $('#regoBtn').removeClass('d-none');
 $('#logout').addClass('d-none');
});

$('#regoBtn').click(function(){
 $('#index').addClass('d-none');
 $('#rego').removeClass('d-none');
});

$('.guest').click(function(){
 $('#index').removeClass('d-none');
 $('#signIn').addClass('d-none');
 $('#rego').addClass('d-none');
 $('#logBtn').removeClass('d-none');
 $('#regoBtn').removeClass('d-none');
 $('#logout').addClass('d-none');
});

$('#signInHere').click(function(){
 $('#index').addClass('d-none');
 $('#signIn').removeClass('d-none');
 $('#rego').addClass('d-none');
});

$('#signUpHere').click(function(){
 $('#index').addClass('d-none');
 $('#signIn').addClass('d-none');
 $('#rego').removeClass('d-none');
});
// Katherine codes until here

// Annies code continued
// $('#submitResponse').click(function(){
//   event.preventDefault();
//
//   let responseArea = $('#responses').val();
//
//   $.ajax({
//     url: `${url}/sendResponse`,
//     type: 'POST',
//     data: {
//       responceDescription: responseArea
//     },
//     success:function(result){
//       console.log(result);
//       $('#commentsDisplay').append(`
//         <div id="commentsCard" class="col-md-4">
//           <div class="card mb-4 shadow-sm">
//             <div class="card-body">
//               <p class="card-text">${result.responceDescription}</p>
//               </div>
//           </div>
//         </div>
//       `);
//     },
//     error: function(error){
//       console.log(error);
//       console.log('something went wrong with sending the data');
//     }
//   });
// });

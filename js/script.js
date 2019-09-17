console.log('hello world');

$('#addListing').click(function() {
  event.preventDefault();
  $('#addlistingForm').removeClass('d-none');
});

$('#subitNewListing').click(function() {

  let itemName = $('#itemName').val();
  let itemPrice = $('#itemPrice').val();
  let itemDescription = $('#itemDescription').val();
  let itemSeller = $('#itemSeller').val();

  let newListing = itemName + ' $' + itemPrice + ' ' + itemDescription + ' ' + itemSeller;

  console.log(newListing);
});

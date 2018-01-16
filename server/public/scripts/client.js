console.log('js');

$(document).ready(function () {
  console.log('JQ');

  // load existing koalas on page load
  getKoalas();

  // add koala button click
  $('#addButton').on('click', newKoala); //end addButton on click

  $('#viewKoalas').on('click', '.editKoala', editKoala);


  $('#viewKoalas').on('click', '.markReady', markReady);
  $('#viewKoalas').on('click', '.markUnready', markUnready);
  $('#viewKoalas').on('click', '.deleteKoala', deleteKoala);
  $('#showAllButton').on('click', showAll);

}); // end doc ready

function newKoala() {
  console.log('in addButton on click');
  // get user input and put in an object
  // NOT WORKING YET :(
  // using a test object
  let name = $('#nameIn').val()
  let age = $('#ageIn').val()
  let gender = $('#genderIn').val()
  let ready_to_transfer = $('#readyForTransferIn').val()
  let notes = $('#notesIn').val()

  console.log(gender);
  if (checkInputs(name, age, gender, ready_to_transfer)) {
    var objectToSend = {
      name: name,
      age: age,
      gender: gender,
      ready_to_transfer: ready_to_transfer,
      notes: notes
    };
    // call saveKoala with the new obejct
    saveKoala(objectToSend);
  }
}

function updateKoala() {

  let name = $('#nameIn').val()
  let age = $('#ageIn').val()
  let gender = $('#genderIn').val()
  let ready_to_transfer = $('#readyForTransferIn').val()
  let notes = $('#notesIn').val()

  console.log(gender);
  if (checkInputs(name, age, gender, ready_to_transfer)) {
    let koalaId = $(this).val();
    console.log(koalaId);
    let objectToUpdate = {
      name: name,
      age: age,
      gender: gender,
      ready_to_transfer: ready_to_transfer,
      notes: notes
    };
    $.ajax({
      type: 'PUT',
      url: '/koalas/update/' + koalaId,
      data: objectToUpdate,
      success: function (response) {
        console.log('response', response);
        getKoalas();
        $('#editKoala').empty();

        $('#addButton').on('click', newKoala); //end addButton on click
        $('#addButton').off('click', updateKoala);
        $('#formLabel').text('Add Koala');
        $('#addButton').text('Add Koala');


        $('#nameIn').val('');
        $('#ageIn').val('');
        $('#genderIn').val('');
        $('#readyForTransferIn').val('');
        $('#notesIn').val('');
        $('#addButton').val('');
      }
    });
  }
}

function editKoala() {

  $('#addButton').text('Edit Koala');
  $('#formLabel').text('Edit Koala');

  $('#addButton').off('click', newKoala); //end addButton on click
  $('#addButton').on('click', updateKoala);

  let editDiv = $('#editKoala');
  let koalaId = $(this).val();

  $.ajax({
    url: '/koalas/' + koalaId,
    method: 'GET',
    success: function (response) {
      console.log('got one Koala:', koalaId, response);

      $('#nameIn').val(response[0].name).focus();
      $('#ageIn').val(response[0].age);
      $('#genderIn').val(response[0].gender);
      $('#readyForTransferIn').val(response[0].ready_to_transfer);
      $('#notesIn').val(response[0].notes);
      $('#addButton').val(response[0].id);


      // editDiv.empty();
      // editDiv.append(`
      //   <h2>Edit Koala</h2>
      //   <input type="text" id="nameInEdit" value="${response[0].name}" placeholder="Name">
      //   <input type="number" id="ageInEdit" value="${response[0].age}" placeholder="Age (number)">
      //   <input type="text" id="genderInEdit" value="${response[0].gender}" placeholder="Gender (M/F)">
      //   <input type="text" id="readyForTransferInEdit" value="${response[0].ready_to_transfer}" placeholder="Transfer (Y/N)">
      //   <input type="text" id="notesInEdit" value="${response[0].notes}" placeholder="Notes">
      //   <button type="button" class="btn button success" value="${response[0].id}" id="editButton">Edit Koala</button>
      //   `);
    }
  });

}

function checkInputs(name, age, gender, ready_to_transfer) {
  if (name == '' || age == '' || gender == '' || ready_to_transfer == '') {
    alert('Name, age, gender, and ready to transfer must not be empty.');
    return false;
  } else if (gender !== 'M' && gender !== 'F' && gender !== 'm' && gender !== 'f') {
    alert('Gender must be M or F');
    return false;
  } else if (ready_to_transfer !== 'Y' && ready_to_transfer !== 'N' && ready_to_transfer !== 'y' && ready_to_transfer !== 'n') {
    alert('"Ready to Transfer" must be Y or N');
    return false;
  } else {
    return true;
  }
}



function getKoalas() {
  console.log('in getKoalas');
  // ajax call to server to get koalas
  $.ajax({
    url: '/koalas',
    type: 'GET',
    success: function (data) {
      console.log('got some koalas: ', data);
      displayKoalas(data);
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
} // end getKoalas

function displayKoalas(data) {

  $('#viewKoalas').empty();

  for (let i = 0; i < data.length; i++) {
    if (displayAllStatus === true || (displayAllStatus === false && okayToDisplay(data[i].ready_to_transfer))) {
      let newRow = $('<tr>');
      newRow.append('<td>' + data[i].name + '</td>');
      newRow.append('<td>' + data[i].age + '</td>');
      newRow.append('<td>' + data[i].gender + '</td>');
      newRow.append('<td>' + data[i].ready_to_transfer + '</td>');
      newRow.append('<td>' + data[i].notes + '</td>');
      if (data[i].ready_to_transfer === 'N') {
        newRow.append('<td><button type="button" class="markReady btn btn-success" value="' + data[i].id + '"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>Mark Ready for Transfer</button></td>');
      } else {
        newRow.append('<td><button type="button" class="markUnready btn btn-warning" value="' + data[i].id + '"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i>Mark Unready for Transfer</button></td>');
      }
      newRow.append('<td><button type="button" class="deleteKoala btn btn-danger" value="' + data[i].id + '"><i class="fa fa-trash" aria-hidden="true"></i>Delete</button></td>')

      newRow.append('<td><button type="button" class="editKoala btn btn-primary" value="' + data[i].id + '"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</button></td>')

      $('#viewKoalas').append(newRow);

    }
  }
}

function showAll() {
  if (displayAllStatus == true) {
    displayAllStatus = false
    $('#showAllButton').text('Show All Koalas')
    $('#allKoalas span').text('Ready Koalas');
  }
  else {
    displayAllStatus = true
    $('#showAllButton').text('Show Ready Koalas')
    $('#allKoalas span').text('All Koalas');
  }
  getKoalas();
}

let displayAllStatus = true;

function okayToDisplay(status) {
  if (status === 'y' || status === 'Y') {
    return true;
  } else {
    return false;
  }
}

function saveKoala(newKoala) {
  console.log('in saveKoala', newKoala);

  $.ajax({
    url: '/koalas',
    type: 'POST',
    data: newKoala,
    success: function (response) {
      console.log('got some koalas: ', response);
      getKoalas();

      $('#nameIn').val('').focus();
      $('#ageIn').val('');
      $('#genderIn').val('');
      $('#readyForTransferIn').val('');
      $('#notesIn').val('');
      $('#addButton').val('');
    } // end success
  }); //end ajax
}

function markReady() {
  let koalaId = $(this).val();
  $.ajax({
    type: 'PUT',
    url: '/koalas/' + koalaId,
    data: {
      ready_to_transfer: 'Y'
    },
    success: function (response) {
      console.log('response', response);
      getKoalas();
    }
  });
}

function markUnready() {
  let koalaId = $(this).val();
  $.ajax({
    type: 'PUT',
    url: '/koalas/' + koalaId,
    data: {
      ready_to_transfer: 'N'
    },
    success: function (response) {
      console.log('response', response);
      getKoalas();
    }
  });
}

function deleteKoala() {
  let koalaId = $(this).val();
  $.ajax({
    type: 'DELETE',
    url: '/koalas/' + koalaId,
    success: function (response) {
      console.log('response', response);
      getKoalas();
    }
  });
}
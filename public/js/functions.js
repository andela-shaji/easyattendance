// Creating a FireBase data reference
var Ref = new Firebase("https://easyattendance.firebaseio.com");
var Events = Ref.child("events");
var eventId;
//login the users
$('#members').on("click", function() {
  login();
});


function login() {
  Ref.authWithOAuthPopup("google", function(error, auth) {
    if (!error) {
      var data = auth.google.cachedUserProfile;
      Ref.child('users').child(data.id).set(data);
      window.location.assign("events.html");
    }
  });
}

function logged_in() {
  var authData = Ref.getAuth();
  if (authData) {

    //return authData.google.displayName;
    // console.log(authData)
    //console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    // console.log("User is logged out");
  }
}

if (logged_in()) {
  var authData = Ref.getAuth();
  var uid = Ref.child("users");

  uid.push().set({
    user_name: authData.google.displayName
  });

}

// load older events as well as any newly added one...
Events.on("child_added", function(snap) {
  var events = snap.val();
  // console.log("all events", snap.key(), snap.val());
  $('#eventList').append(loadEvents(events, snap.key()));
});


// save event
$('#eventRegisterSubmit').on("click", function() {
  if ($('#eventName').val() !== '') {
    Events
      .push({
        eventName: $('#eventName').val(),
        eventDate: $('#eventDate').val(),
        eventEmail: $('#eventEmail').val()
      });
  } else {
    window.alert('Please enter event name!');
  }
});

// save attendee
$('#checkinSubmit').on("click", function() {
  console.log(eventId);
  if ($('#firstName').val() !== '') {
    Events.child(eventId).child('attendees')
      .push({
        firstname: $('#firstName').val(),
        lastname: $('#lastName').val(),
        email: $('#email').val()
      });
  } else {
    window.alert('Please enter attendee name!');
  }
});



//prepare event object's HTML
var loadEvents = function(event, id) {
  console.log(event);
  if (event) {
    var html = '';
    html += '<tr class=" eventitem">';
    html += '<td>' + event.eventName + '</td>';
    html += '<td>' + event.eventDate + '</td>';
    html += '<td>' + event.eventName + '</td>';
    html += '<td>';
    html += '<button type="button" class="btn btn-primary" id ="' + id + '" onclick="fetchAttendees(' + "id" + ')" data-toggle="modal" data-tooltip="true" data-placement="bottom" title="Add Attendees." data-target= "#todayModal" id="viewregister">';
    html += "View Today's Register";
    html += '</button>  ';
    html += '<button type="button" class="btn btn-primary" onclick="getId(' + "id" + ')" data-toggle="modal" data-tooltip = "true" data-placement="bottom" title="Check-In" data-target= "#checkInModal" id="' + id + '"><i class="fa fa-check"></i>';
    html += '</button>  ';
    html += '</td>';
    html += '</tr>';
    return html;
  }
};

// logout

$('#logout').on("click", function log_out() {
  Ref.unauth();
  window.location.assign("/");

});


// all the function go here

//prepare attendee object's HTML
function loadAttendees(attendee) {
  console.log(attendee);
  var html = '';
  html += '<tr class=" eventitem">';
  html += '<td>' + attendee.firstname + '</td>';
  html += '<td>' + attendee.lastname + '</td>';
  html += '<td>' + attendee.email + '</td>';

  html += '</tr>';
  return html;
}

function getId(id) {
  eventId = id;
}

// // load older attendees as well as any newly added one...
var fetchAttendees = function(id) {
  Events.child(id).child('attendees').on("child_added", function(snap) {
    //console.log("added", snap.key(), snap.val());
    $('#attendeeList').append(loadAttendees(snap.val()));

  });
};

var auth = function() {
  if (!window.localStorage.getItem('firebase:session::easyattendance')) {
    window.location.replace('/index.html');
  }
};

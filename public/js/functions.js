// Creating a FireBase data reference
var Ref = new Firebase("https://easyattendance.firebaseio.com");
var Events = Ref.child("events");
var eventId;
//login the users
$('#log-in').on("click", function() {
  login();
});

// function for login users
function login() {
  Ref.authWithOAuthPopup("google", function(error, auth) {
    if (!error) {
      var data = auth.google.cachedUserProfile;
      Ref.child('users').child(data.id).set(data);
      window.location.assign("events.html");
    }
  });
}

// Adding New Event
$('#eventRegisterSubmit').on("click", function() {
  if ($('#eventName').val() !== '') {
    Events
      .push({
        eventName: $('#eventName').val(),
        eventDate: $('#eventDate').val()        
      });
  } else {
    window.alert('Please enter event name!');
  }
});

// fetching event data from the firebase
Events.on("child_added", function(snap) {
  var events = snap.val();
  // console.log("all events", snap.key(), snap.val());
  $('#eventList').append(loadEvents(events, snap.key()));
});

// Displaying events on the table
var loadEvents = function(event, id) {
  console.log(event);
  if (event) {
    var html = '';
    html += '<tr class=" eventitem">';
    html += '<td>' + event.eventName + '</td>';
    html += '<td>' + event.eventDate + '</td>'; 
    html += '<td></td>';    
    html += '<td>';
    html += '<button type="button" class="btn btn-primary" id ="' + id + '" onclick="fetchAttendees(' + "id" + ')" data-toggle="modal" data-tooltip="true" data-placement="bottom" title="View Attendees." data-target= "#todayModal" id="viewregister">';
    html += "View Attendees";
    html += '</button>  ';
    html += '<button type="button" class="btn btn-primary" onclick="getId(' + "id" + ')" data-toggle="modal" data-tooltip = "true" data-placement="bottom" title="Check-In" data-target= "#checkInModal" id="' + id + '">Add Attendee</i>';
    html += '</button>  ';
    html += '</td>';
    html += '</tr>';
    return html;
  }
};

// Adding New Attendee
$('#checkinSubmit').on("click", function(e) {
  e.preventDefault();
  console.log(eventId);
  if ($('#firstName').val() !== '') {
    Events.child(eventId).child('attendees')
      .push({
        firstname: $('#firstName').val(),
        lastname: $('#lastName').val(),
        email: $('#email').val()
      });
      attendeeForm.reset();
  } else {
    window.alert('Please enter attendee name!');
  }
});

// fetching attendees' data from the firebase
var fetchAttendees = function(id) {
  Events.child(id).child('attendees').on("child_added", function(snap) {
    //console.log("added", snap.key(), snap.val());
    $('#attendeeList').append(loadAttendees(snap.val()));

  });
};

// fetches the event id 
function getId(id) {
  eventId = id;
}

// Displaying events on the table
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

// Logging out of the system

$('#logout').on("click", function log_out() {
  Ref.unauth();
  window.location.assign("/");

});

var auth = function() {
  if (!window.localStorage.getItem('firebase:session::easyattendance')) {
    window.location.replace('/index.html');
  }
};

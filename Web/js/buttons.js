// var data = [{
// 					"calendarName": "private",
// 					"startdate": "10/01/2018",
// 					"endDate": "11/01/2019",
// 					"startHour": "8:00",
// 					"endHour": "9:00",
// 					"location": "WPI",
// 					"days": {
// 						"isAvaliable": false
// 					}
// 				},
// 				{
// 					"calendarName": "Professional",
// 					"startDate": "11/01/2018",
// 					"endDate": "12/10/2018",
// 					"startHour": "8:00",
// 					"endHour": "17:00",
// 					"location": "WPI",
// 					"duration": "20",
// 					"days": {
// 						"isAvaliable": false
// 					}
// 				}
// 			]

function target_popup(form) {
    window.open('addCalendar.html','POPUPW','width=900,height=700,scrollbars=yes,resizable=yes');
    form.target = 'POPUPW';
}

function target_popup2(calName) {
    window.open('scheduleMeeting.html','POPUPW','width=900,height=700,scrollbars=yes,resizable=yes');
    this.target = 'POPUPW';
}

function ShareDivTrigger(){
	
	document.getElementById("invitePopover").setAttribute("data-content", "https://users.wpi.edu/~wliu6/inviteSchedule.html?values=" + localStorage.getItem("currentCalID"));
}

function ShareModalTrigger(){
	document.getElementById("shareModalBody").innerHTML ="https://users.wpi.edu/~wliu6/inviteSchedule.html?values=" + localStorage.getItem("currentCalID");
	$('#shareModal').modal();
	
}

function RemoveCalendarTrigger(){
	$('#removeCalendarModal').modal();
}

function RemoveCalendar(){
	$('#removeCalendarModal').modal('toggle');
	if ( document.getElementById('calSelect').value=== "0") {
		$('#noCalendarModal').modal();
		return;
	}
	loadTimeout();
	var results = document.getElementById('resultsP');
	var calName = document.getElementById('calSelect').value;
	results.innerHTML = `I am running...`;
	var remove_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/remove-calendar";
	var data = {};
	data["calName"] = calName;
	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", remove_url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  results.innerHTML = `${response}`;
	  $('#calSelectR :selected').remove();
	   	// document.getElementById("calSelectL").selectedIndex = "1";
	  removeOptions(calSelect);
	  loadCalSelect();
	  if (calName === sessionStorage.getItem("currentCalName")){
	  	document.getElementById("curP").innerHTML = "null";
	   	sessionStorage.clear();
	   	document.getElementById("scheduleMeeting").setAttribute("style", "display:none");
	   	document.getElementById("showMeetings").setAttribute("style", "display:none");
	   	document.getElementById("closeTS").setAttribute("style", "display:none");
	   	document.getElementById("addremovedate").setAttribute("style", "display:none");
		}
		$("#myAlert").append('<div class="alert alert-success alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Congratulation!</strong> The calendar: ' + calName + ' has been removed!</div>');
		hideLoader();
	} else {
		results.innerHTML = `Failed to connect!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}


function CreateCalendar(){
	var elem = document.getElementById('info');
	if (elem != null){
		elem.parentNode.removeChild(elem);
	}
    

	var results = document.getElementById('resultsP');
	var div_para = document.parameterForm;
	// history.innerHTML = history.innerHTML + `<br>${calName} </b>`;

	var calName = div_para.calendarName.value;
	var startDate = div_para.startDate.value;
	var endDate = div_para.endDate.value;
	var startTime = div_para.startTime.value;
	var endTime = div_para.endTime.value;
	var duration = div_para.duration.value;
	var location = div_para.location.value;
	var organizer = div_para.organizer.value;
	var userEmail = localStorage.getItem("UserEmail");
	// warningAlert(document.getElementById("sdInput").value);
	// warningAlert(document.getElementById("edInput").value);
	// warningAlert(startTime);
	// warningAlert(endTime);
	// return;
	if (calName === "" || startDate === "" || endDate === "" || startTime === "" || endTime === "" || duration === "" || location === "" || organizer === "") {
		infoAlert("Please complete all forms!");
		results.innerHTML = `Please complete all forms!`;
		results.innerHTML = results.innerHTML + '<br>End.</b>';
		return;
	}
	
	loadTimeout();
  	var create_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/create-calendar"
	var data = {};
	data["calName"] = calName;
	data["startDate"] = startDate;
	data["endDate"] = endDate;
	data["startTime"] = startTime;
	data["endTime"] = endTime;
	data["duration"] = duration;
	data["location"] = location;
	data["organizer"] = organizer;
	data["userEmail"] = userEmail;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", create_url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  var info = js["CalendarInfo"];
	  // results.innerHTML = `${response}`;
	  
	  hideLoader();

	  if (response === "1"){
	  	$('.alert').alert('close');
	  	$("#modalBody").append(
	  		'<div id="info">' + 
	  		'Calendar: "' + calName + '" has been created successfully!<br> The calendar information is:<br>' + info +
	  		'</div>'
	  		);
	  	$('#exampleModalCenter').modal();
	  	
	  	// results.innerHTML = results.innerHTML + `<br>${info}</b>`;
	  }
	  else if (response === "0"){
	  	warningAlert("The calendar: " + calName + " existed!");
	  }
	  else if (response === "-1"){
	  	warningAlert("The End Time seems earlier than or equal to Start Time!");
	  }
	  else if (response === "-2"){
	  	warningAlert("The End Date seems earlier than Start Date!");
	  }
	  // results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		$("#myAlert").append('<div class="alert alert-danger alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Big Problem!</strong> Failed to connect to server!</div>');
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

// function ShowCalendars(){
// 	
// 	var results = document.getElementById('resultsP');
// 	results.innerHTML = `I am running...`;
// 	var show_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/show-calendar";
// 	var data = {};
// 	var js = JSON.stringify(data);
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", show_url, true);
// 	// send the collected data as JSON
// 	xhr.send(js);
// 	// This will process results and update HTML as appropriate. 
// 	xhr.onloadend = function () {
// 	if (xhr.readyState == XMLHttpRequest.DONE) {
// 	  //nowtime();
// 	  var js = JSON.parse(xhr.responseText);
// 	  var response = js["Result"];
// 	  results.innerHTML = `Created calendars: ${response}`;
// 	  results.innerHTML = results.innerHTML + '<br>End.</b>';

// 	  
// 	} else {
// 		results.innerHTML = `<b>Failed to connect!</b>`;
// 	  //updateHistory(arg1, arg2, "N/A");
// 	}
// 	};
// }

function ScheduleMeeting(){
	var results = document.getElementById('resultsP');
	results.innerHTML = `I am running...<br>`;
	var schedule_para = document.scheduleForm;

	var meetDate = document.getElementById("meetDate").value;
	var meetTime = document.getElementById("meetTimeSelect").value;
	var who = document.getElementById("whotomeet").value;
	var location = document.getElementById("locationInput").value;

	if (meetDate === '' || meetTime === '' 
		|| who === '' || location === '') {
		results.innerHTML =  'Warning:<br>';
		results.innerHTML = results.innerHTML + `Please complete all forms!`;
		results.innerHTML = results.innerHTML + '<br>End.</b>';
		infoAlert(`Please complete all forms!`);
		return;
	}

	loadTimeout()

	var calID = sessionStorage.getItem("currentCalID");
	var schedule_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/schedule-meeting";
	var data = {};
	data["calID"] = calID;
	data["meetDate"] = meetDate;
	data["meetTime"] = meetTime;
	data["meetingWith"] = who;
	data["location"] = location;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", schedule_url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  var timeSelect = document.getElementById('meetTimeSelect');
	  results.innerHTML = `${response}`;
	  // hideLoader();
	  successAlert(response);
	  if (response !== "Failed to schedule meeting!"){
	  	$('#meetTimeSelect :selected').remove();
	  }
	  if (document.getElementById('meetTimeSelect').length == 0){
	  	var opt = document.createElement('option');
		opt.value = "";
		opt.innerHTML = "No Available TimeSlot";
		timeSelect.appendChild(opt);
	  }
	  // hideLoader();
	  ShowAllMeetings();
	} else {
		results.innerHTML = `Failed to connect!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CancelMeeting(){
	
	
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var meetingID = document.getElementById('meetingSelect').value;
	results.innerHTML = `I am running...<br>`;
	if (meetingID === ""){
		results.innerHTML += `You have not slected anything!`;
		results.innerHTML += `<br>End.`;
		infoAlert("You have not selected anything!")
		return;	
	}
	loadTimeout();
	var schedule_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/cancel-meeting";
	var data = {};
	data["calID"] = calID;
	data["meetingID"] = meetingID;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", schedule_url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  results.innerHTML = `${response}`;
	  if (response !== "Failed to cancel meeting!"){
	  	$('#meetingSelect :selected').remove();
	  }
	  if (document.getElementById('meetDate').value !== ''){
	  	RetrieveOpenTimeslot({calID:sessionStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  successAlert("The meeting has been canceled!");
	  // hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCIT(){

	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var date = document.getElementById('citDate').value;
	var time = document.getElementById('citTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	if (date === "" || time === "No Available TimeSlot" || time === ""){
		results.innerHTML += `You must select both date and time to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert(`You must select both date and time to close!`);
		return;	
	}
	
	loadTimeout();
	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/close-timeslot";
	var data = {};
	data["calID"] = calID;
	data["date"] = date;
	data["time"] = time;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  results.innerHTML = `${response}`;
	  // if (response == "Succeed"){
	  // 	$('#citTimeSelect :selected').remove();
	  // }
	  if (document.getElementById('citTimeSelect').length == 0){
	  	var opt = document.createElement('option');
		opt.value = "";
		opt.innerHTML = "No Available TimeSlot";
		document.getElementById('citTimeSelect').appendChild(opt);
	  }
	  if (document.getElementById('meetDate').value === date){
	  	RetrieveOpenTimeslot({calID:sessionStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  document.getElementById('citTimeSelect').options[document.getElementById('citTimeSelect').selectedIndex].setAttribute("disabled", "disabled");
	  $('#citTimeSelect option:selected').next().attr('selected', 'selected');
	  successAlert("You have closed the timeslot on " + date + " at " + time + "!");
	  hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATD(){
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var date = document.getElementById('catdDate').value;

	results.innerHTML = `I am running...<br>`;
	
	if (date === ""){
		results.innerHTML += `You must select a date to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert("You must select a date to close!");
		return;	
	}
	
	loadTimeout();
	
	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/close-timeslot";
	var data = {};
	data["calID"] = calID;
	data["date"] = date;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  results.innerHTML = `${response}`;
	  if (response == "Already Closed."){
	  	warningAlert("This date has been closed!");
	  	hideLoader();
	  	return;
	  }
	  document.getElementById('meetDate').value = '';
	  var timeSelect = document.getElementById('meetTimeSelect');
	  removeOptions(timeSelect);
	  var opt = document.createElement('option');
	  opt.innerHTML = "It will be filled after you select a date!";
	  timeSelect.appendChild(opt);
	  results.innerHTML += `<br>End.`;
	  successAlert("You have closed all timeslots on " + date + "!");
	  hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATT(){
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var time = document.getElementById('cattTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	if (time === ""){
		results.innerHTML += `You must select a timeslot to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert("You must select a timeslot to close!");
		return;	
	}
	
	loadTimeout();
	
	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/close-timeslot";
	var data = {};
	data["calID"] = calID;
	data["time"] = time;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  results.innerHTML = `${response}`;
	  // document.getElementById('cattTimeSelect').options[document.getElementById('cattTimeSelect').selectedIndex].setAttribute("disabled", "disabled");
	  // $('#cattTimeSelect option:selected').next().attr('selected', 'selected');
	  results.innerHTML += `<br>End.`;
	  if (document.getElementById('meetDate').value !== ''){
	  	RetrieveOpenTimeslot({calID:sessionStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  successAlert("You have closed all timeslots at " + time + "!");
	  hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATDWT(){
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var day = document.getElementById('catdwtDaySelect').value;
	var time = document.getElementById('catdwtTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	// if (day === "" || time === "No Available TimeSlot" || time === ""){
	// 	results.innerHTML += `You must select both date and time to close.`;
	// 	results.innerHTML += `<br>End.`;
	// 	return;	
	// }
	
	loadTimeout();
	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/close-timeslot";
	var data = {};
	data["calID"] = calID;
	data["day"] = day;
	data["time"] = time;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  document.getElementById('meetDate').value = '';
	  var timeSelect = document.getElementById('meetTimeSelect');
	  removeOptions(timeSelect);
	  var opt = document.createElement('option');
	  opt.innerHTML = "It will be filled after you select a date!";
	  timeSelect.appendChild(opt);
	  // document.getElementById('catdwtTimeSelect').options[document.getElementById('catdwtTimeSelect').selectedIndex].setAttribute("disabled", "disabled");
	  results.innerHTML = `${response}<br>End.`;
	  successAlert("You have closed all timeslots on " + document.getElementById('catdwtDaySelect').options[document.getElementById('catdwtDaySelect').selectedIndex].text + " at " + time + "!");
	  hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function RemoveDate(){
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var date = document.getElementById('modifyDate').value;
	results.innerHTML = `I am running...<br>`;
	if (date === '') {
		infoAlert(`Please choose a date!`);
		return;
	}
	loadTimeout();

	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/remove-date";
	var data = {};
	data["calID"] = calID;
	data["date"] = date;
	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var response = js["Result"];

		if (response === "Succeed"){
			document.getElementById('meetDate').value = '';
			var timeSelect = document.getElementById('meetTimeSelect');
			removeOptions(timeSelect);
			var opt = document.createElement('option');
			opt.innerHTML = "It will be filled after you select a date!";
			timeSelect.appendChild(opt);	

			document.getElementById('citDate').value = '';
			var timeSelect = document.getElementById('citTimeSelect');
			removeOptions(timeSelect);
			var opt = document.createElement('option');
			opt.innerHTML = "It will be filled after you select a date!";
			timeSelect.appendChild(opt);

			document.getElementById('catdDate').value = '';
			document.getElementById('dailyMeetings').value = '';

			var storedData = sessionStorage.getItem("currentCalAllDates");
			if (storedData) {
			    dateArray = JSON.parse(storedData);
			} 
			dateArray.splice( dateArray.indexOf(date), 1 );
			sessionStorage.setItem("currentCalAllDates", JSON.stringify(dateArray));

			// $("#meetDate").datepicker("destroy");
			meetDateDatepiker();
			// meetDateChangeTime();
			dailyMeetingsDatepiker();
			citDateDatepiker();
			// citChangeTime();
			catdDateDatepiker();
			hideLoader();
			results.innerHTML = `${response}<br>End.`;
			successAlert(response + " to remove date: " + date);
		}
		else{
			warningAlert(response);
			hideLoader();
		}
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function AddDate(){
	var results = document.getElementById('resultsP');
	var calID = sessionStorage.getItem("currentCalID");
	var date = document.getElementById('modifyDate').value;
	var startDate = sessionStorage.getItem("currentCalSD");
	var endDate = sessionStorage.getItem("currentCalED");
	var startTime = sessionStorage.getItem("currentCalST");
	var endTime	= sessionStorage.getItem("currentCalET");
	var duration = sessionStorage.getItem("currentCalDuration");
	results.innerHTML = `I am running...<br>`;
	if (date === '') {
		infoAlert(`Please choose a date!`);
		return;
	}
	// if (day === "" || time === "No Available TimeSlot" || time === ""){
	// 	results.innerHTML += `You must select both date and time to close.`;
	// 	results.innerHTML += `<br>End.`;
	// 	return;	
	// }
	
	loadTimeout();
	var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/add-date";
	var data = {};
	data["calID"] = calID;
	data["date"] = date;
	data["startDate"] = startDate;
	data["endDate"] = endDate;
	data["startTime"] = startTime;
	data["endTime"] = endTime;
	data["duration"] = duration;

	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  
	  if (response === "Succeed"){
	  	document.getElementById('meetDate').value = '';
		var timeSelect = document.getElementById('meetTimeSelect');
		removeOptions(timeSelect);
		var opt = document.createElement('option');
		opt.innerHTML = "It will be filled after you select a date!";
		timeSelect.appendChild(opt);
		// var dateArray = [];
		// for (i in js["ArrayList"]){
		// 	dateArray.push(js["ArrayList"][i]);
		// }	
		var storedData = sessionStorage.getItem("currentCalAllDates");
		if (storedData) {
		    dateArray = JSON.parse(storedData);
		} 
		dateArray.push(date);
		sessionStorage.setItem("currentCalAllDates", JSON.stringify(dateArray));
		
		// $("#meetDate").datepicker("destroy");
		meetDateDatepiker();
	    // meetDateChangeTime();
	    dailyMeetingsDatepiker();
    	citDateDatepiker();
    	// citChangeTime();
    	catdDateDatepiker();
		successAlert(response + " to add date: " + date);
	  }
	  else{
	  	warningAlert(response);
	  }
	  results.innerHTML = `${response}<br>End.`;
	  
	  hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}



function LoadCalendars(){
	sessionStorage.clear();
	// var calendarNameArr = ["Professional", "Private"];
	// plotLoadCalendars(calendarNameArr, locationArr);
	var results = document.getElementById('resultsP');
	var calName = document.getElementById('calSelect').value;
	results.innerHTML = `I am running...`;
	if ( document.getElementById('calSelect').value=== "0") {
		$('#noCalendarModal').modal();
		return;
	}
	
	loadTimeout();

	var load_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/load-calendar";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", load_url + "?calName=" + calName, true);
	// send the collected data as JSON
	xhr.send();
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var response = js["Result"];
		var calID = js["calID"];
		var userNickName = js["userNickName"];
		var userName = js["userName"];
		var calName = js["calName"];
		var startDate = js["startDate"];
		var endDate = js["endDate"];
		var startTime = js["startTime"];
		var endTime = js["endTime"];
		var location = js["location"];
		var duration = js["duration"];
		if (response == "1"){
			document.getElementById("curP").innerHTML = "Current Calendar: " + `"${calName}"` + " default range from " + `${startDate}` + 
													" to " + `${endDate}`;
			// results.innerHTML += "<br>Succeed!";
			successAlert("You have loaded calendar: " + calName + ".");
			results.innerHTML = results.innerHTML + '<br>End.</b>';
			if (typeof(Storage) !== "undefined") {
				// Store
				sessionStorage.setItem("currentCalID", calID);
				localStorage.setItem("currentCalID", calID);
				sessionStorage.setItem("currentCalName", calName);
				localStorage.setItem("currentCalID", calID);
				sessionStorage.setItem("currentCalSD", startDate);
				localStorage.setItem("currentCalSD", startDate);
				sessionStorage.setItem("currentCalED", endDate);
				localStorage.setItem("currentCalED", endDate);
				sessionStorage.setItem("currentCalST", startTime);
				localStorage.setItem("currentCalST", startTime);
				sessionStorage.setItem("currentCalET", endTime);
				localStorage.setItem("currentCalET", endTime);
				sessionStorage.setItem("currentCalDuration", duration);
				localStorage.setItem("currentCalDuration", duration);
				localStorage.setItem("currentCalLocation", location);

				var dateArray = [];
				for (i in js["ArrayList"]){
					dateArray.push(js["ArrayList"][i]);
				}	
				sessionStorage.setItem("currentCalAllDates", JSON.stringify(dateArray));
				localStorage.setItem("currentCalAllDates", JSON.stringify(dateArray));
			} 
			else {
				document.getElementById("resultsP").innerHTML = "Sorry, your browser does not support Web Storage...";
				warningAlert("Sorry, your browser does not support Web Storage...Please change a browser.");
			}
			document.getElementById('locationInput').setAttribute("value", location);
			document.getElementById('meetDate').setAttribute("min", startDate);
			document.getElementById('meetDate').setAttribute("max", endDate);
			// document.getElementById('dailyMeetings').setAttribute("min", startDate);
			// document.getElementById('dailyMeetings').setAttribute("max", endDate);
			// document.getElementById('monthlyMeetings').setAttribute("min", startDate.substring(0,7));
			// document.getElementById('monthlyMeetings').setAttribute("max", endDate.substring(0,7));
			meetDateDatepiker();
			meetDateChangeTime();
			dailyMeetingsDatepiker();
			citDateDatepiker();
			citChangeTime();
			catdDateDatepiker();
			helper();
			document.getElementById('ctsSelect').selectedIndex = "0";
			// document.getElementById("inviteDiv").setAttribute("style", "display:block");
			document.getElementById("inviteDiv").setAttribute("style", "display:block");
			document.getElementById("scheduleMeeting").setAttribute("style", "display:block");
			document.getElementById("showMeetings").setAttribute("style", "display:block");
			ShowAllMeetings();
			document.getElementById("closeTS").setAttribute("style", "display:block");
			document.getElementById("album").setAttribute("style", "display:block");

			hideLoader();
		
			// document.getElementById('calSelect').options[document.getElementById('calSelect').selectedIndex].setAttribute("disabled", "disabled");
			// $('#calSelect option:selected').next().attr('selected', 'selected');
			}
		else {
			document.getElementById("curP").innerHTML = "null";
			sessionStorage.clear();
			document.getElementById("scheduleMeeting").setAttribute("style", "display:none");
			document.getElementById("showMeetings").setAttribute("style", "display:none");
			document.getElementById("closeTS").setAttribute("style", "display:none");
			document.getElementById("addremovedate").setAttribute("style", "display:none");
			results.innerHTML = `${response}`;
		}
		hideLoader();								
	} else {
		results.innerHTML = `Failed to connect!`;
	}
	};
}

function RetrieveOpenTimeslot(context){
	$('.alert').alert('close');
	if (context.date == ''){
		var timeSelect = document.getElementById('meetTimeSelect');
		removeOptions(timeSelect);
		var opt = document.createElement('option');
		opt.innerHTML = "It will be filled after you select a date!";
		mmeetTimeSelect.appendChild(opt);
		return;
	}
	
	loadTimeout();
    var retrieve_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/retrieve-timeslots";
    var xhr = new XMLHttpRequest();	
    xhr.open("GET", retrieve_url + "?calID=" + context.calID + "&avaiDate=" + context.date + "&type=" + "Open", true);
    document.getElementById("resultsP").innerHTML = "I am running...";
    document.getElementById("resultsP").innerHTML += "<br>I am filling available times...</b>";
    // send the collected data as JSON
    xhr.send();
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var timeSelect = document.getElementById('meetTimeSelect');
		removeOptions(timeSelect);

		if (js["Result"] === "Close"){
				// alert("This date is not available!");	
				document.getElementById('meetDate').value = '';
				var timeSelect = document.getElementById('meetTimeSelect');
				removeOptions(timeSelect);
				var opt = document.createElement('option');
				opt.innerHTML = "It will be filled after you select a date!";
				timeSelect.appendChild(opt);
				warningAlert("This date: "+ context.date + " has been closed!");
				hideLoader();
				return;
		}

		if (js["ArrayList"] == ""){
			var opt = document.createElement('option');
			opt.value = "";
			opt.innerHTML = "No Available TimeSlot";
			timeSelect.appendChild(opt);
			document.getElementById("resultsP").innerHTML += "<br>End.</b>";
			return;
		}

		
		for (var i in js["ArrayList"]){
			if(i == "Result"){
				continue;
			}
			// document.getElementById("resultsP").innerHTML = document.getElementById("resultsP").innerHTML + `<br>${js.ArrayList[i].startTime}</b>`;
			var opt = document.createElement('option');
			opt.value = js.ArrayList[i].startTime;
			opt.innerHTML = js.ArrayList[i].startTime;
			// document.getElementById("resultsP").innerHTML += `${opt.value}`;
			timeSelect.appendChild(opt);

		}
		
		hideLoader();
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";

      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function RetrieveNonCloseTimeslot(context){
	$('.alert').alert('close');
    var retrieve_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/retrieve-timeslots";
    var xhr = new XMLHttpRequest();	
    if (context.date === ""){
    	xhr.open("GET", retrieve_url + "?calID=" + context.calID + "&type=" + "NonClose", true);
    }
    else{
    	xhr.open("GET", retrieve_url + "?calID=" + context.calID + "&avaiDate=" + context.date + "&type=" + "NonClose", true);
    }
    
    loadTimeout();
    document.getElementById("resultsP").innerHTML = "I am running...";
    document.getElementById("resultsP").innerHTML += "<br>I am filling available times...</b>";
    // send the collected data as JSON
    xhr.send();
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var timeSelect = document.getElementById(context.ctsOpt);
		if (timeSelect.options.length != 0){
			removeOptions(timeSelect);	
		}
		
		if (js["Result"] === "Close"){
			warningAlert("This date: "+ context.date + " has been closed!");
			// alert("This date is not available!");
			document.getElementById("resultsP").innerHTML += "<br>End.</b>";
			hideLoader();
			return;
		}

		for (var i in js["ArrayList"]){
			if(i == "Result"){
				continue;
			}
			// document.getElementById("resultsP").innerHTML = document.getElementById("resultsP").innerHTML + `<br>${js.ArrayList[i].startTime}</b>`;
			var opt = document.createElement('option');
			opt.value = js.ArrayList[i].startTime;
			opt.innerHTML = js.ArrayList[i].startTime;
			timeSelect.appendChild(opt);
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		
      	hideLoader();
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowAllMeetings(){
	document.getElementById("resultsP").innerHTML = "I am running...";
	// if (sessionStorage.getItem("currentCalID") === null){

	// 	document.getElementById("resultsP").innerHTML += "<br>Current calendar is null, please load a calendar first.<br>End.";
	// 	return;
	// }

    var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/retrieve-all-meetings";
    var xhr = new XMLHttpRequest();	
    var calID = sessionStorage.getItem("currentCalID");

    
    loadTimeout();
    xhr.open("GET", url + "?calID=" + calID, true);

    // send the collected data as JSON
    xhr.send();
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var meetingSelect = document.getElementById('meetingSelect');
		$('#meetingSelect').empty();
		var selectSize = 0;

		for (var i in js["ArrayList"]){
			selectSize += 1;
			if (selectSize > 2){
				document.getElementById("meetingSelect").setAttribute("size", "" + selectSize);
			}
			if(i == "Result"){
				continue;
			}
			// document.getElementById("resultsP").innerHTML = document.getElementById("resultsP").innerHTML + `<br>${js.ArrayList[i].startTime}</b>`;
			var opt = document.createElement('option');
			opt.value = `${js.ArrayList[i].meetingID}`;
			opt.innerHTML = "Meeting with " + js.ArrayList[i].meetingWith + " on " + js.ArrayList[i].meetDate + " " + js.ArrayList[i].time + " at " + js.ArrayList[i].location;
			meetingSelect.appendChild(opt);
		}
		document.getElementById("showMeetings").setAttribute("style", "display:block");
		
		if (js["ArrayList"].length === 0){
			$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> There is no scheduled meeting in calendar: ' + sessionStorage.getItem("currentCalName") + '.</div>');
			document.getElementById("resultsP").innerHTML += "<br>End.";
			hideLoader();
			return;
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		hideLoader();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowDailyMeetings(){

    var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/retrieve-daily-meetings";
    var xhr = new XMLHttpRequest();	
    var calID = sessionStorage.getItem("currentCalID");
    var meetDate = document.getElementById('dailyMeetings').value;
    document.getElementById("resultsP").innerHTML = "I am running...";	
    if (meetDate === ""){
    	$('#meetingSelect').empty();
    	document.getElementById("resultsP").innerHTML += "<br>Please choose a date.<br>End.";	
    	warningAlert("Please choose a date!");
    	return;	
    }
    
    
    loadTimeout();

    xhr.open("GET", url + "?calID=" + calID + "&meetDate=" + meetDate , true);
    
    // send the collected data as JSON
    xhr.send();
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var meetingSelect = document.getElementById('meetingSelect');
		$('#meetingSelect').empty();
		// var selectSize = 0;
		if (js["ArrayList"].length === 0){
			infoAlert("There is no scheduled meeting on " + meetDate);
			document.getElementById("resultsP").innerHTML += "<br> There is no scheduled meeting on " + `${meetDate}.` ;
			hideLoader();
			return;
		}
		for (var i in js["ArrayList"]){
			// selectSize += 1;
			// if (selectSize > 2){
			// 	document.getElementById("meetingSelect").setAttribute("size", "" + selectSize);
			// }
			if(i == "Result"){
				continue;
			}
			// document.getElementById("resultsP").innerHTML = document.getElementById("resultsP").innerHTML + `<br>${js.ArrayList[i].startTime}</b>`;
			var opt = document.createElement('option');
			opt.value = `${js.ArrayList[i].meetingID}`;
			opt.innerHTML = "Meeting with " + js.ArrayList[i].meetingWith + " on " + js.ArrayList[i].meetDate + " " + js.ArrayList[i].time + " at " + js.ArrayList[i].location;
			meetingSelect.appendChild(opt);
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		successAlert("You have loaded all meetings on " + meetDate + "!");
		hideLoader();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowMonthlyMeetings(){
    var url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/retrieve-monthly-meetings";
    var xhr = new XMLHttpRequest();	
    var calID = sessionStorage.getItem("currentCalID");
    var yearMonth = document.getElementById('monthlyMeetings').value;
    document.getElementById("resultsP").innerHTML = "I am running...";
    if (yearMonth === ""){
    	$('#meetingSelect').empty();
    	document.getElementById("resultsP").innerHTML += "<br>Please choose a month.<br>End.";	
    	warningAlert("Please choose a month!");
    	return;	
    }
    
    loadTimeout();

    xhr.open("GET", url + "?calID=" + calID + "&yearMonth=" + yearMonth, true);
    
    // send the collected data as JSON
    xhr.send();
    // This will process results and update HTML as appropriate. 
    xhr.onloadend = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var meetingSelect = document.getElementById('meetingSelect');
		$('#meetingSelect').empty();
		// var selectSize = 0;
		if (js["ArrayList"].length === 0){
			infoAlert("There is no scheduled meeting in " + yearMonth + "!");
			document.getElementById("resultsP").innerHTML += "<br> There is no scheduled meeting in " + `${yearMonth}.` ;
			hideLoader();
			return;
		}
		for (var i in js["ArrayList"]){
			// selectSize += 1;
			// if (selectSize > 2){
			// 	document.getElementById("meetingSelect").setAttribute("size", "" + selectSize);
			// }
			if(i == "Result"){
				continue;
			}
			// document.getElementById("resultsP").innerHTML = document.getElementById("resultsP").innerHTML + `<br>${js.ArrayList[i].startTime}</b>`;
			var opt = document.createElement('option');
			opt.value = `${js.ArrayList[i].meetingID}`;
			opt.innerHTML = "Meeting with " + js.ArrayList[i].meetingWith + " on " + js.ArrayList[i].meetDate + " " + js.ArrayList[i].time + " at " + js.ArrayList[i].location;
			meetingSelect.appendChild(opt);
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		successAlert("You have loaded all meetings in " + yearMonth + "!");
		hideLoader();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function getCurrentUserInfo(){
	cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        localStorage.setItem("UserEmail", result[3].getValue());
		localStorage.setItem("UserNickName", result[2].getValue());
        document.getElementById("userNickName").innerHTML = 'Hi ' + result[2].getValue(); 
        loadCalSelect();
    });
}


// function getCurrentUserInfo(){
// 	loadTimeout();
	
// 	var show_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/get-current-user";
// 	var data = {};
// 	var js = JSON.stringify(data);
// 	var xhr = new XMLHttpRequest();
// 	xhr.open("GET", show_url, true);
// 	// send the collected data as JSON
// 	xhr.send(js);
	
// 	// This will process results and update HTML as appropriate. 
// 	xhr.onloadend = function () {
// 	if (xhr.readyState == XMLHttpRequest.DONE) {
		
// 		//nowtime();
// 		var js = JSON.parse(xhr.responseText);
// 		document.getElementById("userNickName").innerHTML = 'Hi ' + js["UserNickName"]; 

// 		// results.innerHTML = `Created calendars: ${response}`;
// 		hideLoader();

// 	} else {
// 		results.innerHTML = `<b>Failed to connect!</b>`;
// 	  //updateHistory(arg1, arg2, "N/A");
// 	}
// 	};
	
// }

function loadCalSelect(){
	loadTimeout();
	sessionStorage.setItem("flag", false);
	var results = document.getElementById('resultsP');
	results.innerHTML = `I am running...`;

	var userEmail = localStorage.getItem("UserEmail");
	var userNickName = localStorage.getItem("UserNickName");
	var show_url = "https://t9htii3jlj.execute-api.us-east-1.amazonaws.com/Alpha/show-calendars";
	var data = {};
	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();


	xhr.open("GET", show_url + "?userEmail=" + userEmail, true);
	// xhr.open("GET", show_url, true);
	// send the collected data as JSON
	xhr.send(js);
	
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		
		//nowtime();
		var js = JSON.parse(xhr.responseText);
		var response = js["Result"];
		//--- store user info to check validation ---
		localStorage.setItem("emailCheck", userEmail);
		localStorage.setItem("nickNameCheck", userNickName);
		//--- end ---

		// document.getElementById("userNickName").innerHTML = 'Hi ' + js["UserNickName"]; 


		// results.innerHTML = `Created calendars: ${response}`;
		results.innerHTML = results.innerHTML + '<br>End.</b>';
		var select = document.getElementById('calSelect');
		for (var i in js["ArrayList"]){
			var opt = document.createElement('option');
			opt.value = js["ArrayList"][i];
			opt.innerHTML = js["ArrayList"][i];
			select.appendChild(opt);
		}
		
		hideLoader();
		if ($('select#calSelect option').length === 0){
			$('#noCalendarModal').modal();
			var opt = document.createElement('option');
			opt.value = "0";
			opt.innerHTML = "No available calendar exists!";
			infoAlert("No available calendar exists!");
			calSelect.appendChild(opt);
		}

	} else {
		results.innerHTML = `<b>Failed to connect!</b>`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
	
}

function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function helper(){
                  document.getElementById("cit").setAttribute("style", "display:none");  
                  document.getElementById("catd").setAttribute("style", "display:none");  
                  document.getElementById("catt").setAttribute("style", "display:none");
                  document.getElementById("catdwt").setAttribute("style", "display:none");
                }
function monthHelper(month){
	if (month < 10){
		return "0" + month;
	}
	else{
		return month;
	}
}

function dateHelper(date){
	if (date < 10){
		return "0" + date;
	}
	else{
		return date;
	}
}


function infoAlert(text){
	$('.alert').alert('close');
	$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> ' + text + '</div>');
}

function warningAlert(text){
	$('.alert').alert('close');
	$("#myAlert").append('<div class="alert alert-warning alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> ' + text + '</div>');
}

function successAlert(text){
	$('.alert').alert('close');
	$("#myAlert").append('<div class="alert alert-success alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Congratulation!</strong> ' + text + '</div>');
}


function meetDateDatepiker(){
	$('#meetDate').datepicker({
        // uiLibrary: 'bootstrap4',
        format: 'yyyy-mm-dd',
        disableDates: function (date) {
        	var disabled = sessionStorage.getItem("currentCalAllDates");
            if (disabled.indexOf(date.getFullYear() + "-" + (monthHelper(date.getMonth()+1)) + "-" + dateHelper(date.getDate())) != -1 ) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function citDateDatepiker(){
	$('#citDate').datepicker({
        // uiLibrary: 'bootstrap4',
        format: 'yyyy-mm-dd',
        disableDates: function (date) {
        	var disabled = sessionStorage.getItem("currentCalAllDates");
            if (disabled.indexOf(date.getFullYear() + "-" + (monthHelper(date.getMonth()+1)) + "-" + dateHelper(date.getDate())) != -1 ) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function catdDateDatepiker(){
	$('#catdDate').datepicker({
        // uiLibrary: 'bootstrap4',
        format: 'yyyy-mm-dd',
        disableDates: function (date) {
        	var disabled = sessionStorage.getItem("currentCalAllDates");
            if (disabled.indexOf(date.getFullYear() + "-" + (monthHelper(date.getMonth()+1)) + "-" + dateHelper(date.getDate())) != -1 ) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function dailyMeetingsDatepiker(){
	$('#dailyMeetings').datepicker({
        // uiLibrary: 'bootstrap4',
        format: 'yyyy-mm-dd',
        disableDates: function (date) {
        	var disabled = sessionStorage.getItem("currentCalAllDates");
            if (disabled.indexOf(date.getFullYear() + "-" + (monthHelper(date.getMonth()+1)) + "-" + dateHelper(date.getDate())) != -1 ) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function meetDateChangeTime(){
	$("#meetDate" ).on( "change", function() {
            // $("#timeSelect").empty();
            RetrieveOpenTimeslot({calID:sessionStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
           });
}

function citChangeTime(){
	$("#citDate" ).on( "change", function() {
              RetrieveNonCloseTimeslot({calID:sessionStorage.getItem("currentCalID"), date:document.getElementById('citDate').value, ctsOpt: "citTimeSelect"});
             });
}

function loadTimeout(){
	document.getElementById("loader").style.display = "block";
	setTimeout(hideLoader, 30000);
}
function hideLoader(){
	document.getElementById("loader").style.display = "none";
}



function PassValues(){
    window.location.href="inviteSchedule.html?values=" + localStorage.getItem("currentCalID"); 
}

function LogOut(){
	cognitoUser.signOut();
	window.location.href="index.html";
}

function whetherLogin(){
	if (cognitoUser === null){
		alert("Please Log in")
        window.location.href="index.html";
	}
	cognitoUser.getSession(function(err, session) {
            if (err) {
               alert(err);
                return;
            }
            if (session.isValid()){
            	getCurrentUserInfo();
            }
            else{
            	alert("Please Log in.")
            	window.location.href="index.html";
            }
          });
}

// var myScript = document.createElement("script");
		// myScript.textContent = "$('#meetDate').datepicker({" +
		// 						"uiLibrary: 'bootstrap4'," +
		// 			            "format: 'yyyy-mm-dd'," +
		// 			            "minDate: '2018-11-01'," +
		// 						"maxDate: '2018-11-10'" +
		// 						// "disableDates: sessionStorage.getItem('dateArray')" +
		// 						"});"; 
		// document.head.appendChild(myScript);

		// sessionStorage.getItem('currentCalSD')
		// document.getElementById('modifyDate').value
// 		test = $('<script>' +
//             "$('#meetDate').datepicker({" +
// 			"uiLibrary: 'bootstrap4'," +
//             "format: 'yyyy-mm-dd'," +
//             "minDate: '2018-11-01'," +
// 			"maxDate: '2018-11-10'," +
// 			// "disableDates: sessionStorage.getItem('dateArray')" +
// 			"});" +
//             " </script>" );
//         $("body").append(test);	



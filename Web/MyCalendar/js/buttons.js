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


function RemoveCalendar(){
	if ( document.getElementById('calSelect').value=== "0") {
		$('#noCalendarModal').modal();
		return;
	}
	showModal();
	var results = document.getElementById('resultsP');
	var calName = document.getElementById('calSelect').value;
	results.innerHTML = `I am running...`;
	var remove_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/remove-calendar";
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
	  if (calName === localStorage.getItem("currentCalName")){
	  	document.getElementById("curP").innerHTML = "null";
	   	localStorage.clear();
	   	document.getElementById("scheduleMeeting").setAttribute("style", "display:none");
	   	document.getElementById("showMeetings").setAttribute("style", "display:none");
	   	document.getElementById("closeTS").setAttribute("style", "display:none");
		}
		$("#myAlert").append('<div class="alert alert-success alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Congratulation!</strong> The calendar: ' + calName + ' has been removed!</div>');
		hideModal();
	} else {
		results.innerHTML = `Failed to connect!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}


function CreateCalendar(){
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
	if (calName === "" || startDate === "" || endDate === "" || startTime === "" || endTime === "" || duration === "" || location === "" || organizer === "") {
		infoAlert("Please complete all forms!");
		results.innerHTML = `Please complete all forms!`;
		results.innerHTML = results.innerHTML + '<br>End.</b>';
		return;
	}
	showModal();
  	var create_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/create-calendar"
	var data = {};
	data["calName"] = calName;
	data["startDate"] = startDate;
	data["endDate"] = endDate;
	data["startTime"] = startTime;
	data["endTime"] = endTime;
	data["duration"] = duration;
	data["location"] = location;
	data["organizer"] = organizer;

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
	  hideModal();
	  if (response === "1"){
	  	$("#modalBody").append('Calendar: "' + calName + '" has been created successfully!<br> The calendar information is:<br>' + info);
	  	$('#exampleModalCenter').modal();
	  	// results.innerHTML = results.innerHTML + `<br>${info}</b>`;
	  }
	  else if (response === "0"){
	  	$("#myAlert").append('<div class="alert alert-warning alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Failed to Create!</strong> The calendar: ' + calName + ' existed!</div>');
	  }
	  else if (response === "-1"){
	  	$("#myAlert").append('<div class="alert alert-warning alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Failed to Create!</strong> The End Time seems earlier than or equal to Start Time!</div>');
	  }
	  else if (response === "-2"){
	  	$("#myAlert").append('<div class="alert alert-warning alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Failed to Create!</strong> The End Date seems earlier than Start Date!</div>');
	  }
	  // results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		$("#myAlert").append('<div class="alert alert-danger alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Bit Problem!</strong> Failed to connect to server!</div>');
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

// function ShowCalendars(){
// 	showModal();
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

// 	  hideModal();
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

	showModal();

	var calID = localStorage.getItem("currentCalID");
	var schedule_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/schedule-meeting";
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
	  ShowAllMeetings();
	  results.innerHTML = `${response}`;
	  $("#myAlert").append('<div class="alert alert-success alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Congratulation!</strong> ' + response +'.</div>');
	  if (response !== "Failed to schedule meeting!"){
	  	$('#meetTimeSelect :selected').remove();
	  }
	  if (document.getElementById('meetTimeSelect').length == 0){
	  	var opt = document.createElement('option');
		opt.value = "";
		opt.innerHTML = "No Available TimeSlot";
		timeSelect.appendChild(opt);
	  }
	  hideModal();
	} else {
		results.innerHTML = `Failed to connect!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CancelMeeting(){
	showModal();
	var results = document.getElementById('resultsP');
	var calID = localStorage.getItem("currentCalID");
	var meetingID = document.getElementById('meetingSelect').value;
	results.innerHTML = `I am running...<br>`;
	if (meetingID === ""){
		results.innerHTML += `You have not slected anything!`;
		results.innerHTML += `<br>End.`;
		$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> You have not selected anything!</div>');
		return;	
	}
	
	var schedule_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/cancel-meeting";
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
	  	RetrieveOpenTimeslot({calID:localStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  successAlert("The meeting has been canceled!");
	  hideModal();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCIT(){

	var results = document.getElementById('resultsP');
	var calID = localStorage.getItem("currentCalID");
	var date = document.getElementById('citDate').value;
	var time = document.getElementById('citTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	if (date === "" || time === "No Available TimeSlot" || time === ""){
		results.innerHTML += `You must select both date and time to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert(`You must select both date and time to close!`);
		return;	
	}
	showModal();
	var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/close-ts";
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
	  	RetrieveOpenTimeslot({calID:localStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  document.getElementById('citTimeSelect').options[document.getElementById('citTimeSelect').selectedIndex].setAttribute("disabled", "disabled");
	  $('#citTimeSelect option:selected').next().attr('selected', 'selected');
	  hideModal();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATD(){
	var results = document.getElementById('resultsP');
	var calID = localStorage.getItem("currentCalID");
	var date = document.getElementById('catdDate').value;

	results.innerHTML = `I am running...<br>`;
	
	if (date === ""){
		results.innerHTML += `You must select a date to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert("You must select a date to close!");
		return;	
	}
	showModal();
	
	var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/close-ts";
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
	  	alert("This date had been closed!");	
	  }
	  document.getElementById('meetDate').value = '';
	  var timeSelect = document.getElementById('meetTimeSelect');
	  removeOptions(timeSelect);
	  var opt = document.createElement('option');
	  opt.innerHTML = "It will be filled after you select a date!";
	  timeSelect.appendChild(opt);
	  results.innerHTML += `<br>End.`;
	  hideModal();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATT(){
	var results = document.getElementById('resultsP');
	var calID = localStorage.getItem("currentCalID");
	var time = document.getElementById('cattTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	if (time === ""){
		results.innerHTML += `You must select a timeslot to close.`;
		results.innerHTML += `<br>End.`;
		infoAlert("You must select a timeslot to close!");
		return;	
	}
	showModal();
	
	var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/close-ts";
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
	  document.getElementById('cattTimeSelect').options[document.getElementById('cattTimeSelect').selectedIndex].setAttribute("disabled", "disabled");
	  $('#cattTimeSelect option:selected').next().attr('selected', 'selected');
	  results.innerHTML += `<br>End.`;
	  if (document.getElementById('meetDate').value !== ''){
	  	RetrieveOpenTimeslot({calID:localStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
	  }
	  hideModal();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function CloseCATDWT(){
	var results = document.getElementById('resultsP');
	var calID = localStorage.getItem("currentCalID");
	var day = document.getElementById('catdwtDaySelect').value;
	var time = document.getElementById('catdwtTimeSelect').value;

	results.innerHTML = `I am running...<br>`;
	
	// if (day === "" || time === "No Available TimeSlot" || time === ""){
	// 	results.innerHTML += `You must select both date and time to close.`;
	// 	results.innerHTML += `<br>End.`;
	// 	return;	
	// }
	showModal();
	var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/close-ts";
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
	  hideModal();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function LoadCalendars(){
	// var calendarNameArr = ["Professional", "Private"];
	// plotLoadCalendars(calendarNameArr, locationArr);
	var results = document.getElementById('resultsP');
	var calName = document.getElementById('calSelect').value;
	results.innerHTML = `I am running...`;
	if ( document.getElementById('calSelect').value=== "0") {
		$('#noCalendarModal').modal();
		return;
	}
	showModal();
	var load_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/load-calendar";
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
	  var calName = js["calName"];
	  var startDate = js["startDate"];
	  var endDate = js["endDate"];
	  var startTime = js["startTime"];
	  var endTime = js["endTime"];
	  var location = js["location"];
	  var duration = js["duration"];
	  if (response == "1"){
	  	document.getElementById("curP").innerHTML = "Current Calendar: " + `"${calName}"` + " range from " + `${startDate}` + 
	  												" to " + `${endDate}`;
	  	// results.innerHTML += "<br>Succeed!";
	  	successAlert("You have loaded calendar: " + calName + ".");
	  	results.innerHTML = results.innerHTML + '<br>End.</b>';

	  	
	  	document.getElementById('locationInput').setAttribute("value", location);
		document.getElementById('meetDate').setAttribute("min", startDate);
		document.getElementById('meetDate').setAttribute("max", endDate);
		document.getElementById('dailyMeetings').setAttribute("min", startDate);
		document.getElementById('dailyMeetings').setAttribute("max", endDate);
		document.getElementById('monthlyMeetings').setAttribute("min", startDate.substring(0,7));
		document.getElementById('monthlyMeetings').setAttribute("max", endDate.substring(0,7));
		document.getElementById("scheduleMeeting").setAttribute("style", "display:block");
		document.getElementById("showMeetings").setAttribute("style", "display:block");
		document.getElementById("closeTS").setAttribute("style", "display:block");
		document.getElementById("album").setAttribute("style", "display:block");
		helper();
		document.getElementById('ctsSelect').selectedIndex = "0";
		if (typeof(Storage) !== "undefined") {
			// Store
			localStorage.setItem("currentCalID", calID);
			localStorage.setItem("currentCalName", calName);
			localStorage.setItem("currentCalSD", startDate);
			localStorage.setItem("currentCalED", endDate);
			localStorage.setItem("currentCalST", startTime);
			localStorage.setItem("currentCalET", endTime);
			localStorage.setItem("currentCalDuration", duration);
			ShowAllMeetings();
			} else {
				document.getElementById("resultsP").innerHTML = "Sorry, your browser does not support Web Storage...";
				warningAlert("Sorry, your browser does not support Web Storage...Please change a browser.");
		}
	   }
	   else{
	   		document.getElementById("curP").innerHTML = "null";
	   		localStorage.clear();
	   		document.getElementById("scheduleMeeting").setAttribute("style", "display:none");
	   		document.getElementById("showMeetings").setAttribute("style", "display:none");
	   		document.getElementById("closeTS").setAttribute("style", "display:none");
	   		results.innerHTML = `${response}`;

	   }
		hideModal();										
	} else {
		results.innerHTML = `Failed to connect!`;
	}
	};
}

function RetrieveOpenTimeslot(context){
	if (context.date == ''){
		var timeSelect = document.getElementById('meetTimeSelect');
		removeOptions(timeSelect);
		var opt = document.createElement('option');
		opt.innerHTML = "It will be filled after you select a date!";
		mmeetTimeSelect.appendChild(opt);
		return;
	}
	showModal();
    var retrieve_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-ts";
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
				warningAlert("This date is not available!");
				document.getElementById("resultsP").innerHTML += "<br>End.</b>";
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
		hideModal();
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";

      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function RetrieveNonCloseTimeslot(context){
    var retrieve_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-ts";
    var xhr = new XMLHttpRequest();	
    if (context.date === ""){
    	xhr.open("GET", retrieve_url + "?calID=" + context.calID + "&type=" + "NonClose", true);
    }
    else{
    	xhr.open("GET", retrieve_url + "?calID=" + context.calID + "&avaiDate=" + context.date + "&type=" + "NonClose", true);
    }
    showModal();

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
			warningAlert("This date is not available!")
			// alert("This date is not available!");
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
			timeSelect.appendChild(opt);
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		hideModal();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowAllMeetings(){
	document.getElementById("resultsP").innerHTML = "I am running...";
	// if (localStorage.getItem("currentCalID") === null){

	// 	document.getElementById("resultsP").innerHTML += "<br>Current calendar is null, please load a calendar first.<br>End.";
	// 	return;
	// }

    var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-am";
    var xhr = new XMLHttpRequest();	
    var calID = localStorage.getItem("currentCalID");

    showModal();

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
			$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> There is no scheduled meeting in calendar: ' + localStorage.getItem("currentCalName") + '.</div>');
			document.getElementById("resultsP").innerHTML += "<br>End.";
			return;
		}
		document.getElementById("resultsP").innerHTML += "<br>End.</b>";
		hideModal();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowDailyMeetings(){

    var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-dm";
    var xhr = new XMLHttpRequest();	
    var calID = localStorage.getItem("currentCalID");
    var meetDate = document.getElementById('dailyMeetings').value;
    document.getElementById("resultsP").innerHTML = "I am running...";	
    if (meetDate === ""){
    	$('#meetingSelect').empty();
    	document.getElementById("resultsP").innerHTML += "<br>Please choose a date.<br>End.";	
    	warningAlert("Please choose a date!");
    	return;	
    }
    
    showModal();

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
			$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> There is no scheduled meeting on ' + meetDate + '.</div>');
			document.getElementById("resultsP").innerHTML += "<br> There is no scheduled meeting on " + `${meetDate}.` ;
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
		hideModal();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function ShowMonthlyMeetings(){
    var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-mm";
    var xhr = new XMLHttpRequest();	
    var calID = localStorage.getItem("currentCalID");
    var yearMonth = document.getElementById('monthlyMeetings').value;
    document.getElementById("resultsP").innerHTML = "I am running...";
    if (yearMonth === ""){
    	$('#meetingSelect').empty();
    	document.getElementById("resultsP").innerHTML += "<br>Please choose a month.<br>End.";	
    	warningAlert("Please choose a month!");
    	return;	
    }
    showModal();

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
			$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> There is no scheduled meeting in ' + yearMonth + '.</div>');
			document.getElementById("resultsP").innerHTML += "<br> There is no scheduled meeting in " + `${yearMonth}.` ;
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
		hideModal();
      
    } else {
        document.getElementById("resultsP").innerHTML = `Failed to connect!`;
    }
    };
}

function loadCalSelect(){
	showModal();
	var results = document.getElementById('resultsP');
	results.innerHTML = `I am running...`;
	var show_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/show-calendar";
	var data = {};
	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", show_url, true);
	// send the collected data as JSON
	xhr.send(js);
	
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  // results.innerHTML = `Created calendars: ${response}`;
	  results.innerHTML = results.innerHTML + '<br>End.</b>';
	  var select = document.getElementById('calSelect');
	  for (var i in js["ArrayList"]){
			var opt = document.createElement('option');
			opt.value = js["ArrayList"][i];
			opt.innerHTML = js["ArrayList"][i];
			select.appendChild(opt);
		}
		hideModal();
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

function infoAlert(text){
	$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> ' + text + '</div>');
}

function warningAlert(text){
	$("#myAlert").append('<div class="alert alert-warning alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> ' + text + '</div>');
}

function successAlert(text){
	$("#myAlert").append('<div class="alert alert-success alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Congratulation!</strong> ' + text + '</div>');
}


function hideModal(){
	 $("#loadingModal").removeClass("in");
    $(".modal-backdrop").remove();
    
  $("#loadingModal").modal("hide");
  // $('.modal.in').modal('hide');
}

function showModal(){
 	// initLoading();
 	// myModal.modal();
 	// localStorage.setItem("flag", true);
 	$(".modal-backdrop").show();
	$("#loadingModal").modal('show');
	// document.getElementById("loadingModal").setAttribute("style", "display:block");
	// alert(localStorage.getItem("flag"));


}

// function initLoading(){
// 	myModal = $('<div class="modal fade" id="loadingModal">' +
// 			// '<div class="modal-backdrop">'+
//             '<div style="width: 500px;height:20px; z-index: 20000; position: absolute; text-align: center; left: 40%; top: 50%;margin-left:-100px;margin-top:-10px">' +
//             '<div class="progress progress-striped active" style="margin-bottom: 0;">' +
//             '<div class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style="width: 100%;" aria-hidden="true"></div>' +
//             "</div>" +
//             '<h5>I am running, Please wait... <br> But, if you have waited several minutes, you know...</h5>' +
//             "</div>" +
// 			// '</div>' +
//             " </div>" );
//     $("body").append(myModal);
// }



// function plotLoadCalendars(arr1, arr2){
// 		var values = [arr1];

// 		var data = [{
// 		  type: 'table',
// 		  header: {
// 		    values: ["Calendar Name"],
// 		    align: "center",
// 		    line: {width: 1, color: 'black'},
// 		    fill: {color: "grey"},
// 		    font: {family: "Arial", size: 12, color: "white"}
// 		  },
// 		  cells: {
// 		    values: values,
// 		    align: "center",
// 		    line: {color: "black", width: 1},
// 		    font: {family: "Arial", size: 11, color: ["black"]}
// 		  }

// 		}]

// 		Plotly.plot('AvaCalendar', data);
// }



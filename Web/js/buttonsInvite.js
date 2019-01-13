




function setLocalStorage(){
	loadTimeout();
	var calID = oneValue();
	var load_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/load-calendar";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", load_url + "?calID=" + calID, true);
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
		var userEmail = js["userEmail"];
		var calName = js["calName"];
		var startDate = js["startDate"];
		var endDate = js["endDate"];
		var startTime = js["startTime"];
		var endTime = js["endTime"];
		var location = js["location"];
		var duration = js["duration"];


		if (response == "1"){
			localStorage.setItem("currentCalID", calID);
			localStorage.setItem("userNickName", userNickName);
			localStorage.setItem("userName", userName);
			localStorage.setItem("userEmail", userEmail);
			localStorage.setItem("currentCalName", calName);
			localStorage.setItem("currentCalSD", startDate);
			localStorage.setItem("currentCalED", endDate);
			localStorage.setItem("currentCalST", startTime);
			localStorage.setItem("currentCalET", endTime);
			localStorage.setItem("currentCalDuration", duration);
			localStorage.setItem("currentCalLocation", location);

			var dateArray = [];
				for (i in js["ArrayList"]){
					dateArray.push(js["ArrayList"][i]);
				}	
			localStorage.setItem("currentCalAllDates", JSON.stringify(dateArray));
		}
		else {
			alert("setLocalStorage failed!");
		}
		hideLoader();									
	} else {
		alert(`Failed to connect!`);
	}
	meetDateDatepiker();
	dailyMeetingsDatepiker();
	document.getElementById("curP").innerHTML = "The calendar ranges from " + localStorage.getItem("currentCalSD") + 
												" to " + localStorage.getItem("currentCalED");
	document.getElementById("hostNickName").innerHTML = 'Inviter: ' + localStorage.getItem("userNickName"); 					
	document.getElementById("hostEmail").innerHTML += "Inviter's Email: " + localStorage.getItem("userEmail");	
	// document.getElementById("whotomeet").setAttribute("value", localStorage.getItem('userNickName'));	
	document.getElementById('locationInput').setAttribute("value", localStorage.getItem("currentCalLocation"));
	
	};
}



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
	var calID = localStorage.getItem("currentCalID");
	var meetingID = document.getElementById('meetingSelect').value;
	results.innerHTML = `I am running...<br>`;
	if (meetingID === ""){
		results.innerHTML += `You have not slected anything!`;
		results.innerHTML += `<br>End.`;
		infoAlert("You have not selected anything!")
		return;	
	}
	loadTimeout();
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
	  // hideLoader();
	} else {
		results.innerHTML = `Failed!`;
	  //updateHistory(arg1, arg2, "N/A");
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
    var retrieve_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-ts";
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
	// if (localStorage.getItem("currentCalID") === null){

	// 	document.getElementById("resultsP").innerHTML += "<br>Current calendar is null, please load a calendar first.<br>End.";
	// 	return;
	// }

    var url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/retrieve-am";
    var xhr = new XMLHttpRequest();	
    var calID = localStorage.getItem("currentCalID");

    
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
			$("#myAlert").append('<div class="alert alert-info alert-dismissible" ><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Heads Up!</strong> There is no scheduled meeting in calendar: ' + localStorage.getItem("currentCalName") + '.</div>');
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
	loadTimeout();
	
	var show_url = "https://oi7iisyjp1.execute-api.us-east-2.amazonaws.com/Alpha/get-current-user";
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
		document.getElementById("userNickName").innerHTML = 'Hi ' + js["userNickName"]; 

		// results.innerHTML = `Created calendars: ${response}`;
		hideLoader();

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
        	var disabled = localStorage.getItem("currentCalAllDates");
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
        	var disabled = localStorage.getItem("currentCalAllDates");
            if (disabled.indexOf(date.getFullYear() + "-" + (monthHelper(date.getMonth()+1)) + "-" + dateHelper(date.getDate())) != -1 ) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function meetDateChangeTime(){
	$("#meetDate").on("change", function() {
            // $("#timeSelect").empty();
            alert("what");
            RetrieveOpenTimeslot({calID:localStorage.getItem("currentCalID"), date:document.getElementById('meetDate').value, type:"Open"});
           });
}


function loadTimeout(){
	document.getElementById("loader").style.display = "block";
	setTimeout(hideLoader, 30000);
}
function hideLoader(){
	document.getElementById("loader").style.display = "none";
}

// var myScript = document.createElement("script");
		// myScript.textContent = "$('#meetDate').datepicker({" +
		// 						"uiLibrary: 'bootstrap4'," +
		// 			            "format: 'yyyy-mm-dd'," +
		// 			            "minDate: '2018-11-01'," +
		// 						"maxDate: '2018-11-10'" +
		// 						// "disableDates: localStorage.getItem('dateArray')" +
		// 						"});"; 
		// document.head.appendChild(myScript);

		// localStorage.getItem('currentCalSD')
		// document.getElementById('modifyDate').value
// 		test = $('<script>' +
//             "$('#meetDate').datepicker({" +
// 			"uiLibrary: 'bootstrap4'," +
//             "format: 'yyyy-mm-dd'," +
//             "minDate: '2018-11-01'," +
// 			"maxDate: '2018-11-10'," +
// 			// "disableDates: localStorage.getItem('dateArray')" +
// 			"});" +
//             " </script>" );
//         $("body").append(test);	



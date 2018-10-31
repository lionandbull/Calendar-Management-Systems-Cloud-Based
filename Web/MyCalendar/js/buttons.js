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
    window.open('./addCalendar.html','POPUPW','width=900,height=700,scrollbars=yes,resizable=yes');
    form.target = 'POPUPW';
}


function updateHistory(){

}

function removeCalendar(){
	var results = document.getElementById('results');
	results.innerHTML = results.innerHTML + `<br>I am running...</b>`;
	var calName = document.removeForm.removeCalendar.value;
	if (calName === "") {
		results.innerHTML = results.innerHTML + `<br>You haven't type anything! Please try again.</b>`;
		return;
	}
	var remove_url = "https://35nacemdg3.execute-api.us-east-2.amazonaws.com/Alpha/remove-calendar";
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
	  
	  results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  // var response = js["Result"];
	  // results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		// results.innerHTML = results.innerHTML + `<br>Failed</b>`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}


function submit(){

	var results = document.getElementById('results');
	results.innerHTML = results.innerHTML + `<br>I am running...</b>`;
	var div_para = document.parameterForm;
	// history.innerHTML = history.innerHTML + `<br>${calName} </b>`;

	var calName = div_para.calendarName.value;
	var startDate = div_para.startDate.value;
	var endDate = div_para.endDate.value;
	var startTime = div_para.startTime.value;
	var endTime = div_para.endTime.value;
	var duration = div_para.duration.value;
	var location = div_para.location.value;
	if (calName === "" || startDate === "" || endDate === "" || startTime === "" || endTime === "" || duration === "" || location === "") {
		results.innerHTML = results.innerHTML + `<br>Please complete all forms</b>`;
		return;
	}
  	var create_url = "https://35nacemdg3.execute-api.us-east-2.amazonaws.com/Alpha/create-calendar"
	var data = {};
	data["calName"] = calName;
	data["startDate"] = startDate;
	data["endDate"] = endDate;
	data["startTime"] = startTime;
	data["endTime"] = endTime;
	data["duration"] = duration;
	data["location"] = location;

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
	
	  
	  results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  if (typeof info != 'undefined'){
	  	results.innerHTML = results.innerHTML + `<br>${info}</b>`;
	  }
	  results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		results.innerHTML = results.innerHTML + `<br>Failed</b>`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};

}

function ShowCalendars(){
	var calendars = document.getElementById('results');
	results.innerHTML = results.innerHTML + `<br>I am running...</b>`;
	var show_url = "https://35nacemdg3.execute-api.us-east-2.amazonaws.com/Alpha/show-calendar";
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
	  
	  results.innerHTML = results.innerHTML + `<br>Created calendars: ${response}</b>`;
	  results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  
	  // var response = js["Result"];
	  // results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		// results.innerHTML = results.innerHTML + `<br>Failed</b>`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function LoadCalendars(){
	// var calendarNameArr = ["Professional", "Private"];
	// plotLoadCalendars(calendarNameArr, locationArr);
	var results = document.getElementById('curCalendar');
	var calName = document.loadForm.loadCalendar.value;
	results.innerHTML = results.innerHTML + `<br>I am running...</b>`;
	if (calName === "") {
		results.innerHTML = results.innerHTML + `<br>You haven't type anything! Please try again.</b>`;
		return;
	}
	var load_url = " https://35nacemdg3.execute-api.us-east-2.amazonaws.com/Alpha/load-calendar";
	var data = {};
	data["calName"] = calName;
	var js = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", load_url, true);
	// send the collected data as JSON
	xhr.send(js);
	// This will process results and update HTML as appropriate. 
	xhr.onloadend = function () {
	if (xhr.readyState == XMLHttpRequest.DONE) {
	  //nowtime();
	  var js = JSON.parse(xhr.responseText);
	  var response = js["Result"];
	  
	  results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  results.innerHTML = results.innerHTML + `<br>---------------------</b>`;
	  // var response = js["Result"];
	  // results.innerHTML = results.innerHTML + `<br>${response}</b>`;
	  //updateHistory(arg1, arg2, xhr.responseText);
	} else {
		// results.innerHTML = results.innerHTML + `<br>Failed</b>`;
	  //updateHistory(arg1, arg2, "N/A");
	}
	};
}

function plotLoadCalendars(arr1, arr2){
		var values = [arr1];

		var data = [{
		  type: 'table',
		  header: {
		    values: ["Calendar Name"],
		    align: "center",
		    line: {width: 1, color: 'black'},
		    fill: {color: "grey"},
		    font: {family: "Arial", size: 12, color: "white"}
		  },
		  cells: {
		    values: values,
		    align: "center",
		    line: {color: "black", width: 1},
		    font: {family: "Arial", size: 11, color: ["black"]}
		  }

		}]

		Plotly.plot('AvaCalendar', data);
}



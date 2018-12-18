package com.amazonaws.neutron.model;

public class Meeting {
	public final String meetingID;
	public final String calendarID;
	public final String timeSlotID;
	public final String time;
	public final String meetingWith;
	public final String location;
	public final String meetDate;
	
	public Meeting(String meetingID, String calendarID, String timeSlotID, String time, String meetingWith,
			String location, String meetDate) {
		super();
		this.meetingID = meetingID;
		this.calendarID = calendarID;
		this.timeSlotID = timeSlotID;
		this.time = time;
		this.meetingWith = meetingWith;
		this.location = location;
		this.meetDate = meetDate;
	}

	@Override
	public String toString() {
		return "Meeting with" + meetingWith + " on " + meetDate + " " + time + " at " + location;
	}
	
	
	
	
	
	
}

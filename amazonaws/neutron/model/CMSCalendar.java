package com.amazonaws.neutron.model;

public class CMSCalendar {
	public final String calendarID;
	public final String calendarName;
	public final String startDate;
	public final String endDate;
	public final String startTime;
	public final String endTime;
	public final String duration;
	public final String location;
	public final String organizer;
	
	public CMSCalendar(String calendarID, String calendarName, String startDate, String endDate, String startTime,
			String endTime, String duration, String location, String organizer) {
		this.calendarID = calendarID;
		this.calendarName = calendarName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.startTime = startTime;
		this.endTime = endTime;
		this.duration = duration;
		this.location = location;
		this.organizer = organizer;
	}

	@Override
	public String toString() {
		return "Calendar [calendarID=" + calendarID + ", calendarName=" + calendarName + ", startDate=" + startDate
				+ ", endDate=" + endDate + ", startTime=" + startTime + ", endTime=" + endTime + ", duration="
				+ duration + ", location=" + location + ", organizer=" + organizer + "]";
	}
	
	
}

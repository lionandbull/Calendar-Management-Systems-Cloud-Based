package com.amazonaws.neutron.model;

public class TimeSlot {
	public final String timeSlotID;
	public final String availableDateID;
	public final String startTime;
	public final String availability;
	
	public TimeSlot(String timeSlotID, String availableDateID, String startTime, String availability) {
		super();
		this.timeSlotID = timeSlotID;
		this.availableDateID = availableDateID;
		this.startTime = startTime;
		this.availability = availability;
	}

	@Override
	public String toString() {
		return "startTime=" + startTime;
	}
	
	
	
	
	
	
}

package com.amazonaws.neutron.util;

public class TimeHelper {
	int hour, minute;
	
	public TimeHelper() {
		
	}
	
	public TimeHelper(int hour, int minute) {
		// TODO Auto-generated constructor stub
		this.hour = hour;
		this.minute = minute;
	}
	
	
	public boolean after(TimeHelper d) {
		if (this.hour > d.hour) {
			return true;
		}
		if (this.hour < d.hour){
			return false;
		}
		// this.hour == d.hour
		if (this.minute > d.minute) {
			return true;
		}
		return false;
	}
	
	public boolean equals(TimeHelper d) {
		if (this.hour == d.hour && this.minute == d.minute) {
			return true;
		}
		return false;
	}
	// In this project, startTime & endTime happened in same day, i.e. the case that adding some hours to make the time exceed 23:59 will not happen; 
	public void addHour(int h) {
		this.hour += h;
	}
	
	public void addMinute(int m) {
		int tmpM =this.minute + m;
		if (tmpM >= 60) {
			this.hour += 1;
			this.minute = tmpM - 60;
		}
		else {
			this.minute = tmpM;
		}
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		String s = "";
		if (hour < 10 && hour > 0) {
			s += "0" + hour; 
		}
		else if (hour == 0){
			s += "00";
		}
		else {
			s += hour;
		}
		s += ":";
		if (minute < 10 && minute > 0) {
			s += "0" + minute;
		}
		else if (minute == 0) {
			s += "00";
		}
		else {
			s += minute;
		}
		return s;
	}
}

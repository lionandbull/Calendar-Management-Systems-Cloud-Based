package com.amazonaws.neutron.util;

import java.awt.List;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.UUID;

public class Util {
	public static void Initialization(java.sql.Connection conn , String calendarID, String startDate, String endDate,
    		String startTime, String endTime, String duration) throws Exception {
		try {
			// Insert available dates depends on startDate & endDate
			PreparedStatement psDate = conn.prepareStatement("INSERT INTO AvailableDate (AvailableDateID, CalendarID, Date, Day, Availability)"
					+ " values(?,?,?,?,?);");
			PreparedStatement psTimeSlot = conn.prepareStatement("INSERT INTO TimeSlot (TimeSlotID, AvailableDateID, StartTime, Availability)"
					+ " values(?,?,?,?);");
			
			for (String ele : calculateDate(startDate, endDate)) {
				String AvailabelDateID = UUID.randomUUID().toString().substring(0, 20);
		        psDate.setString(1, AvailabelDateID);
		        psDate.setString(2, calendarID);
		        psDate.setString(3, ele);
		        String day = toDayHelper(ele);
		        psDate.setString(4, day);
		        psDate.setString(5, "Open");
		        psDate.addBatch();
		        
		        for (String ele2 : calculateTimeSlot(startTime, endTime, duration)) {
		        	String TimeSlotID = UUID.randomUUID().toString().substring(0, 20);
		        	psTimeSlot.setString(1, TimeSlotID);
		        	psTimeSlot.setString(2, AvailabelDateID);
		        	psTimeSlot.setString(3, ele2);
		        	psTimeSlot.setString(4, "Open");
		        	psTimeSlot.addBatch();
		        	
		        }
			}
			psDate.executeBatch();
			psTimeSlot.executeBatch();
		}
		catch (Exception e) {
			// TODO: handle exception
			throw new Exception("Failed to insert: " + " " + e.getMessage());
		}
	}
	
	public static ArrayList<String> calculateTimeSlot(String startTime, String endTime, String duration) {
		ArrayList<String> result = new ArrayList<>();
		TimeHelper now = toTimeHelper(startTime);
		while (toTimeHelper(endTime).after(now) || toTimeHelper(endTime).equals(now)) {
			result.add(now.toString());
			// Consider boundary conditions !
			now.addMinute(Integer.parseInt(duration));
		}
		return result;
	}
	
	public static void main(String[] args) {
		System.out.println(calculateDate("2018-12-01", "2019-01-15").toString());
	}
	private static ArrayList<String> calculateDate(String startDate, String endDate) {
		ArrayList<String> result = new ArrayList<>();
		DateHelper now = toDateHelper(startDate);		
		while (toDateHelper(endDate).after(now) || toDateHelper(endDate).equals(now)) {
			result.add(now.toString());
			now.addDate(1);
		}
		return result;
	}
	
	public static DateHelper toDateHelper(String d) {
		DateHelper dateHelper = new DateHelper();
		dateHelper.year = Integer.parseInt(d.substring(0, 4));
		if (d.substring(5, 6).equals("0")) {
			dateHelper.month = Integer.parseInt(d.substring(6, 7));
		}
		else {
			dateHelper.month = Integer.parseInt(d.substring(5, 7));
		}
		if (d.substring(8, 9).equals("0")) {
			dateHelper.date = Integer.parseInt(d.substring(9, 10));
		}
		else {
			dateHelper.date = Integer.parseInt(d.substring(8, 10));
		}
		return dateHelper;
	}
	
	public static TimeHelper toTimeHelper(String d) {
		TimeHelper timeHelper = new TimeHelper();
		
		if (d.substring(0, 1).equals("0")) {
			timeHelper.hour = Integer.parseInt(d.substring(1, 2));
		}
		else {
			timeHelper.hour = Integer.parseInt(d.substring(0, 2));
		}
		if (d.substring(3, 4).equals("0")) {
			timeHelper.minute = Integer.parseInt(d.substring(4, 5));
		}
		else {
			timeHelper.minute = Integer.parseInt(d.substring(3, 5));
		}
		return timeHelper;
	}
	
	public static String toDayHelper(String d) {
		DateHelper date = toDateHelper(d);
		Calendar c = Calendar.getInstance();
		c.set(date.year, date.month-1, date.date);
		return "" + c.get(Calendar.DAY_OF_WEEK);
	}
	
}

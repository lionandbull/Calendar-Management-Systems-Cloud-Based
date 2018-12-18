package com.amazonaws.neutron.db;

import java.util.List;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.UUID;

import com.amazonaws.neutron.model.*;
import com.amazonaws.neutron.util.DateHelper;
import com.amazonaws.neutron.util.TimeHelper;
import com.amazonaws.neutron.util.Util;

import apple.laf.JRSUIConstants.ShowArrows;

class TimeComparator implements Comparator<TimeSlot> 
{ 
    // Used for sorting in ascending order of 
    // roll number 
    public int compare(TimeSlot t1, TimeSlot t2) 
    { 
    	TimeHelper t1_ = Util.toTimeHelper(t1.startTime);
    	TimeHelper t2_ = Util.toTimeHelper(t2.startTime);
    	if (t1_.after(t2_)) {
    		return 1;
    	}
    	return -1;
//    	return a.rollno - b.rollno; 
    } 
} 

public class DatabaseDAO {
	java.sql.Connection conn;
//	String check = "Original11";
    public DatabaseDAO() {
    	try  {
    		conn = DatabaseUtil.connect();
    	} catch (Exception e) {
    		conn = null;
    	}
    }
    public static void main(String[] args) throws Exception {
//    	DatabaseDAO dao = new DatabaseDAO();
//		CMSCalendar calendar = new CMSCalendar("dqwd1231231231321", "personal", "2018-11-14", "2018-11-16", "09:00", "13:00", "30", "WPI", "neutron");
		
//    	dao.showAllCalendar();
//    	dao.removeCalendar("personal");
//    	dao.removeCalendar("Personal2");
//    	dao.removeCalendar("Personal3");
//    	dao.showAllCalendar();
//    	dao.createCalendar(calendar);
		
//		ArrayList<TimeSlot> result = dao.retrieveTimeslots("9e8f3e61-00d4-431b-b", "2018-11-16", "Open");
//		result.sort(new TimeComparator());
//		System.out.println(result.toString());
		
//		System.out.println(dao.scheduleMeeting("0296915c-b96e-4bb5-8", "2018-11-15", "09:00", "Connie", "WPI"));
//		System.out.println(dao.getAllDates("test2").size());
		
		
	}
    
    public String closeCIT(String calID, String date, String time) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE Date = ? AND CalendarID = ?;");
    		ps.setString(1, date);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
    		String availableID = "";
    		if (resultSet.next()) {
    			availableID = resultSet.getString("AvailableDateID");
    		}
	        
	        // Set the timeSlot as Close
	        ps = conn.prepareStatement("UPDATE TimeSlot " + "SET Availability = ? WHERE AvailableDateID = ? AND StartTime = ?;");
	        ps.setString(1, "Close");
	        ps.setString(2, availableID);
	        ps.setString(3, time);
	        ps.execute();
            return "Succeed";

        } catch (Exception e) {
            throw new Exception("Failed in scheduling meeting: " + e.getMessage());
        }
    }
    
    public String closeCATD(String calID, String date) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE Date = ? AND CalendarID = ?;");
    		ps.setString(1, date);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
    		String availableID = "";
    		if (resultSet.next()) {
    			if (resultSet.getString("Availability").equals("Close")) {
    				return null;
    			}
    		}
    		
    		
	        // Set the date as Close
    		ps = conn.prepareStatement("UPDATE AvailableDate " + "SET Availability = ? WHERE Date = ? AND CalendarID = ?;");
	        ps.setString(1, "Close");
	        ps.setString(2, date);
	        ps.setString(3, calID);
	        ps.execute();
            return "Succeed";

        } catch (Exception e) {
            throw new Exception("Failed in scheduling meeting: " + e.getMessage());
        }
    }
    
    public String closeCATT(String calID, String time) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE CalendarID = ?;");
    		ps.setString(1, calID);
    		ResultSet resultSet = ps.executeQuery();
    		
    		while (resultSet.next()) {
    			ps = conn.prepareStatement("UPDATE TimeSlot " + "SET Availability = ? WHERE StartTime = ? AND AvailableDateID = ?;");
    	        ps.setString(1, "Close");
    	        ps.setString(2, time);
    	        ps.setString(3, resultSet.getString("AvailableDateID"));
    	        ps.execute();
    		}
    		
            return "Succeed";

        } catch (Exception e) {
            throw new Exception("Failed in scheduling meeting: " + e.getMessage());
        }
    }
    
    public String closeCATDWT(String calID, String day, String time) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE Day = ? AND CalendarID = ?;");
    		ps.setString(1, day);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
    		String availableID = "";
    		while (resultSet.next()) {
    			availableID = resultSet.getString("AvailableDateID");
    			// Set the timeSlot as Close
    	        ps = conn.prepareStatement("UPDATE TimeSlot " + "SET Availability = ? WHERE AvailableDateID = ? AND StartTime = ?;");
    	        ps.setString(1, "Close");
    	        ps.setString(2, availableID);
    	        ps.setString(3, time);
    	        ps.execute();
    		}
            return "Succeed";

        } catch (Exception e) {
            throw new Exception("Failed in scheduling meeting: " + e.getMessage());
        }
    }
    
    
    
    public boolean addDate(String calID, String date, String startTime, String endTime, String duration) throws Exception {
    	try {
    		
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE CalendarID = ? AND Date = ?;");
    		ps.setString(1, calID);
    		ps.setString(2, date);
    		ResultSet resultSet = ps.executeQuery();
    		if (resultSet.next()) {
    			return false;
    		}
    		
    		PreparedStatement psDate = conn.prepareStatement("INSERT INTO AvailableDate (AvailableDateID, CalendarID, Date, Day, Availability)"
					+ " values(?,?,?,?,?);");
    		String AvailabelDateID = UUID.randomUUID().toString().substring(0, 20);
    		psDate.setString(1, AvailabelDateID);
	        psDate.setString(2, calID);
	        psDate.setString(3, date);
	        String day = Util.toDayHelper(date);
	        psDate.setString(4, day);
	        psDate.setString(5, "Open");
	        psDate.execute();
	        
	        PreparedStatement psTimeSlot = conn.prepareStatement("INSERT INTO TimeSlot (TimeSlotID, AvailableDateID, StartTime, Availability)"
					+ " values(?,?,?,?);");
	        
	        for (String ele2 : Util.calculateTimeSlot(startTime, endTime, duration)) {
	        	String TimeSlotID = UUID.randomUUID().toString().substring(0, 20);
	        	psTimeSlot.setString(1, TimeSlotID);
	        	psTimeSlot.setString(2, AvailabelDateID);
	        	psTimeSlot.setString(3, ele2);
	        	psTimeSlot.setString(4, "Open");
	        	psTimeSlot.addBatch();
	        }
	        psTimeSlot.executeBatch();
            return true;

        } catch (Exception e) {
            throw new Exception("Failed in adding Date: " + e.getMessage());
        }
    }
    
    public boolean removeDate(String calID, String date) throws Exception {
    	try {
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE CalendarID = ? AND Date = ?;");
    		ps.setString(1, calID);
    		ps.setString(2, date);
    		ResultSet resultSet = ps.executeQuery();
    		if (!resultSet.next()) {
    			return false;
    		}
    		
    		ps = conn.prepareStatement("DELETE FROM AvailableDate WHERE CalendarID = ? AND Date = ?;");
            ps.setString(1, calID);
            ps.setString(2, date);
            ps.execute();
            return true;

        } catch (Exception e) {
            throw new Exception("Failed in removing Date: " + e.getMessage());
        }
    }
    
    public boolean cancelMeeting(String calID, String meetingID) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM Meeting WHERE CalendarID = ? AND MeetingID = ?;");
    		ps.setString(1, calID);
    		ps.setString(2, meetingID);
    		ResultSet resultSet = ps.executeQuery();
    		String timeSlotID = "";
    		if (resultSet.next()) {
    			timeSlotID = resultSet.getString("TimeSlotID");
    		}
    		else {
    			return false;
    		}
    		ps = conn.prepareStatement("DELETE FROM Meeting WHERE CalendarID = ? AND MeetingID = ?;");
    		ps.setString(1, calID);
    		ps.setString(2, meetingID);
    		ps.execute();
	        
    		//Check whether availability is Close or not 
    		ps = conn.prepareStatement("SELECT * FROM TimeSlot WHERE TimeSLotID = ?;");
    		ps.setString(1, timeSlotID);
    		resultSet = ps.executeQuery();
    		if (resultSet.next()) {
    			if (resultSet.getString("Availability").equals("Close")) {
    				return true;
    			}
    		}
    		
	        // Set the timeSlot as Open
	        ps = conn.prepareStatement("UPDATE TimeSlot " + "SET Availability = ? WHERE TimeSLotID = ?;");
	        ps.setString(1, "Open");
	        ps.setString(2, timeSlotID);
	        ps.execute();
            return true;

        } catch (Exception e) {
            throw new Exception("Failed in cancel meetings: " + e.getMessage());
        }
    }
    
    
    
    public String scheduleMeeting(String calID, String meetDate, String meetTime, String who, String location) throws Exception {
    	try {
    		// Find relevant available ID
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE Date = ? AND CalendarID = ?;");
    		ps.setString(1, meetDate);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
    		String availableID = "";
    		if (resultSet.next()) {
    			availableID = resultSet.getString("AvailableDateID");
    		}
    		
    		// Find relevant timeSlot ID
    		ps = conn.prepareStatement("SELECT * FROM TimeSlot WHERE AvailableDateID = ? AND StartTime = ?;");
            ps.setString(1, availableID);
            ps.setString(2, meetTime);
            resultSet = ps.executeQuery();
            String timeSlotID = "";
            String availability = "";
            String startTime = "";
            String yearMonth = meetDate.substring(0, 7);
            if (resultSet.next()) {
    			timeSlotID = resultSet.getString("TimeSlotID");
    			startTime = resultSet.getString("StartTime");
    			availability = resultSet.getString("Availability");
    		}
            if (availability.equals("Busy")) {
            	return "Busy";
            }
            if (availability.equals("Close")) {
            	return "Close";
            }
            // Schedule meeting
            ps = conn.prepareStatement("INSERT INTO Meeting (MeetingID, CalendarID, TimeSlotID, MeetingWith, Location, Time, MeetDate, YearMonth)" + " values(?,?,?,?,?,?,?,?);");
            String meetID = UUID.randomUUID().toString().substring(0, 20);
            ps.setString(1, meetID);
            ps.setString(2, calID);
	        ps.setString(3, timeSlotID);
	        ps.setString(4, who);
	        ps.setString(5, location);
	        ps.setString(6, startTime);
	        ps.setString(7, meetDate);
	        ps.setString(8, yearMonth);
	        ps.execute();
	        
	        // Set the timeSlot as Busy
	        ps = conn.prepareStatement("UPDATE TimeSlot " + "SET Availability = ? WHERE TimeSLotID = ?;");
	        ps.setString(1, "Busy");
	        ps.setString(2, timeSlotID);
	        ps.execute();
            return "Succeed";

        } catch (Exception e) {
            throw new Exception("Failed in scheduling meeting: " + e.getMessage());
        }
    }
    
    public ArrayList<Meeting> retrieveDailyMeetings(String calID, String meetDate) throws Exception{
    	ArrayList<Meeting> result = new ArrayList<Meeting>();
    	try {
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM Meeting WHERE MeetDate = ? AND CalendarID = ?;");
    		ps.setString(1, meetDate);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
            
            while (resultSet.next()) {
            	result.add(generateMeeting(resultSet));
            }
            return result;

        } catch (Exception e) {
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    public ArrayList<Meeting> retrieveMonthlyMeetings(String calID, String yearMonth) throws Exception{
    	ArrayList<Meeting> result = new ArrayList<Meeting>();
    	try {
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM Meeting WHERE YearMonth = ? AND CalendarID = ?;");
    		ps.setString(1, yearMonth);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
            
            while (resultSet.next()) {
            	result.add(generateMeeting(resultSet));
            }
            return result;

        } catch (Exception e) {
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    public ArrayList<Meeting> retrieveAllMeetings(String calID) throws Exception{
    	ArrayList<Meeting> result = new ArrayList<Meeting>();
    	try {
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM Meeting WHERE CalendarID = ?;");
    		ps.setString(1, calID);
    		ResultSet resultSet = ps.executeQuery();
            
            while (resultSet.next()) {
            	result.add(generateMeeting(resultSet));
            }
            return result;

        } catch (Exception e) {
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    public ArrayList<TimeSlot> retrieveTimeslots(String calID, String avaiDate, String type) throws Exception{
    	ArrayList<TimeSlot> result = new ArrayList<TimeSlot>();
    	try {
    		boolean flag = false;
    		if (avaiDate == "") {
    			PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE CalendarID = ?;");
    			ps.setString(1, calID);
    			ResultSet resultSet = ps.executeQuery();
        		String availableID;
        		if (resultSet.next()) {
        			availableID = resultSet.getString("AvailableDateID");
//        			result.add(availableID);
//        			return result;
        		}
        		else {
        			return null;
        		}
        		
        		ps = conn.prepareStatement("SELECT * FROM TimeSlot WHERE AvailableDateID = ?;");
                ps.setString(1, availableID);
                resultSet = ps.executeQuery();
                while (resultSet.next()) {
                	result.add(generateTimeSlot(resultSet));
                 }
               
                return result;
        		
    		}
    		
    		PreparedStatement ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE Date = ? AND CalendarID = ?;");
    		ps.setString(1, avaiDate);
    		ps.setString(2, calID);
    		ResultSet resultSet = ps.executeQuery();
    		String availableID;
    		if (resultSet.next()) {
    			availableID = resultSet.getString("AvailableDateID");
    			if (resultSet.getString("Availability").equals("Close")) {
    				return null;
    			}
//    			result.add(availableID);
//    			return result;
    		}
    		else {
    			return null;
    		}
    		
    		ps = conn.prepareStatement("SELECT * FROM TimeSlot WHERE AvailableDateID = ?;");
            ps.setString(1, availableID);
            resultSet = ps.executeQuery();
            if (type.equals("Open")) {
            	while (resultSet.next()) {
                  	if (resultSet.getString("Availability").equals("Open")) {
                  		result.add(generateTimeSlot(resultSet));
                  	}
                  }
        	}
            else if (type.equals("NonClose")) {
            	while (resultSet.next()) {
                 	if (!resultSet.getString("Availability").equals("Close")) {
                 		result.add(generateTimeSlot(resultSet));
                 	}
                 }
            }
           
            return result;

        } catch (Exception e) {
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
   
    
    public boolean removeCalendar(String calName) throws Exception {
        try {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar WHERE CalendarName = ?;");
            ps.setString(1, calName);
            ResultSet resultSet = ps.executeQuery();
            
            // already exist?
            if (!resultSet.next()) {
//                CMSCalendar c = generateCalendar(resultSet);
//                resultSet.close();
                return false;
            }
            
            ps = conn.prepareStatement("DELETE FROM Calendar WHERE CalendarName = ?;");
            ps.setString(1, calName);
            ps.execute();
            return true;

        } catch (Exception e) {
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    
    public ArrayList<String> showAllCalendar() throws Exception {
    	try {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar;");
            ResultSet resultSet = ps.executeQuery();
            ArrayList<String> calendars = new ArrayList<String>();
            while (resultSet.next()) {
            	String calendarName  = resultSet.getString("CalendarName");
            	calendars.add(calendarName);
            }
            resultSet.close();
            ps.close();
            if (calendars.size() == 0) {
            	calendars = null;
            }
            System.out.println(calendars);
            return calendars;

        } catch (Exception e) {
        	e.printStackTrace();
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    public List<String> getAllDates(String calName) throws Exception {
    	try {
    		List<String> allDates = new ArrayList<String>(); 
    		String calID = "";
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar WHERE CalendarName=?;");
            ps.setString(1,  calName);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet.next()) {
                calID = resultSet.getString("CalendarID");
            }
            resultSet.close();
            ps.close();
            ps = conn.prepareStatement("SELECT * FROM AvailableDate WHERE CalendarID=?;");
            ps.setString(1,  calID);
            resultSet = ps.executeQuery();
            while (resultSet.next()) {
            	allDates.add(resultSet.getString("Date"));
            }
            resultSet.close();
            ps.close();
            return allDates;

        } catch (Exception e) {
        	e.printStackTrace();
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    public CMSCalendar loadCalendar(String calName) throws Exception {
    	try {
            CMSCalendar calendar = null;
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar WHERE CalendarName=?;");
//            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar;");
            ps.setString(1,  calName);
            ResultSet resultSet = ps.executeQuery();
            
            if (resultSet.next()) {
                calendar = generateCalendar(resultSet);
                
                System.out.println(calendar);
            }
            resultSet.close();
            ps.close();
            
//            if (calendar == null) {
//                throw new Exception("calendar doesn't exist");
//            }
//            System.out.println(calendar);
            return calendar;

        } catch (Exception e) {
        	e.printStackTrace();
            throw new Exception("Failed in getting calendar: " + e.getMessage());
        }
    }
    
    
    public String createCalendar(CMSCalendar calendar) throws Exception {
        try {
        	TimeHelper st = Util.toTimeHelper(calendar.startTime);
        	TimeHelper et = Util.toTimeHelper(calendar.endTime);
        	DateHelper sd =Util.toDateHelper(calendar.startDate);
        	DateHelper ed =Util.toDateHelper(calendar.endDate);
        	
        	if(st.after(et) || st.equals(et)) {
        		return "timeBug";
        	}
        	
        	if (sd.after(ed)) {
        		return "dateBug";
        	}
        	
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM Calendar WHERE CalendarName = ?;");
            ps.setString(1, calendar.calName);
            ResultSet resultSet = ps.executeQuery();
            
            // already exist?
            if (resultSet.next()) {
//                CMSCalendar c = generateCalendar(resultSet);
//                resultSet.close();
                return "existed";
            }
            
            // insert calendar to Calendar table
            ps = conn.prepareStatement("INSERT INTO Calendar (CalendarID, CalendarName, StartDate, "
            		+ "EndDate, StartTime, EndTime, Duration, Location, Organizer) values(?,?,?,?,?,?,?,?,?);");
            ps.setString(1,  calendar.calendarID);
            ps.setString(2,  calendar.calName);
            ps.setString(3,  calendar.startDate);
            ps.setString(4,  calendar.endDate);
            ps.setString(5,  calendar.startTime);
            ps.setString(6,  calendar.endTime);
            ps.setString(7,  calendar.duration);
            ps.setString(8,  calendar.location);
            ps.setString(9,  calendar.organizer);
            ps.execute();
            
            // initialization available dates and timeslots
            Util.Initialization(conn, calendar.calendarID, calendar.startDate, calendar.endDate,
            		calendar.startTime, calendar.endTime, calendar.duration);
            System.out.println("Succeed !!!!!");
            return "succeed";

        } catch (Exception e) {
            throw new Exception("Failed to insert calendar: " + calendar.toString() + " " + e.getMessage());
        }
    }
    
    private CMSCalendar generateCalendar(ResultSet resultSet) throws Exception {
        String calendarName  = resultSet.getString("CalendarName");
        String calendarID = resultSet.getString("CalendarID");
		String startDate = resultSet.getString("StartDate");
		String endDate = resultSet.getString("EndDate");
		String startTime = resultSet.getString("StartTime");
		String endTime = resultSet.getString("EndTime");
		String duration = resultSet.getString("Duration");
		String location = resultSet.getString("Location");
		String organizer = resultSet.getString("Organizer");
        return new CMSCalendar(calendarID, calendarName, startDate, endDate, startTime, endTime, duration, location, organizer);
    }
    
    private TimeSlot generateTimeSlot(ResultSet resultSet) throws Exception {
        String timeSlotID  = resultSet.getString("TimeSlotID");
        String availableDateID = resultSet.getString("AvailableDateID");
		String startTime = resultSet.getString("StartTime");
		String availability = resultSet.getString("Availability");
        return new TimeSlot(timeSlotID, availableDateID, startTime, availability);
    }
    
    private Meeting generateMeeting(ResultSet resultSet) throws Exception{
    	String meetingID = resultSet.getString("MeetingID");
    	String calendarID = resultSet.getString("CalendarID");
    	String timeSlotID = resultSet.getString("TimeSlotID");
    	String time = resultSet.getString("Time");
    	String meetingWith = resultSet.getString("MeetingWith");
    	String location = resultSet.getString("Location");
    	String meetDate = resultSet.getString("MeetDate");
    	return new Meeting(meetingID, calendarID, timeSlotID, time, meetingWith, location, meetDate);
    	
    }
    
    
}

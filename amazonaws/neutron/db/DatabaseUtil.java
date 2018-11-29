package com.amazonaws.neutron.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Calendar;
import java.util.UUID;

import com.amazonaws.neutron.model.CMSCalendar;

public class DatabaseUtil {
	// These are to be configured and NEVER stored in the code.
		// once you retrieve this code, you can update
		public final static String rdsMySqlDatabaseUrl = "mysql-jddqd.ccotgs3dvrxv.us-east-2.rds.amazonaws.com";
		public final static String dbUsername = "jddqd26";
		public final static String dbPassword = "cmsneutron";
			
		public final static String jdbcTag = "jdbc:mysql://";
		public final static String rdsMySqlDatabasePort = "3306";
		public final static String multiQueries = "?allowMultiQueries=true";
		   
		public final static String dbName = "mydb";    // default created from MySQL WorkBench

		// pooled across all usages.
		static Connection conn;
	 
		/**
		 * Singleton access to DB connection to share resources effectively across multiple accesses.
		 */
		protected static Connection connect() throws Exception {
			if (conn != null) { return conn; }
			try {
//				System.out.println("start connecting......");
//				try {
//			        Class.forName("com.mysql.cj.jdbc.Driver");
//			    } catch (ClassNotFoundException e) {
//			        System.out.println("Where is your MySQL JDBC Driver?");
//			        e.printStackTrace();
//			    }
				Class.forName("com.mysql.cj.jdbc.Driver");
				conn = DriverManager.getConnection(
						jdbcTag + rdsMySqlDatabaseUrl + ":" + rdsMySqlDatabasePort + "/" + dbName + multiQueries,
						dbUsername,
						dbPassword);
//				System.out.println("Database has been connected successfully.");
//				PreparedStatement ps = conn.prepareStatement("INSERT INTO Calendar (CalendarID, CalendarName, StartDate, "
//	            		+ "EndDate, StartTime, EndTime, Duration, Location, Organizer) values(?,?,?,?,?,?,?,?,?);");
//				String id = UUID.randomUUID().toString().substring(0, 20);
//				CMSCalendar calendar = new CMSCalendar(id, "testFromLocal2", "1", "1", "1", "1", "15", "WPI", "Wade");
//	            ps.setString(1,  calendar.calendarID);
//	            ps.setString(2,  calendar.calendarName);
//	            ps.setString(3,  calendar.startDate);
//	            ps.setString(4,  calendar.endDate);
//	            ps.setString(5,  calendar.startTime);
//	            ps.setString(6,  calendar.endTime);
//	            ps.setString(7,  calendar.duration);
//	            ps.setString(8,  calendar.location);
//	            ps.setString(9,  calendar.organizer);
//	            ps.execute();
			
				return conn;
			} catch (Exception ex) {
				throw new Exception("Failed in database connection");
			}
		}
		public static void main(String[] args) throws Exception {
			connect();
		}
}

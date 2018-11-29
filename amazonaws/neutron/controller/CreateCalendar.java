package com.amazonaws.neutron.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.neutron.db.*;
import com.amazonaws.neutron.model.CMSCalendar;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.google.gson.Gson;
import com.sun.istack.internal.logging.Logger;

import java.io.InputStream;
import java.io.OutputStream;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;

public class CreateCalendar implements RequestStreamHandler {
	String quot = "\"";
	boolean useRDS = false;
	String checkPoint = "Original ";
	
	
	/** Upload data to MySQL */
	public String uploadValueToDB(String calendarID, String calendarName, String startDate, String endDate, String startTime,
			String endTime, String duration, String location, String organizer, String jsonFile) throws Exception { 
		DatabaseDAO dao = new DatabaseDAO();
        CMSCalendar calendar = new CMSCalendar(calendarID, calendarName, startDate, endDate, startTime, endTime, duration, location, organizer);
        return dao.createCalendar(calendar);
	}
	
	
	@Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
		JSONParser parser = new JSONParser();
	    LambdaLogger logger = context.getLogger();
        logger.log("Loading Java Lambda handler of RequestStreamHandler ");

        JSONObject headerJson = new JSONObject();
        headerJson.put("Content-Type",  "application/json");  // not sure if needed anymore?

        // annoyance to ensure integration with S3 can support CORS
        headerJson.put("Access-Control-Allow-Origin",  "*");
        headerJson.put("Access-Control-Allow-Methods", "GET,POST");
        
         
        JSONObject responseJson = new JSONObject();
        responseJson.put("isBase64Encoded", false);
        responseJson.put("headers", headerJson);

        JSONObject responseBody = new JSONObject();
        
        try {        
	        String calName = "";
	        String startDate = "";
	        String endDate = "";
	        String startTime = "";
	        String endTime = "";
	        String duration = "";
	        String location = "";
	        String organizer = "";
	        
//	        logger.log("---------I am Here!!!!!!!!!!");
//	        CalendarTest calTest = new Gson().fromJson(new InputStreamReader(inputStream),
//	        		CalendarTest.class);
//	        logger.log("---------I am Here!!!!!!!!!!");
//	        logger.log(calTest.toString());
//	        logger.log("------------------------------");
	        
	        
	        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
	        JSONObject event = (JSONObject) parser.parse(reader);
	        logger.log("event:" + event.toJSONString());
	      
	        // when passed as POST, appears as 'body' in the request, so must be extracted.
	        String body = (String)event.get("body");
	        if (body != null) {
	        	event = (JSONObject) parser.parse(body);
	        }
	        
	        //responseBody.put("input", event.toJSONString());
	        logger.log("event:" + event.toString());
	        if (event != null) {
		        if ( event.get("calName") != null) {
	                calName = (String)event.get("calName");
	                logger.log("calName = " + calName);
	            }
		        if ( event.get("startDate") != null) {
	                startDate = (String)event.get("startDate");
	                logger.log("startDate = " + startDate);
	            }
		        if ( event.get("endDate") != null) {
	                endDate = (String)event.get("endDate");
	                logger.log("endDate = " + endDate);
	            }
		        if ( event.get("startTime") != null) {
	                startTime = (String)event.get("startTime");
	                logger.log("startTime = " + startTime);
	            }
		        if ( event.get("endTime") != null) {
	                endTime = (String)event.get("endTime");
	                logger.log("endTime = " + endTime);
	            }
		        if ( event.get("duration") != null) {
	                duration = (String)event.get("duration");
	                logger.log("duration = " + duration);
	            }
		        if ( event.get("location") != null) {
	                location = (String)event.get("location");
	                logger.log("location = " + location);
	            }  
		        if ( event.get("organizer") != null) {
	                organizer = (String)event.get("organizer");
	                logger.log("organizer = " + organizer);
	            }  
	        }
	        String newCalendar = event.toJSONString();
	        String result;
	        String calID = UUID.randomUUID().toString().substring(0, 20);
        	String check = uploadValueToDB(calID, calName, startDate, endDate, startTime, endTime, duration, location, organizer, newCalendar);
        	if (check.equals("succeed")) {
        		result = "1";// Created successfully
        	}
        	else if (check.equals("existed") ){
        		result = "0";//Already existed.
        	}
        	else if (check.equals("timeBug")){
        		result = "-1"; // Time problem.
        	}
        	else {
        		result = "-2"; // Date problem.
        	}
        	

        	responseBody.put("CalendarInfo", "Calendar Name: " + calName + "<br>Organizer: " + organizer + "<br>Start Date: " + startDate
        			+ "<br>End Date: " + endDate + "<br>Start Time: " + startTime + "(24-hour clock)<br>End Time: " + endTime 
        			+ "(24-hour clock)<br>Location: " + location + "<br>Duration: " + duration + " min");
			
			// must go in as a String.
			
	        responseBody.put("Result", result);
	        responseJson.put("statusCode", 200);
	        responseJson.put("body", responseBody.toString());  
				
	    } catch (Exception e) {
	    	logger.log(e.toString());

	        responseBody.put("create", "Unable to process input");
	        responseJson.put("statusCode", 422);
	        responseJson.put("body", responseBody.toString());  
	    }
        
        logger.log("end result:" + responseJson.toJSONString());
        logger.log(responseJson.toJSONString());
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());  
        writer.close();
	}

}

//class CalendarTest {
//
//    private String calName;
//    private String startDate;
//    private String endDate;
//    private String startTime;
//    private String endTime;
//    private String duration;
////    private String location;
//
//    @Override
//    public String toString() {
//        return calName + " & " + startDate + " & " + endDate + " & " + startTime + 
//        		" & " + endTime + " & " + duration + " & " ;
//    }
//}

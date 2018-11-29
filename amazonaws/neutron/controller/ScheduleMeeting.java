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
import com.amazonaws.neutron.db.DatabaseDAO;
import com.amazonaws.neutron.model.CMSCalendar;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.sun.istack.internal.logging.Logger;

import java.io.InputStream;
import java.io.OutputStream;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;


public class ScheduleMeeting implements RequestStreamHandler {

	/** Delete data from MySQL 
	 * @throws Exception */
	public String createMeetingToMySQL(String calID, String meetDate, String meetTime, String who, String location) throws Exception {        
		DatabaseDAO dao = new DatabaseDAO();
		return dao.scheduleMeeting(calID, meetDate, meetTime, who, location);
	}
	
	@Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
		JSONParser parser = new JSONParser();
	    LambdaLogger logger = context.getLogger();
        logger.log("Loading Java Lambda handler of RequestStreamHandler");

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
	        String calID = "";
	        String meetDate = "";
	        String meetTime = "";
	        String meetingWith = "";
	        String location = "";
	        
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
		        if ( event.get("calID") != null) {
	                calID = (String)event.get("calID");
	                logger.log("calID: " + calID);
	            }
		        if ( event.get("meetDate") != null) {
	                meetDate = (String)event.get("meetDate");
	            }
		        if ( event.get("meetTime") != null) {
	                meetTime = (String)event.get("meetTime");
	            }
		        if ( event.get("meetingWith") != null) {
	                meetingWith = (String)event.get("meetingWith");
	            }
		        if ( event.get("location") != null) {
	                location = (String)event.get("location");
	                logger.log("location: " + location);
	            }
	        }
	        String result;
	        
	        if (!createMeetingToMySQL(calID, meetDate, meetTime, meetingWith, location).equals("Succeed")) {
	        	result = "Failed to schedule meeting!";
	        }
	        else {
	        	result = "Succeed to schedule a meeting with " + meetingWith + " on " + meetDate + " " + meetTime + " at " + location;
	        }
			// must go in as a String.
			
	        responseBody.put("Result", result);
	        responseJson.put("statusCode", 200);
	        responseJson.put("body", responseBody.toString());  
				
	    } catch (Exception e) {
	    	logger.log(e.toString());

	        responseBody.put("Result", "Unable to process input");
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

package com.amazonaws.lambda.demo;

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
import com.sun.istack.internal.logging.Logger;

import java.io.InputStream;
import java.io.OutputStream;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;

public class CreateCalendar implements RequestStreamHandler {
	String quot = "\"";
	
	private AmazonS3 s3 = AmazonS3ClientBuilder.standard().build();
	private String foldName = "kmonopoli509/createdCalendars";
	
	/** Load up S3 Bucket with given key */
	public boolean checkExistence(String arg) {
		boolean result = true;
		try {
			S3Object cal = s3.getObject(foldName, arg);
			cal.getObjectContent();
			
		} catch (SdkClientException sce) {
			result = false;
			sce.printStackTrace();
		}
		return result;
	}
	/** Upload data to S3 bucket */
	public void uploadValueToBucket(String keyName, String jsonFile) {        
        String stringObjKeyName = keyName;
        try {
            // Upload a text string as a new object.
            s3.putObject(foldName, stringObjKeyName, jsonFile);
//            PutObjectRequest request = new PutObjectRequest(foldName, keyName, jsonFile);
//            request.setCannedAcl(CannedAccessControlList.PublicRead);
//            s3.putObject(request);
        }
        catch(AmazonServiceException e) {
            // The call was transmitted successfully, but Amazon S3 couldn't process 
            // it, so it returned an error response.
            e.printStackTrace();
        }
        catch(SdkClientException e) {
            // Amazon S3 couldn't be contacted for a response, or the client
            // couldn't parse the response from Amazon S3.
            e.printStackTrace();
        }

	}
	/** Delete data to S3 bucket */
	public void deleteValueFromBucket(String arg) {        
        String stringObjKeyName = arg;
        try {
            // Upload a text string as a new object.
            s3.deleteObject(foldName, stringObjKeyName);
        }
        catch(AmazonServiceException e) {
            // The call was transmitted successfully, but Amazon S3 couldn't process 
            // it, so it returned an error response.
            e.printStackTrace();
        }
        catch(SdkClientException e) {
            // Amazon S3 couldn't be contacted for a response, or the client
            // couldn't parse the response from Amazon S3.
            e.printStackTrace();
        }

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
	        String calName = "";
	        String startDate = "";
	        String endDate = "";
	        String startTime = "";
	        String endTime = "";
	        String duration = "";
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
		        if ( event.get("calName") != null) {
	                calName = (String)event.get("calName");
	                logger.log("calName = " + calName);
	            }
		        if ( event.get("startDate") != null) {
	                startDate = (String)event.get("startDate");
	                logger.log("startDate = " + startDate);
	            }
		        if ( event.get("endDate") != null) {
	                endDate = (String)event.get("startDate");
	                logger.log("endDate = " + endDate);
	            }
		        if ( event.get("startTime") != null) {
	                startTime = (String)event.get("startTime");
	                logger.log("startTime = " + startTime);
	            }
		        if ( event.get("endTime") != null) {
	                endTime = (String)event.get("startTime");
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
	        }
	        String newCalendar = event.toJSONString();
	        
	        String result;
	        if (checkExistence(calName)) {
	        	result = "Calendar: " + "'" + calName + "'" + " exits!";
	        }
	        else {
	        	result = "Create calendar: " + "'" + calName + "'" + " successfully!";
	        	uploadValueToBucket(calName, newCalendar);
	        	responseBody.put("CalendarInfo", "Information of the calendar: " + event.toString());
	        }
			
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

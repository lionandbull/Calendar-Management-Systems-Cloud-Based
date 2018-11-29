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
import com.amazonaws.neutron.util.DateHelper;
import com.amazonaws.neutron.util.Util;
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
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.sun.istack.internal.logging.Logger;
import com.sun.org.apache.bcel.internal.generic.GETFIELD;

import java.io.InputStream;
import java.io.OutputStream;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;


public class AddDate implements RequestStreamHandler {

	/** Delete data from MySQL 
	 * @throws Exception */
	public boolean addDateToMySQL(String calID, String date, String startTime, String endTime, String duration) throws Exception {        
		DatabaseDAO dao = new DatabaseDAO();
		return dao.addDate(calID, date, startTime, endTime, duration);
	}
	
	public static List<String> getDateBetween(String date, String startDate, String endDate){
		List<String> result = new ArrayList<String>();
		DateHelper now = Util.toDateHelper(date);
		DateHelper start = Util.toDateHelper(startDate);
		DateHelper end = Util.toDateHelper(endDate);
		if (now.after(end)) {
			while (now.after(end)) {
				end.addDate(1);
				if (end.equals(now)) break;
				result.add(end.toString());
			}		
		}
		else {
			while (start.after(now)) {
				now.addDate(1);
				if (start.equals(now)) break;
				result.add(now.toString());
			}
		}
		return result;
	}
	
//	public static void main(String[] args) {
//		System.out.println(getDateBetween("2018-11-28", "2018-11-14", "2018-11-20"));
//	}
	
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
	        String date = "";
	        String startDate = "";
	        String endDate = "";
	        String startTime = "";
	        String endTime = "";
	        String duration = "";
	        
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
	                logger.log("calName = " + calID);
	            }
		        if ( event.get("date") != null) {
	                date = (String)event.get("date");
	                logger.log("date = " + date);
	            }
		        startDate = (String)event.get("startDate");
		        endDate = (String)event.get("endDate");
		        if ( event.get("startTime") != null) {
	                startTime = (String)event.get("startTime");
	            }
		        if ( event.get("endTime") != null) {
	                endTime = (String)event.get("endTime");
	            }
		        if ( event.get("duration") != null) {
	                duration = (String)event.get("duration");
	            }
		
	        }
	        String result;
	        if (addDateToMySQL(calID, date, startTime, endTime, duration) == false) {
	        	result = "The date: " + date + " already exsited!";
	        }
	        else {
	        	result = "Succeed";
	        	List<String> dateArray = getDateBetween(date, startDate, endDate);
	        	String data = new Gson().toJson(dateArray);
	        	JsonArray jsonArray = new JsonParser().parse(data).getAsJsonArray();
	        	responseBody.put("ArrayList", jsonArray);
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

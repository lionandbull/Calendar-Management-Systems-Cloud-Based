package com.amazonaws.neutron.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.neutron.db.DatabaseDAO;
import com.amazonaws.neutron.model.CMSCalendar;
import com.amazonaws.neutron.model.TimeSlot;
import com.amazonaws.neutron.util.TimeHelper;
import com.amazonaws.neutron.util.Util;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

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


public class RetrieveTimeslots implements RequestStreamHandler {
	
	
	/** Load up MySQL with given key */
	public ArrayList<TimeSlot> retrieveTimeSlotsFromMySQL(String calID, String avaiDate, String type) throws Exception {   
		DatabaseDAO dao = new DatabaseDAO();
		return dao.retrieveTimeslots(calID, avaiDate, type);
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
        	String calID = "";
        	String avaiDate = "";
        	String type = "";
	        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
	        JSONObject event = (JSONObject) parser.parse(reader);
 	        logger.log("event:" + event.toJSONString() + "-------------");
 	        
	        if (event.get("queryStringParameters") != null) {
	        	
                JSONObject qps = (JSONObject)event.get("queryStringParameters");
                if ( qps.get("calID") != null) {
                	
                    calID = (String)qps.get("calID");
                }
                if ( qps.get("avaiDate") != null) {
                	
                	avaiDate = (String)qps.get("avaiDate");
                }
                if ( qps.get("type") != null) {
                	
                	type = (String)qps.get("type");
                }
            }
	        logger.log(calID);
	        logger.log(avaiDate);
	        
	        List<TimeSlot> result = retrieveTimeSlotsFromMySQL(calID, avaiDate, type);
	        
	        if (result == null) {
	        	responseBody.put("Result", "Close");
	        }
			// must go in as a String.
	        else {
	        	responseBody.put("Result", "1");
	        	result.sort(new TimeComparator());
	        	String data = new Gson().toJson(result);
	        	JsonArray jsonArray = new JsonParser().parse(data).getAsJsonArray();
	        	responseBody.put("ArrayList", jsonArray);
	        	
//	        	for (TimeSlot ele : result) {
//	        		responseBody.put(ele.startTime, ele.startTime);
//	        	}
	        	
	        }
	        responseJson.put("statusCode", 200);
	        responseJson.put("body", responseBody.toString());  
				
	    } catch (Exception e) {
	    	logger.log(e.toString());
	        responseBody.put("Result", "Retrieve-Timeslots-Exception!");
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




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
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.sun.istack.internal.logging.Logger;

import java.io.InputStream;
import java.io.OutputStream;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;


public class ShowCalendars implements RequestStreamHandler {
	String quot = "\"";
	
	private AmazonS3 s3 = AmazonS3ClientBuilder.standard().build();
	private String foldName = "kmonopoli509/createdCalendars";
	
	/** Delete data to S3 bucket */
	public List<String> loadBucketsFromBucket() {  
		List<String> result = new ArrayList<String>();
		ListObjectsRequest listObjectsRequest = 
                new ListObjectsRequest()
                      .withBucketName("kmonopoli509")
                      .withPrefix("createdCalendars" + "/");
		ObjectListing objects = s3.listObjects(listObjectsRequest);
        try {
        	for (;;) {
        	    List<S3ObjectSummary> summaries = objects.getObjectSummaries();
        	    if (summaries.size() < 1) {
        	      break;
        	    }
        	    summaries.forEach(s -> result.add("CalendarName: " + "'" + s.getKey().substring(17) + "'"));
        	    objects = s3.listNextBatchOfObjects(objects);
        	  }
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
        return result;
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
//	        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
//	        JSONObject event = (JSONObject) parser.parse(reader);
//	        logger.log("event:" + event.toJSONString());
//	      
//	        // when passed as POST, appears as 'body' in the request, so must be extracted.
//	        String body = (String)event.get("body");
//	        if (body != null) {
//	        	event = (JSONObject) parser.parse(body);
//	        }
//	        
//	        //responseBody.put("input", event.toJSONString());
//	        logger.log("event:" + event.toString());
	        
	        List<String> result = loadBucketsFromBucket();
	        result.remove(0);
			// must go in as a String.
			
			
	        responseBody.put("Result", result.toString());
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

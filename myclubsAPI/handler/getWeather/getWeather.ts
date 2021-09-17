import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context
} from "aws-lambda";

import WeatherAPI from "../../controllers/WeatherAPI";
import Activity from "../../controllers/Activity";
import { LogRetention } from "@aws-cdk/aws-lambda";
import ActivityAPI from "../../controllers/ActivityAPI";
/** 
 * - Product Owner Notes -
 * 
 * Here's some example data containing `ActivityDate`s you can use for your implementation:
 * Workout Data: https://s3.eu-west-1.amazonaws.com/dev-challenges.myclubs.com/frontend/frontend_challenge_activities.json
 * 
 * For the forecast to work, it is fine to mock/replace the `start` date of an `ActivityDate` with a random date in the future so we can get an actual forecast.
 */

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  
  //static data - for testing purposes
  const objectID : string = "hzLQRD4Sxb";
  const queryDate : Date = new Date(Date.now() + 2*( 3600 * 1000 * 24)); //current day + 2 days
  
  const currentDate : Date = new Date();
  let apiStatusCode: number = 200;
  let message : string = "No Error Message";
  
  let activity = undefined;

  try
  {
    const activityAPI = new ActivityAPI(objectID)
    activity = await activityAPI.getActivity();
    activity.date = queryDate;

    let weatherAPI = new WeatherAPI(activity.lat,activity.lon,queryDate.toString());

    if(currentDate <= queryDate)
    {
  
      console.log("\nSetting up Forecast Weather API result: \n");
      await weatherAPI.getForecastWeatherAPIService();
    } else{
      console.log("\nSetting up Historic Weather API result: \n");
      await weatherAPI.getHistoricWeatherAPIService();
    }

    activity.weatherForecast = weatherAPI.weatherDescription;
  } catch (ex)
  {
      apiStatusCode = 500;
      message = ex.message;
  }
  

  return {
    statusCode: apiStatusCode,
    body: JSON.stringify(
    {
      message: message,
      activity: activity.name,
      day: activity.date,
      lat: activity.lat,
      lon: activity.lon,
      weather: activity.weatherForecast,
      isActive: activity.isActive,
      isOutside: activity.isOutside,
    }),
    headers: { "Content-Type": "application/json" },
  };
  
  /*
  return {
    statusCode: 200,
    body: JSON.stringify(
    {
      
    }),
    headers: { "Content-Type": "application/json" },
    
  }; */
};

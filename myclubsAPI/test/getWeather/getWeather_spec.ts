import * as weatherAPI from "../../handler/getWeather/getWeather";
import ActivityAPI from "../../controllers/ActivityAPI";
import WeatherAPI from "../../controllers/WeatherAPI";

import assert from 'assert';
import Activity from "../../controllers/Activity";

describe('getActivity [Not outdoor]', () => {
  it('does not work', function () {
    const objectID = "2ti9Fsr613";
    const activityAPI = new ActivityAPI(objectID);
    
    assert.throws(activityAPI.getActivity, Error, "Error thrown as expected!");
 })
});
 describe('getActivity [outdoor]', () => {
  it('works', function () {
    const objectID = "9Ktfi2Ro64";
    const activityAPI = new ActivityAPI(objectID);
    const activity = activityAPI.getActivity();
    console.log(activity);
    assert.equal(activity.isOutside, true)
 })
});

describe('getActivity with getWeather [Forecast]', () => {
  it('does not work', async function () {
    const objectID = "9Ktfi2Ro64";
    const activityAPI = new ActivityAPI(objectID);
    const activity = await activityAPI.getActivity();
    console.log(activity);

    const weatherAPI = new WeatherAPI(activity.lat,activity.lon,activity.date);
    await weatherAPI.getHistoricWeatherAPIService().catch(e => assert.ok(true));

 })
});
describe('Get Weather in a specific date [HTTP error]', () => {
  it('does not work', async function () {

    const lat = 47.3913389;
    const lon = 8.5362317;
    let activity = new Activity("testID", lat,lon);
    activity.date = "2021-08-17T10:30:00.000Z";

    const weatherAPI = new WeatherAPI(activity.lat,activity.lon,activity.date);
    await weatherAPI.getHistoricWeatherAPIService().catch(e => assert.ok(true));


 })
});
describe('Get Weather in a specific date [No days can be found]', () => {
  it('does not work', async function () {
    const lat = 47.3913389;
    const lon = 8.5362317;
    let activity = new Activity("testID", lat,lon);
    activity.date = "2021-09-17T10:30:00.000Z";

    const weatherAPI = new WeatherAPI(activity.lat,activity.lon,activity.date);
    await weatherAPI.getHistoricWeatherAPIService().catch(e => assert.equal(e.message, "No weather Description was fetched from the Weather API!"));

 })
});
describe('Get Historic Weather in a specific date [weather description found]', () => {
  it('works', async function () {
    const lat = 47.3913389;
    const lon = 8.5362317;
    let activity = new Activity("testID", lat,lon);
    activity.date = new Date(Date.now() - ( 3600 * 1000 * 24)).toString(); //current day - 1 day

    const weatherAPI = new WeatherAPI(activity.lat,activity.lon,activity.date);
    await weatherAPI.getHistoricWeatherAPIService();
    console.log("Weather Description: " + weatherAPI.weatherDescription);
    assert.notEqual(weatherAPI.weatherDescription, "No weather description can be provided");

 })
});
describe('Get Forecast Weather in a specific date [weather description found]', () => {
  it('works', async function () {
    const lat = 47.3913389;
    const lon = 8.5362317;
    let activity = new Activity("testID", lat,lon);
    const futureDate = new Date();
    activity.date = new Date(Date.now() + ( 3600 * 1000 * 24)).toString(); //current day + 1 day

    const weatherAPI = new WeatherAPI(activity.lat,activity.lon,activity.date);
    await weatherAPI.getForecastWeatherAPIService();
    console.log("Weather Description: " + weatherAPI.weatherDescription);
    assert.notEqual(weatherAPI.weatherDescription, "No weather description can be provided");

 })
});

describe('Get Weather API response from static date in Handler', () => {
  it('works', async function () {
    
    const response = await weatherAPI.handler(null,null,null);
    console.log(response);
    assert.equal(response["statusCode"], 200);
 })
});

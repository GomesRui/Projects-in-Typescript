import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context
} from "aws-lambda";

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
  context: Context
) => {
  // TODO: Implementation :)
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: { "Content-Type": "application/json" },
  };
};
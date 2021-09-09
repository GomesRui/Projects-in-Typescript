import * as apigateway from "@aws-cdk/aws-apigateway";
import * as events from '@aws-cdk/aws-events';
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from '@aws-cdk/core';
import * as path from "path";

interface WeatherStackProps extends cdk.StackProps {
  systemSlug: string;
}

export interface MyClubsLambdaProps {
  /**
   * Name of the handler for the function.
   * Put a "handler" method in a file under handler/<handlerName>/<handlerName>.ts
   */
  handlerName: string;
  /**
   * Whether advanced monitoring via Lambda Insights should be enabled for this function.
   * Careful: This comes with significant additional costs!
   *
   * @default false - lambda insights won't be enabled
   */
  lambdaInsightsEnabled?: boolean;
  lambdaOpts?: lambda.FunctionOptions; // they aren't included directly in MyClubsLambdaProps so that when using the class you'll first see the custom fields
  /**
   * Set to true if you want to deny this lambda function to send events to EventBridge as a side-effect.
   *
   * @default false
   */
  denyPutEvents?: boolean;
}

export class MyClubsLambda extends lambda.Function {
  constructor(scope: cdk.Stack, id: string, props: MyClubsLambdaProps) {
    super(scope, id, {
      ...props.lambdaOpts,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: `${props.handlerName}.handler`,
      code: lambda.Code.fromAsset(path.join('dist', props.handlerName)),
    });
    const { denyPutEvents = false } = props;

    if (props.lambdaInsightsEnabled) {
      const lambdaInsightsLayer = lambda.LayerVersion.fromLayerVersionArn(
        this,
        'LayerFromArn',
        'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:14', // see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html for possible values/updates
      );
      this.addLayers(lambdaInsightsLayer);
    }
    // grant put event permissions by default
    if (denyPutEvents === false) events.EventBus.grantAllPutEvents(this);
  }
}


export class WeatherStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: WeatherStackProps) {
    super(scope, id, props);

    const getWeatherFn = new MyClubsLambda(this, 'getWeather', {
      handlerName: 'getWeather',
      lambdaOpts: {
        environment: {
          // environment variables
        },
      },
    });
    const getWeatherIntegration = new apigateway.LambdaIntegration(getWeatherFn, {});
    
    const api = new apigateway.RestApi(this, `weather-api`, { deployOptions: { tracingEnabled: true } });
    const baseResource = api.root.addResource('api').addResource('v1');
  }
}

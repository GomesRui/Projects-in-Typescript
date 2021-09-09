#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WeatherStack } from '../lib/weather-stack';

const app = new cdk.App();

const weatherStack = new WeatherStack(app, `WeatherStack`, {
  systemSlug: 'com.myclubs.weather',
});

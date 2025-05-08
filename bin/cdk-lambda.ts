#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaStack } from '../lib/cdk-lambda-stack';

const app = new cdk.App();

new CdkLambdaStack(app, `CdkLambdaStack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});

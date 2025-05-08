import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as CdkLambda from '../lib/cdk-lambda-stack';

test('Lambda Resources Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkLambda.CdkLambdaStack(app, 'MyTestStack', {
    env: { account: '123456789012', region: 'ap-northeast-1' }
  });
  // THEN
  const template = Template.fromStack(stack);

  // Lambda関数が正しく作成されるか検証
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'sample-lambda-function',
    Handler: 'index.handler',
    Runtime: 'nodejs22.x',
    MemorySize: 512,
    Timeout: 300, // 5分 = 300秒
    Description: 'Sample Lambda function created with CDK',
  });

  // IAMロールが正しく作成されるか検証
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.hasResourceProperties('AWS::IAM::Role', {
    RoleName: 'sample-lambda-role',
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        ],
      },
    ],
    Description: 'Role for sample Lambda function',
  });

  // 出力値が正しく設定されているか検証
  template.hasOutput('LambdaFunctionName', {});
  template.hasOutput('LambdaFunctionArn', {});
});

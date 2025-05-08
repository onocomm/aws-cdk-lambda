import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 設定パラメータ
    const functionName = 'sample-lambda-function';
    const roleName = 'sample-lambda-role';

    // Lambda関数用のIAMロールを作成
    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      roleName: roleName,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role for sample Lambda function',
    });

    // 基本的なLambda実行ポリシーを追加（CloudWatchログの書き込み権限）
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );

    // Lambda関数の作成
    const sampleFunction = new lambda.Function(this, 'SampleFunction', {
      functionName: functionName,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: lambdaRole,
      timeout: Duration.minutes(5),
      memorySize: 512,
      description: 'Sample Lambda function created with CDK',
    });

    // 出力値の設定
    new CfnOutput(this, 'LambdaFunctionName', {
      value: sampleFunction.functionName,
      description: 'Lambda Function Name',
    });

    new CfnOutput(this, 'LambdaFunctionArn', {
      value: sampleFunction.functionArn,
      description: 'Lambda Function ARN',
    });
  }
}

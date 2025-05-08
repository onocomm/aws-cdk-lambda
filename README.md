# AWS CDK Lambda サンプルプロジェクト

このリポジトリは、AWS CDKを使用してAWS Lambda関数をデプロイする方法を示すサンプルプロジェクトです。サーバーレス関数をインフラストラクチャー・アズ・コードで管理する例を含んでいます。

## 概要

このプロジェクトでは、以下のリソースと設定を AWS CDK を使って定義しています：

- Lambda関数の作成と設定
  - 関数名の指定
  - Node.js 22ランタイムの使用
  - メモリサイズとタイムアウトの設定
  - ハンドラ関数の指定
  - 関数コードの外部ファイルからの読み込み
- IAMロールの設定
  - カスタムロール名の指定
  - Lambda関数用の基本的な実行権限設定
- 出力値の設定
  - Lambda関数名とARNの出力

## 前提条件

このプロジェクトを使用するためには、以下が必要です：

- AWS アカウント
- Node.js (バージョン 16.x 以上)
- AWS CDK CLI (バージョン 2.x)
- AWS CLI（設定済み）

## インストール方法

```bash
# リポジトリをクローン
git clone <リポジトリURL>
cd aws-cdk-lambda

# 依存関係をインストール
npm install
```

## 使用方法

### 1. プロジェクトのコンパイル

```bash
npm run build
```

### 2. スタックの合成

```bash
npx cdk synth
```

### 3. デプロイ

```bash
npx cdk deploy
```

> **注意**: 実際にデプロイすると、Lambdaリソースが作成され、AWS アカウントに課金が発生する可能性があります。

## 実装例の解説

### 基本設定の変数化

```typescript
// 設定パラメータ
const functionName = 'sample-lambda-function';
const roleName = 'sample-lambda-role';
```

### IAMロールの作成

```typescript
const lambdaRole = new iam.Role(this, 'LambdaRole', {
  roleName: roleName,
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Role for sample Lambda function',
});

// 基本的なLambda実行ポリシーを追加（CloudWatchログの書き込み権限）
lambdaRole.addManagedPolicy(
  iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
);
```

### Lambda関数の作成

```typescript
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
```

### 出力値の設定

```typescript
new CfnOutput(this, 'LambdaFunctionName', {
  value: sampleFunction.functionName,
  description: 'Lambda Function Name',
});

new CfnOutput(this, 'LambdaFunctionArn', {
  value: sampleFunction.functionArn,
  description: 'Lambda Function ARN',
});
```

## Lambda関数コード

Lambda関数のコードは `lambda/index.mjs` ファイルに定義されています：

```javascript
export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from Lambda!',
      event: event
    }),
  };
};
```

## セキュリティのベストプラクティス

### 最小権限の原則

Lambda関数には、必要最小限の権限のみを付与することが重要です。このサンプルでは基本的な実行ロールのみを付与していますが、実際のアプリケーションでは必要な追加権限（S3、DynamoDB、SNSなど）を慎重に追加してください。

### 環境変数の使用

機密情報やデプロイ環境ごとに変更が必要な値は、ハードコーディングせずに環境変数として設定することをお勧めします。

```typescript
// 環境変数の設定例
const sampleFunction = new lambda.Function(this, 'SampleFunction', {
  // ... 他の設定 ...
  environment: {
    STAGE: 'dev',
    API_ENDPOINT: 'https://api.example.com',
  },
});
```

## カスタマイズ方法

実際の環境で使用する場合は、以下の点を変更してください：

1. 変数セクションの値を実際の環境に合わせて変更
   - functionName, roleName
2. Lambda関数の設定を要件に合わせて変更
   - メモリサイズ（512MBは一般的な開始点）
   - タイムアウト（5分は長め、多くの関数はより短い時間が適切）
   - ランタイム（Node.js以外を使用する場合）
3. IAMロールとポリシーを実際のアプリケーション要件に合わせて変更
4. Lambda関数のコードを実際のビジネスロジックに置き換え

## クリーンアップ

デプロイしたリソースを削除するには：

```bash
npx cdk destroy
```

## 参考リソース

- [AWS CDK ドキュメント](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS Lambda ドキュメント](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [AWS CDK API リファレンス - Lambda](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html)
- [Lambda関数のベストプラクティス](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

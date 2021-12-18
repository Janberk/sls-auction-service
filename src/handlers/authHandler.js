// import nJwt from 'njwt';
// import AWS from 'aws-sdk';
import AuthPolicy from 'aws-auth-policy';
// const signingKey = 'CiCnRmG+t+ BASE 64 ENCODED ENCRYPTED SIGNING KEY Mk=';

exports.handler = function (event, context) {
  console.log('Client token: ' + event.authorizationToken);
  console.log('Method ARN: ' + event.methodArn);

  // Method ARN: arn:aws:execute-api:eu-west-1:543059936291:cihjaa1lzd/dev/GET/auctions
  // const kms = new AWS.KMS();

  // const decryptionParams = {
  //   CiphertextBlob: new Buffer(signingKey, 'base64')
  // };

  // kms.decrypt(decryptionParams, function (err, data) {
  //   if (err) {
  //     console.log(err, err.stack);
  //     context.fail('Unable to load encryption key');
  //   } else {
  //     const key = data.Plaintext;

  //     try {
  //       const verifiedJwt = nJwt.verify(event.authorizationToken, key);
  //       console.log(verifiedJwt);

  const apiOptions = {};
  const tmp = event.methodArn.split(':');
  const apiGatewayArnTmp = tmp[5].split('/');
  const awsAccountId = tmp[4];

  apiOptions.region = tmp[3];
  apiOptions.restApiId = apiGatewayArnTmp[0];
  apiOptions.stage = apiGatewayArnTmp[1];

  const authPolicy = new AuthPolicy('cdn@dasburo.com', awsAccountId, apiOptions);
  authPolicy.allowMethod(AuthPolicy.HttpVerb.ALL, "/*");

  const generated = authPolicy.build();

  context.succeed(generated);

  //       // parse the ARN from the incoming event
  //       // const apiOptions = {};
  //       // const tmp = event.methodArn.split(':');
  //       // const apiGatewayArnTmp = tmp[5].split('/');
  //       // const awsAccountId = tmp[4];
  //       // apiOptions.region = tmp[3];
  //       // apiOptions.restApiId = apiGatewayArnTmp[0];
  //       // apiOptions.stage = apiGatewayArnTmp[1];

  //       // const policy = new AuthPolicy(verifiedJwt.body.sub, awsAccountId, apiOptions);

  //       // if (verifiedJwt.body.scope.indexOf('admins') > -1) {
  //       //   policy.allowAllMethods();
  //       // } else {
  //       //   policy.allowMethod('GET', '*');
  //       //   policy.allowMethod('POST', '/users/' + verifiedJwt.body.sub);
  //       // }

  //       // context.succeed(policy.build());

  //     } catch (ex) {
  //       console.log(ex, ex.stack);
  //       context.fail('Unauthorized');
  //     }
  //   }
  // });
};

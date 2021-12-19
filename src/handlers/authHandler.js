// import AuthPolicy from 'aws-auth-policy';

exports.handler = async (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Retrieve request parameters from the Lambda function input:
  // const headers = event.headers;
  // const queryStringParameters = event.queryStringParameters;
  // const pathParameters = event.pathParameters;
  // const stageVariables = event.stageVariables;

  // Parse the input for the parameter values
  const tmp = event.methodArn.split(':');
  const apiGatewayArnTmp = tmp[5].split('/');
  // const awsAccountId = tmp[4];
  // const region = tmp[3];
  // const restApiId = apiGatewayArnTmp[0];
  // const stage = apiGatewayArnTmp[1];
  // const method = apiGatewayArnTmp[2];
  let resource = '/'; // root resource
  if (apiGatewayArnTmp[3]) {
    resource += apiGatewayArnTmp[3];
  }

  console.log(resource);

  // Perform authorization to return the Allow policy for correct parameters and
  // the 'Unauthorized' error, otherwise.
  // const authResponse = {};
  const condition = {};
  condition.IpAddress = {};

  if (
    event.authorizationToken ===
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNhbmJlcmsgRGVtaXJrYW4iLCJlbWFpbCI6ImNkbkBkYXNidXJvLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.LA5BssHmSUWj5j-Jzv62cOzfmU7DoMo76a4gY7SQx40'
    // && queryStringParameters.QueryString1 === 'queryValue1'
    // && stageVariables.StageVar1 === 'stageValue1'
  ) {
    callback(null, generateAllow('cdn@dasburo.com', event.methodArn));
  } else {
    callback('Unauthorized');
  }

  // const authorizationToken = event.authorizationToken;
  // const methodArn = event.methodArn;

  // console.log('authorizationToken', authorizationToken);
  // console.log('methodArn', methodArn);

  // const apiOptions = {};

  // const tmp = methodArn.split(':');
  // const apiGatewayArnTmp = tmp[5].split('/');
  // const awsAccountId = tmp[4];

  // apiOptions.region = tmp[3];
  // apiOptions.restApiId = apiGatewayArnTmp[0];
  // apiOptions.stage = apiGatewayArnTmp[1];

  // const reqMethod = apiGatewayArnTmp[2];
  // const endpoint = apiGatewayArnTmp[3];

  // console.log('reqMethod', reqMethod);
  // console.log('endpoint', endpoint);

  // const authPolicy = new AuthPolicy('cdn@dasburo.com', awsAccountId, apiOptions);
  // authPolicy.allowMethod(AuthPolicy.HttpVerb[reqMethod], `/${endpoint}`);

  // console.log('authPolicy', authPolicy);

  // context.user = { user: 'test' };
  // context.succeed(authPolicy.build());

  // const policyDocument = {
  //   principalId: 'test',
  //   policyDocument: {
  //     Version: '2012-10-17',
  //     Statement: [
  //       {
  //         'Action': 'execute-api:Invoke',
  //         'Effect': 'Allow',
  //         'Resource': 'arn:aws:execute-api:eu-central-1:543059936291:zuyxl6uhk6/dev/GET/auctions'
  //       }
  //     ]
  //   }
  // };

  // return policyDocument;
};

// Help function to generate an IAM policy
const generatePolicy = (principalId, effect, resource) => {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    user: principalId,
  };

  return authResponse;
};

const generateAllow = (principalId, resource) => {
  return generatePolicy(principalId, 'Allow', resource);
};

// const generateDeny = (principalId, resource) => {
//   return generatePolicy(principalId, 'Deny', resource);
// };

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

  console.log('Resource', resource);

  const condition = {};
  condition.IpAddress = {};

  if (
    event.authorizationToken ===
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNhbmJlcmsgRGVtaXJrYW4iLCJlbWFpbCI6ImNkbkBkYXNidXJvLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.LA5BssHmSUWj5j-Jzv62cOzfmU7DoMo76a4gY7SQx40'
  ) {
    // callback(null, generateAllow('cdn@dasburo.com', event.methodArn));
    callback(
      null,
      generateAllow(
        'cdn@dasburo.com',
        'arn:aws:execute-api:eu-central-1:543059936291:zuyxl6uhk6/dev/GET/*',
      ),
    );
  } else {
    callback('Unauthorized');
  }
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
  authResponse.context = {
    email: principalId,
  };

  console.log('#######################################################');
  return authResponse;
};

const generateAllow = (principalId, resource) => {
  return generatePolicy(principalId, 'Allow', resource);
};

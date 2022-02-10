import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function batchWriteAuctions(event) {
  const batch = [];

  for (let i = 0; i < 25; i++) {
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1000);

    const auction = {
      id: uuid(),
      title: `Auction (A-${i})`,
      status: 'OPEN',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
      seller: 'test@sls.com',
    };

    batch.push({
      PutRequest: {
        Item: auction,
      },
    });
  }

  const params = {
    RequestItems: {
      [process.env.AUCTIONS_TABLE_NAME]: batch,
    },
  };

  try {
    await dynamodb.batchWrite(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(batch),
  };
}

export const handler = commonMiddleware(batchWriteAuctions);

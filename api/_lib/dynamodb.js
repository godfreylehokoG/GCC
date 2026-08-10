import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const leadsTableName = process.env.AWS_DYNAMODB_LEADS_TABLE;
const registrationsTableName = process.env.AWS_DYNAMODB_REGISTRATIONS_TABLE;
const eventsTableName = process.env.AWS_DYNAMODB_EVENTS_TABLE;

const dynamoClient = region ? new DynamoDBClient({ region }) : null;
const documentClient = dynamoClient
    ? DynamoDBDocumentClient.from(dynamoClient, {
        marshallOptions: {
            removeUndefinedValues: true
        }
    })
    : null;

function assertConfigured(tableName) {
    if (!region) {
        throw Object.assign(new Error('AWS_REGION is not configured.'), { statusCode: 500 });
    }

    if (!tableName) {
        throw Object.assign(new Error('DynamoDB table name is not configured.'), { statusCode: 500 });
    }

    if (!documentClient) {
        throw Object.assign(new Error('DynamoDB client is not initialized.'), { statusCode: 500 });
    }
}

async function scanTable(tableName) {
    assertConfigured(tableName);

    const items = [];
    let lastEvaluatedKey;

    do {
        const result = await documentClient.send(new ScanCommand({
            TableName: tableName,
            ExclusiveStartKey: lastEvaluatedKey
        }));

        items.push(...(result.Items || []));
        lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function saveLead(leadData) {
    assertConfigured(leadsTableName);

    const item = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...leadData
    };

    await documentClient.send(new PutCommand({
        TableName: leadsTableName,
        Item: item
    }));

    return item;
}

export async function saveEventRegistration(registrationData) {
    assertConfigured(registrationsTableName);

    const item = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...registrationData
    };

    await documentClient.send(new PutCommand({
        TableName: registrationsTableName,
        Item: item
    }));

    return item;
}

export function listLeads() {
    return scanTable(leadsTableName);
}

export function listEventRegistrations() {
    return scanTable(registrationsTableName);
}

export async function saveCmsEvent(eventData) {
    assertConfigured(eventsTableName);

    const item = {
        ...eventData,
        id: String(eventData.id),
        updated_at: new Date().toISOString()
    };

    await documentClient.send(new PutCommand({
        TableName: eventsTableName,
        Item: item
    }));

    return item;
}

export async function deleteCmsEvent(id) {
    assertConfigured(eventsTableName);

    await documentClient.send(new DeleteCommand({
        TableName: eventsTableName,
        Key: { id: String(id) }
    }));
}

export async function listCmsEvents() {
    const items = await scanTable(eventsTableName);
    return items.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
}

export function sendApiError(res, error, fallbackMessage = 'Internal server error') {
    const statusCode = normalizeStatusCode(error.statusCode || error.$metadata?.httpStatusCode);
    const errorName = error.name || error.Code || error.code;
    const mappedError = mapPublicError(errorName, error.message, fallbackMessage);

    return res.status(statusCode).json(mappedError);
}

function normalizeStatusCode(statusCode) {
    return Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599
        ? statusCode
        : 500;
}

function mapPublicError(errorName, message, fallbackMessage) {
    if (message?.includes('AWS_REGION')) {
        return {
            error: 'AWS_REGION is not configured in the hosting environment.',
            code: 'AWS_REGION_MISSING'
        };
    }

    if (message?.includes('DynamoDB table name')) {
        return {
            error: 'A DynamoDB table environment variable is missing.',
            code: 'DYNAMODB_TABLE_ENV_MISSING'
        };
    }

    switch (errorName) {
        case 'CredentialsProviderError':
            return {
                error: 'AWS credentials are not configured in the hosting environment.',
                code: 'AWS_CREDENTIALS_MISSING'
            };
        case 'UnrecognizedClientException':
        case 'InvalidSignatureException':
        case 'SignatureDoesNotMatch':
            return {
                error: 'AWS credentials are invalid or do not match this AWS account/region.',
                code: 'AWS_CREDENTIALS_INVALID'
            };
        case 'AccessDeniedException':
            return {
                error: 'AWS credentials do not have permission to access the DynamoDB tables.',
                code: 'AWS_ACCESS_DENIED'
            };
        case 'ResourceNotFoundException':
            return {
                error: 'DynamoDB table not found. Check AWS_REGION and table names.',
                code: 'DYNAMODB_TABLE_NOT_FOUND'
            };
        default:
            return {
                error: fallbackMessage,
                code: errorName || 'INTERNAL_ERROR'
            };
    }
}

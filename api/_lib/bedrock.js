import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const region = process.env.AWS_BEDROCK_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const modelId = process.env.AWS_BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0';
const bedrockEnabled = process.env.AWS_BEDROCK_ENABLED === 'true';

const client = bedrockEnabled && region
    ? new BedrockRuntimeClient({ region })
    : null;

export function isBedrockEnabled() {
    return Boolean(client);
}

export async function generateNovaResponse({
    message,
    history = [],
    retrievedContext = [],
    fallbackResponse
}) {
    if (!client) {
        return { response: fallbackResponse, provider: 'mvp-fallback' };
    }

    const contextText = retrievedContext.length > 0
        ? retrievedContext.map(item => `${item.title}: ${item.text}`).join('\n\n')
        : 'No matching site context was retrieved.';

    const conversation = history
        .slice(-6)
        .map(item => ({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: [{ text: item.content }]
        }));

    const command = new ConverseCommand({
        modelId,
        system: [{
            text: [
                'You are The Wealth Mindset website assistant.',
                'Answer using the provided site context when relevant.',
                'Be concise, warm, and practical.',
                'Never provide financial advice, investment recommendations, or price predictions.',
                'If asked about course start dates, say the courses will go live soon and invite the user to register for updates.',
                'For more communication, direct people to admin@thewealth-mindset.com.',
                'If the answer is not in the site context, say what you can help with and offer the admin email.'
            ].join(' ')
        }],
        messages: [
            ...conversation,
            {
                role: 'user',
                content: [{
                    text: [
                        `Site context:\n${contextText}`,
                        `User question:\n${message}`
                    ].join('\n\n')
                }]
            }
        ],
        inferenceConfig: {
            maxTokens: 450,
            temperature: 0.4,
            topP: 0.9
        }
    });

    const result = await client.send(command);
    const response = result.output?.message?.content
        ?.map(item => item.text)
        .filter(Boolean)
        .join('\n')
        .trim();

    return {
        response: response || fallbackResponse,
        provider: 'aws-bedrock-nova',
        modelId
    };
}

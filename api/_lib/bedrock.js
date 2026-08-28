import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const region = process.env.AWS_BEDROCK_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const modelId = process.env.AWS_BEDROCK_MODEL_ID || 'eu.amazon.nova-lite-v1:0';
const bedrockEnabled = process.env.AWS_BEDROCK_ENABLED === 'true';

const client = bedrockEnabled && region
    ? new BedrockRuntimeClient({ region })
    : null;

export function isBedrockEnabled() {
    return Boolean(client);
}

export function getBedrockStatus() {
    return {
        enabled: bedrockEnabled,
        clientReady: Boolean(client),
        region: region || null,
        modelId
    };
}

export async function generateNovaResponse({
    message,
    history = [],
    retrievedContext = [],
    intent = 'general_question',
    fallbackResponse
}) {
    if (!client) {
        return { response: fallbackResponse, provider: 'mvp-fallback' };
    }

    const contextText = retrievedContext.length > 0
        ? retrievedContext.map(item => `${item.title}: ${item.text}`).join('\n\n')
        : 'No matching site context was retrieved.';

    const conversation = normalizeConversationHistory(history, message);

    const command = new ConverseCommand({
        modelId,
        system: [{
            text: [
                'You are The Wealth Mindset website assistant.',
                `The detected user intent is ${intent}.`,
                'Answer using only the provided site context when it contains relevant facts.',
                'Be concise, warm, and practical.',
                'Format multi-item answers with short lines and simple bullets so they are easy to scan in a chat window. Avoid heavy Markdown formatting.',
                'Never provide financial advice, investment recommendations, buy/sell instructions, guaranteed-return claims, legal advice, tax advice, or price predictions.',
                'Never ask for or process passwords, PINs, OTPs, CVV/CVC codes, full card numbers, banking logins, ID numbers, or passport numbers.',
                'Do not invent event dates, venues, prices, partnerships, course start dates, or claims that are not in the supplied context.',
                'For event_question intent: list only event information from the event context, including names, dates, cities, venues, and registration/payment status when present. Do not mention course go-live dates for event questions.',
                'For course_question intent: explain the academy/course material and say courses will go live soon. Invite the user to register for updates.',
                'For investment_guardrail intent: refuse financial advice and redirect to education.',
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

function normalizeConversationHistory(history, currentMessage) {
    const normalized = history
        .slice(-8)
        .map(item => ({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: String(item.content || '').trim()
        }))
        .filter(item => item.content);

    if (
        normalized.length > 0
        && normalized[normalized.length - 1].role === 'user'
        && normalized[normalized.length - 1].content === currentMessage
    ) {
        normalized.pop();
    }

    while (normalized.length > 0 && normalized[0].role !== 'user') {
        normalized.shift();
    }

    const compacted = [];

    for (const item of normalized) {
        const previous = compacted[compacted.length - 1];

        if (previous?.role === item.role) {
            previous.content = `${previous.content}\n\n${item.content}`;
        } else {
            compacted.push({ ...item });
        }
    }

    return compacted.slice(-6).map(item => ({
        role: item.role,
        content: [{ text: item.content }]
    }));
}

const ADMIN_EMAIL = 'admin@thewealth-mindset.com';

const PRE_MODEL_RULES = [
    {
        type: 'sensitive_personal_data',
        terms: ['password', 'pin', 'otp', 'one-time password', 'card number', 'credit card', 'cvv', 'cvc', 'id number', 'passport number'],
        response: `For your safety, please do not share passwords, PINs, OTPs, card details, ID numbers, or other sensitive personal information in this chat. For more communication, contact ${ADMIN_EMAIL}.`
    },
    {
        type: 'payment_sensitive_info',
        terms: ['bank login', 'online banking password', 'send my card', 'card details', 'proof of payment in chat'],
        response: `I can't collect banking logins, card details, or sensitive payment information in this chat. For payment support or proof-of-payment coordination, contact ${ADMIN_EMAIL}.`
    },
    {
        type: 'investment_advice',
        terms: ['should i invest', 'what should i invest', 'should i buy', 'should i sell', 'buy now', 'sell now', 'price prediction', 'guaranteed return', 'guaranteed profit', 'make me money', 'roi'],
        response: `I can't provide financial advice, investment instructions, price predictions, or guaranteed-return claims. The Wealth Mindset provides financial education only. For more communication, contact ${ADMIN_EMAIL}.`
    },
    {
        type: 'legal_tax_advice',
        terms: ['tax advice', 'legal advice', 'avoid tax', 'evade tax', 'hide money', 'is this legal', 'lawsuit', 'contract advice'],
        response: `I can't provide legal or tax advice. Please speak with a qualified legal, tax, or compliance professional for guidance. For more communication with The Wealth Mindset team, contact ${ADMIN_EMAIL}.`
    }
];

const RISKY_OUTPUT_PATTERNS = [
    /\byou should buy\b/i,
    /\byou should sell\b/i,
    /\bbuy now\b/i,
    /\bsell now\b/i,
    /\bguaranteed (return|profit|income|money)\b/i,
    /\bwill definitely (profit|increase|go up|make money)\b/i,
    /\bprovide (your )?(password|pin|otp|cvv|cvc|card number|credit card)\b/i,
    /\bsend (your )?(password|pin|otp|cvv|cvc|card details)\b/i,
    /\bhide money\b/i,
    /\bevade tax\b/i
];

export function checkInputGuardrails(message) {
    const normalized = normalize(message);
    const matchedRule = PRE_MODEL_RULES.find(rule => (
        rule.terms.some(term => normalized.includes(term))
    ));

    if (!matchedRule) {
        return { blocked: false, type: null, response: null };
    }

    return {
        blocked: true,
        type: matchedRule.type,
        response: matchedRule.response
    };
}

export function applyOutputGuardrails(response) {
    const text = String(response || '').trim();
    const matchedPattern = RISKY_OUTPUT_PATTERNS.find(pattern => pattern.test(text));

    if (!matchedPattern) {
        return {
            blocked: false,
            type: null,
            response: text
        };
    }

    return {
        blocked: true,
        type: 'unsafe_model_output',
        response: `I can't provide financial advice, guaranteed-return claims, legal/tax advice, or collect sensitive personal/payment information. The Wealth Mindset assistant is for education, events, courses, and general support. For more communication, contact ${ADMIN_EMAIL}.`
    };
}

function normalize(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

// Vercel Serverless Function - AI Chat
// This endpoint handles AI chat interactions for The Wealth Mindset assistant.
import { isCourseQuestion, retrieveSiteContext } from './_lib/site-context.js';
import { saveChatExchange } from './_lib/dynamodb.js';

// Wealth Mindset knowledge base (embedded for MVP - Phase 2 will use RAG)
const WEALTH_MINDSET_KNOWLEDGE = `
The Wealth Mindset is an educational platform focused on financial literacy, disciplined habits, leadership, and legacy-building.

KEY FACTS:
- Education comes before action
- Focus on practical financial literacy and responsible decision-making
- Offers South African events, community outreach, trainings, and educational resources
- Not financial advice - educational platform only

WHAT THE WEALTH MINDSET OFFERS:
- Financial literacy education
- Wealth psychology and disciplined habits
- Community seminars and events
- Legacy-building and leadership development

DISCLAIMER:
The Wealth Mindset does not provide financial advice. All information is for educational purposes only.
`;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history = [], sessionId = null } = req.body;
        const cleanMessage = String(message || '').trim();

        if (!cleanMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (cleanMessage.length > 1000) {
            return res.status(400).json({ error: 'Please keep your message under 1000 characters.' });
        }

        const conversationHistory = Array.isArray(history)
            ? history.slice(-8).filter(item => (
                ['user', 'assistant'].includes(item.role)
                && typeof item.content === 'string'
                && item.content.trim().length > 0
            ))
            : [];

        const retrievedContext = await retrieveSiteContext(cleanMessage);
        const courseQuestion = isCourseQuestion(cleanMessage);
        let suggestedAction = null;

        let response = generateMVPResponse(cleanMessage.toLowerCase(), {
            conversationHistory,
            retrievedContext,
            courseQuestion
        });

        if (courseQuestion) {
            suggestedAction = {
                type: 'open_course_lead_form',
                label: 'Register for course updates'
            };
        }

        // TODO: Phase 2 - OpenAI Integration
        // const completion = await openai.chat.completions.create({
        //   model: 'gpt-4',
        //   messages: [
        //     { role: 'system', content: `You are The Wealth Mindset assistant. Use this knowledge: ${WEALTH_MINDSET_KNOWLEDGE}. Never give financial advice.` },
        //     ...conversationHistory,
        //     { role: 'user', content: message }
        //   ]
        // });
        // response = completion.choices[0].message.content;

        const payload = {
            success: true,
            response,
            suggestedAction,
            sources: retrievedContext.map(item => ({
                type: item.type,
                title: item.title
            })),
            disclaimer: 'This is not financial advice. For educational purposes only.'
        };

        saveChatExchange({
            session_id: typeof sessionId === 'string' ? sessionId.slice(0, 120) : null,
            user_message: cleanMessage,
            assistant_response: response,
            sources: payload.sources,
            suggested_action: suggestedAction?.type || null,
            expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 180),
            source: 'website_chatbot'
        }).catch(error => {
            console.error('Chat history save failed:', error);
        });

        return res.status(200).json(payload);

    } catch (error) {
        console.error('AI Chat error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function generateMVPResponse(message, context = {}) {
    const { retrievedContext = [], courseQuestion = false } = context;

    if (courseQuestion) {
        return generateCourseResponse(retrievedContext);
    }

    if (message.includes('event') || message.includes('seminar') || message.includes('tour')) {
        return "We host Wealth Mindset seminars and events focused on financial literacy, disciplined habits, leadership, and legacy-building. You can register for available events in the Events section.";
    }

    if (message.includes('mindset') || message.includes('wealth')) {
        return "The Wealth Mindset focuses on practical financial literacy, disciplined habits, leadership, and legacy-building. Our goal is to help people think clearly before making financial decisions.";
    }

    if (message.includes('invest') || message.includes('buy') || message.includes('price')) {
        return "I can't provide investment advice. The Wealth Mindset is focused on education, financial literacy, and responsible decision-making. I recommend attending a seminar or training to learn the principles before taking action.";
    }

    if (message.includes('learn') || message.includes('academy') || message.includes('video')) {
        return "Our academy and tutorials cover financial literacy, wealth habits, leadership, and legacy-building. Check out the Tutorials section to start learning at your own pace.";
    }

    if (message.includes('register') || message.includes('sign up') || message.includes('join')) {
        return "Great! You can register your interest using the form on our website, or register for a specific event in the Events section. We'll send you updates about the tour and exclusive content.";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Welcome to The Wealth Mindset. I'm here to help you learn about our trainings, events, and educational resources. What would you like to know?";
    }

    return "That's a great question! I'm The Wealth Mindset assistant and I can help you learn about our educational resources, upcoming seminars, trainings, and legacy-building approach. What specific aspect would you like to explore?";
}

function generateCourseResponse(retrievedContext) {
    const courseItems = retrievedContext
        .filter(item => ['course_week', 'lesson', 'training_schedule', 'training_session', 'training_upcoming', 'service'].includes(item.type))
        .slice(0, 4);

    if (courseItems.length === 0) {
        return "The Wealth Mindset Academy courses will go live soon. You can register your interest now and our team will notify you when enrollment opens. The academy focuses on financial literacy, disciplined habits, wealth psychology, asset awareness, and legacy-building.";
    }

    const contextSummary = courseItems
        .map(item => `- ${item.title}: ${item.text}`)
        .join('\n');

    return `The Wealth Mindset Academy courses will go live soon, and you can register your interest now so the team can notify you when enrollment opens.\n\nBased on the current course material, the academy includes:\n${contextSummary}\n\nThe program is educational only and does not provide financial advice. Would you like to register for course updates?`;
}

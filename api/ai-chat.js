// Vercel Serverless Function - AI Chat
// This endpoint handles AI chat interactions for the GGC assistant

// GGC Knowledge Base (embedded for MVP - Phase 2 will use RAG)
const GGC_KNOWLEDGE = `
Global Gold Coin (GGC) is a gold-backed digital asset focused on wealth preservation.

KEY FACTS:
- GGC is backed by physical gold reserves
- Focus on economic empowerment through education
- Currently touring South Africa with seminars in Johannesburg, Cape Town, and Durban
- Not investment advice - educational platform only

SOUTH AFRICAN TOUR 2026:
- Johannesburg: October 15, 2026 at Sandton Convention Centre
- Cape Town: October 22, 2026 at CTICC
- Durban: October 29, 2026 at Durban ICC

WHAT GGC OFFERS:
- Gold-backed digital currency
- Educational resources and academy
- Community seminars and events
- Wealth preservation strategies

DISCLAIMER:
GGC does not provide financial advice. All information is for educational purposes only.
`;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // For MVP: Simple keyword-based responses
        // Phase 2 will integrate OpenAI with RAG
        let response = generateMVPResponse(message.toLowerCase());

        // TODO: Phase 2 - OpenAI Integration
        // const completion = await openai.chat.completions.create({
        //   model: 'gpt-4',
        //   messages: [
        //     { role: 'system', content: `You are the GGC assistant. Use this knowledge: ${GGC_KNOWLEDGE}. Never give financial advice.` },
        //     ...conversationHistory,
        //     { role: 'user', content: message }
        //   ]
        // });
        // response = completion.choices[0].message.content;

        return res.status(200).json({
            success: true,
            response,
            disclaimer: 'This is not financial advice. For educational purposes only.'
        });

    } catch (error) {
        console.error('AI Chat error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function generateMVPResponse(message) {
    // Simple keyword matching for MVP
    if (message.includes('event') || message.includes('seminar') || message.includes('tour')) {
        return "We have three exciting seminars planned for South Africa in October 2026! Johannesburg on Oct 15, Cape Town on Oct 22, and Durban on Oct 29. Would you like to register for any of these events?";
    }

    if (message.includes('gold') || message.includes('backed')) {
        return "GGC is backed by physical gold reserves, providing stability and tangible value. Our approach emphasizes gold coins as a tool for wealth preservation and protection against inflation.";
    }

    if (message.includes('invest') || message.includes('buy') || message.includes('price')) {
        return "I can't provide investment advice. GGC is focused on education and wealth preservation. I recommend attending one of our seminars to learn more about our approach to financial empowerment.";
    }

    if (message.includes('learn') || message.includes('academy') || message.includes('video')) {
        return "Our GGC Academy offers educational videos ranging from beginner to advanced topics. You can learn about crypto basics, GGC specifics, and security practices. Check out the Tutorials section on our website!";
    }

    if (message.includes('register') || message.includes('sign up') || message.includes('join')) {
        return "Great! You can register your interest using the form on our website, or register for a specific event in the Events section. We'll send you updates about the tour and exclusive content.";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! Welcome to GGC. I'm here to help you learn about Global Gold Coin and our South African tour. What would you like to know?";
    }

    // Default response
    return "That's a great question! I'm the GGC assistant and I can help you learn about our gold-backed digital currency, upcoming seminars, or educational resources. What specific aspect would you like to explore?";
}

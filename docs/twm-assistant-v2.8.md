# TWM Assistant v2.8

## Summary

TWM Assistant v2.8 is the current AWS Bedrock-powered chatbot for The Wealth Mindset website. It uses a lightweight RAG-style context layer, AWS Nova through Bedrock for generated answers, DynamoDB for chat history and course leads, and explicit guardrails for financial, legal, tax, and sensitive-data safety.

The public assistant name is `TWM Assistant`.

The UI version labels are:

- `v2.8`: AWS Bedrock Nova response
- `v2.7`: local fallback response

## Current Capabilities

- Answers website questions through `/api/ai-chat`.
- Uses AWS Bedrock Nova when enabled.
- Falls back to deterministic local responses if Bedrock is disabled or fails.
- Retrieves relevant context from structured site data in `src/data.json`.
- Separates major intents before retrieval:
  - `event_question`
  - `course_question`
  - `contact_question`
  - `investment_guardrail`
  - `general_question`
- Keeps event questions focused on event data.
- Keeps course questions focused on academy, training, curriculum, and lessons.
- Tells users that courses will go live soon and opens a course-updates form.
- Saves course interest leads to a separate DynamoDB table.
- Saves chatbot exchanges to a separate DynamoDB table.
- Directs users to `admin@thewealth-mindset.com` for more communication.

## Main Files

- `src/GGC.jsx`
  - Chat UI
  - Message sending
  - Provider/version label display
  - Course-updates form inside the chat panel
  - Simple Markdown rendering for bold text and line breaks

- `api/ai-chat.js`
  - Main chatbot API route
  - Validates message input
  - Classifies intent
  - Retrieves site context
  - Applies input guardrails
  - Calls AWS Bedrock Nova
  - Applies output guardrails
  - Saves chat history

- `api/_lib/bedrock.js`
  - AWS Bedrock Runtime client
  - Nova `ConverseCommand` call
  - System prompt and model instructions
  - Conversation history normalization
  - Bedrock debug status

- `api/_lib/site-context.js`
  - Lightweight RAG context builder
  - Intent classification
  - Context filtering by intent
  - Event formatting
  - Upcoming event filtering based on server date

- `api/_lib/guardrails.js`
  - Input guardrails
  - Output guardrails
  - Safety fallback responses

- `api/course-lead.js`
  - Course-interest lead capture API route

- `api/_lib/dynamodb.js`
  - DynamoDB helpers for leads, registrations, events, course leads, and chat history

## Environment Variables

Required AWS/DynamoDB variables:

```txt
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DYNAMODB_LEADS_TABLE=wealth_mindset_leads
AWS_DYNAMODB_REGISTRATIONS_TABLE=wealth_mindset_event_registrations
AWS_DYNAMODB_EVENTS_TABLE=wealth_mindset_events
AWS_DYNAMODB_COURSE_LEADS_TABLE=wealth_mindset_course_leads
AWS_DYNAMODB_CHAT_HISTORY_TABLE=wealth_mindset_chat_history
```

Required Bedrock variables:

```txt
AWS_BEDROCK_ENABLED=true
AWS_BEDROCK_REGION=eu-north-1
AWS_BEDROCK_MODEL_ID=eu.amazon.nova-lite-v1:0
```

Temporary debug variable:

```txt
AI_DEBUG=true
```

Turn `AI_DEBUG` off after troubleshooting:

```txt
AI_DEBUG=false
```

Email/admin variables:

```txt
ADMIN_PASSWORD=...
RESEND_API_KEY=...
EMAIL_FROM=admin@thewealth-mindset.com
```

## DynamoDB Tables

- `wealth_mindset_leads`
  - General website leads.

- `wealth_mindset_event_registrations`
  - Event registrations.

- `wealth_mindset_events`
  - CMS-managed events.

- `wealth_mindset_course_leads`
  - Course-update and academy interest leads.
  - Includes `source-created_at-index`.

- `wealth_mindset_chat_history`
  - Chatbot exchanges.
  - Includes `session_id-created_at-index`.
  - Uses TTL attribute `expires_at`.
  - Current retention: 180 days.

## Guardrails

### Input Guardrails

The assistant blocks or redirects risky user requests before calling Bedrock.

Current categories:

- `sensitive_personal_data`
  - Blocks passwords, PINs, OTPs, full card details, CVV/CVC, ID numbers, and passport numbers.

- `payment_sensitive_info`
  - Blocks banking logins, card details, and sensitive payment collection in chat.

- `investment_advice`
  - Blocks buy/sell instructions, investment recommendations, price predictions, ROI requests, and guaranteed-return language.

- `legal_tax_advice`
  - Blocks legal and tax advice requests.

### Output Guardrails

After Nova responds, the assistant checks for risky response patterns before sending the message to the user.

Current blocked output patterns include:

- `you should buy`
- `you should sell`
- `buy now`
- `sell now`
- guaranteed return/profit/income/money
- requests for passwords, PINs, OTPs, CVV/CVC, card numbers, or card details
- `hide money`
- `evade tax`

If blocked, the response is replaced with a safe message directing the user back to education and `admin@thewealth-mindset.com`.

## Bedrock Prompt Rules

Nova is instructed to:

- Answer as The Wealth Mindset website assistant.
- Use only supplied site context when facts are needed.
- Be concise, warm, and practical.
- Use simple bullets and short lines for multi-item answers.
- Avoid heavy Markdown formatting.
- Never provide financial advice, investment recommendations, buy/sell instructions, guaranteed returns, legal advice, tax advice, or price predictions.
- Never ask for passwords, PINs, OTPs, CVV/CVC, full card numbers, banking logins, ID numbers, or passport numbers.
- Not invent event dates, venues, prices, partnerships, course start dates, or unsupported claims.
- Keep event questions focused on events.
- Keep course questions focused on courses and say courses will go live soon.
- Direct users to `admin@thewealth-mindset.com` for more communication.

## Known Limitations

- The RAG layer currently indexes structured site data from `src/data.json`.
- PDF/DOCX files are discovered but their internal text is not extracted yet.
- There is no vector database yet.
- Retrieval is keyword/intent based, not embedding based.
- Chat history is saved per exchange, but there is no admin UI for reviewing chat sessions yet.
- Guardrails are regex/keyword based and should be reviewed as real user traffic grows.
- `AI_DEBUG` can expose internal Bedrock status and should not remain enabled permanently.

## Recommended Next Improvements

- Add PDF/DOCX text extraction into the knowledge base.
- Add embeddings with Amazon Titan Text Embeddings or another Bedrock embedding model.
- Store searchable chunks in a dedicated knowledge table or vector store.
- Add an admin view for course leads and chat history.
- Add rate limiting to `/api/ai-chat` and `/api/course-lead`.
- Add consent/privacy copy for chat history retention.
- Add automated tests for intent classification and guardrails.
- Replace temporary debug output with admin-only diagnostics.

## Review Checklist

Use this checklist when reviewing future assistant versions:

- Does the assistant answer event questions with actual events only?
- Does it keep course questions separate from event questions?
- Does it avoid financial advice and price predictions?
- Does it avoid legal/tax guidance?
- Does it avoid collecting sensitive personal/payment data?
- Does it direct users to `admin@thewealth-mindset.com` when needed?
- Does it save chat history and course leads correctly?
- Does it show `v2.8` when Bedrock is used?
- Does it gracefully fall back to `v2.7` if Bedrock fails?
- Is `AI_DEBUG` off in production unless actively troubleshooting?

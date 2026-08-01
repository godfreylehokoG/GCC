# AWS Migration Notes

This project no longer needs Supabase for client registrations. The serverless API now writes and reads from DynamoDB through the AWS SDK.

## What Changed

- `/api/lead` writes general interest leads to DynamoDB.
- `/api/register` writes event registrations to DynamoDB.
- `/api/admin-data` reads both DynamoDB tables after checking `ADMIN_PASSWORD`.
- The admin dashboard no longer imports Supabase in browser code.

## AWS Resources

Create the DynamoDB tables with CloudFormation:

```powershell
aws cloudformation deploy `
  --region af-south-1 `
  --stack-name wealth-mindset-dynamodb `
  --template-file aws/dynamodb-tables.yml
```

The template creates:

- `wealth_mindset_leads`
- `wealth_mindset_event_registrations`

Both use on-demand billing, encryption at rest, and point-in-time recovery.

## App Environment Variables

Set these in Vercel or the hosting platform:

```text
AWS_REGION=af-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DYNAMODB_LEADS_TABLE=wealth_mindset_leads
AWS_DYNAMODB_REGISTRATIONS_TABLE=wealth_mindset_event_registrations
ADMIN_PASSWORD=...
RESEND_API_KEY=...
EMAIL_FROM=admin@thewealth-mindset.com
```

After confirming the AWS deployment works, remove the old Supabase variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
VITE_ADMIN_PASSWORD
```

## IAM Policy

Use `aws/vercel-dynamodb-policy.json` as the policy for the app credentials. Replace `YOUR_ACCOUNT_ID` with the real AWS account ID, and adjust the region/table names if you changed them.

The app only needs:

- `dynamodb:PutItem` for form submissions
- `dynamodb:Scan` for the admin dashboard

## Data Migration

If the Supabase project becomes available again, export these tables as CSV before closing it:

- `leads`
- `event_registrations`

Import those rows into the matching DynamoDB tables while preserving the snake_case field names. The app expects the same field names it used in Supabase, including `first_name`, `last_name`, `created_at`, `event_title`, and `payment_status`.

## Production Check

After deploying:

1. Submit the public interest form.
2. Submit one event registration.
3. Open `/admin`, log in with `ADMIN_PASSWORD`, and confirm both records appear.
4. Confirm the confirmation email still sends through Resend.

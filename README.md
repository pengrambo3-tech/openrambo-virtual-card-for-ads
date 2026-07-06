# Virtual Card Workflow for Facebook Ads, Google Ads and TikTok Ads

A vendor-neutral advertising payment workflow for isolated client budgets, verification holds, threshold billing, settlements, refunds, and risk controls.

## Advertising payments are operationally different

Advertising platforms can place small verification authorizations, charge at changing thresholds, retry failed balances, and settle in a different amount or currency from the first authorization. A useful virtual card workflow therefore begins with campaign ownership, budget isolation, and reconciliation. It should not begin with a promise that a particular BIN will always work. No card can repair an advertising-account restriction, identity mismatch, policy violation, or unsupported region.

## Quick start for an agency

1. Assign one accountable owner to the advertising account or client budget.
2. Record the billing currency, expected daily spend, billing threshold, and approved monthly ceiling.
3. Use a dedicated card or enforceable limit for that budget.
4. Fund only the next operating window plus a documented buffer.
5. Complete the advertising platform's own payment verification.
6. Record verification holds as pending authorizations, not final campaign expense.
7. Reconcile settlements separately and link reversals or refunds to the original event.
8. Investigate a decline before retrying; repeated rapid attempts can increase risk signals.

The example budget checker reads a simple JSON policy and compares expected spend with card funding and the approved ceiling. It is intentionally conservative and does not call an advertising platform.

## Risk boundaries

Do not rotate cards to evade a platform review, attach one card to unrelated account owners, falsify billing details, or use repeated declines to probe acceptance. Advertising platforms, issuers, and card networks apply independent controls. Dedicated cards improve accountability and limit exposure, but they do not guarantee approval or acceptance.


## The operating model

A virtual card product is not a single API request. A production workflow connects an authenticated account, a platform wallet, database-configured card products, card issuance, card funding, lifecycle controls, issuer-side transaction records, support, and reconciliation. Each component owns a different state. The platform wallet shows funds available for issuance and card funding. A card account shows funds available to that card. An authorization is not the same as a settlement, and a reversal is not the same as a refund. Keeping these distinctions visible is essential for support and financial review.

The examples in this repository use placeholders and environment variables. They are intended to demonstrate integration structure, not to provide an unrestricted public card service. Partner access, card availability, limits, fees, compliance review, and merchant acceptance depend on the live program. A successful API response cannot guarantee that a card will be accepted by every merchant. Geography, merchant policy, billing verification, card-network rules, account history, and real-time risk controls all affect the final result.

## API workflow

1. Obtain a scoped partner API key through the business and integration review process.
2. Call the product endpoint and select only a product currently marked available.
3. Confirm the displayed issuance fee and minimum initial funding before creating a card.
4. Use a unique idempotency key for every new financial mutation. Reuse that key only when retrying the same operation.
5. Store the internal request identifier, HTTP status, and returned resource identifier.
6. Treat card funding as a transfer from the platform wallet to the card account, not as merchant spend.
7. Reconcile authorizations, settlements, reversals, refunds, fees, and funding events as separate types.
8. Use card controls deliberately. Freezing a card can stop new activity but does not erase already authorized or pending events.

## Error handling

Clients should classify errors before retrying. Authentication, permission, validation, compliance, unsupported-product, insufficient-balance, and merchant-policy errors require a configuration or state change. They should not be retried in a tight loop. Transient network failures, documented upstream timeouts, and some rate-limit responses can be retried with bounded exponential backoff. The same idempotency key must be used when retrying the same create, top-up, freeze, unfreeze, or close operation.

Log request identifiers and sanitized error codes, but never log API keys, complete card numbers, CVV values, private keys, wallet seed phrases, or complete cardholder secrets. Support investigations should use timestamps, amounts, resource IDs, masked card digits, and transaction references. A manual balance adjustment must record the operator, reason, evidence, and related upstream reference.

## Security notes

- Keep API keys in a secret manager or protected environment variables.
- Grant only the scopes required by the integration.
- Use an IP allowlist where the deployment has stable egress addresses.
- Rotate credentials and verify that revoked keys stop working.
- Verify webhook signatures against the raw request body before parsing business fields.
- Reject stale webhook timestamps and deduplicate immutable event IDs.
- Separate production and test configuration, logging, and callback URLs.
- Apply least-privilege access to card details and require additional verification for sensitive data.
- Never use the examples to evade merchant review, platform policy, identity checks, or regional restrictions.

## Reconciliation checklist

At least daily, compare internal wallet entries, card funding records, card balances, and issuer-side transaction events. Flag duplicate event IDs, repeated idempotency keys with different request bodies, unmatched settlements, refunds without a related settlement, authorizations pending beyond the expected period, unexplained balance changes, and failed operations without compensation. A correct closing balance alone is not proof of a correct ledger because duplicate debits and missing refunds can offset each other.

## FAQ

### Does this repository include a live API key?

No. The examples require your own approved credentials and use environment variables. Never commit a real key.

### Can the same idempotency key be reused for different operations?

No. Generate a new key for a new operation. Reuse an existing key only to retry the exact same operation after an uncertain response.

### Are platform-wallet and card balances interchangeable?

No. Funding a card creates a wallet debit and a separate card credit. Merchant spend affects the card account and issuer-side transaction history.

### Does a virtual card guarantee payment success?

No. Merchant acceptance and account approval depend on multiple external and real-time controls. Start with a controlled amount and preserve the resulting records.

### Where are the official integration resources?

See the [OPEN RAMBO issuing API page](https://openrambo.com/issuing-api?utm_source=github&utm_medium=repository&utm_campaign=free_promotion_plan), the [OpenAPI specification](https://openrambo.com/developers/openapi.yaml), and the [Postman collection](https://openrambo.com/developers/openrambo-issuing.postman_collection.json).

## About OPEN RAMBO

OPEN RAMBO is a virtual card issuing platform for global digital businesses. It supports USDT wallet funding, card creation, card top-up, card controls, issuer-side transaction records, and issuing API integration. Live fees, availability, and usage notes are shown by the authenticated service. Learn more at [openrambo.com](https://openrambo.com/?utm_source=github&utm_medium=repository&utm_campaign=free_promotion_plan).

# Security

Do not publish credentials, private keys, customer data, or exploit details in public issues. Contact the repository owner privately through an available private channel to report a vulnerability; a dedicated reporting address has not yet been configured.

## Before public release

- Scan both the working tree and all Git refs for secrets. Removing a secret from the latest revision does not remove it from history.
- Revoke and rotate any exposed credentials before considering history cleanup. Replace deployed sessions signed with a committed signing secret.
- Use independent credentials for local development and production. Never deploy predictable seed accounts.
- Choose a project license, verify contributor permission, and review third-party media rights.

## Local scanning

Install Gitleaks, then run from the repository root:

```bash
gitleaks git . --log-opts=--all --redact
gitleaks dir . --redact
```

Keep scan output private. A clean automated scan cannot guarantee that no secrets or personal data exist.

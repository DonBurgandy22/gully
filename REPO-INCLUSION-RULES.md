# REPO INCLUSION RULES

## Purpose
- Define what belongs in Git and what must stay local.

## Always commit
- verified continuity files
- stable scripts that improve repeatable operations

## Commit only if verified useful
- diagnostics that capture a proven lesson
- helper scripts that are stable and reusable

## Never commit
- live credentials
- session state
- machine-specific temp artifacts

## Security exclusions
- tokens
- auth files
- WhatsApp creds

## Diagnostic artifacts policy
- commit only concise diagnostics with durable learning value

## Backup folder policy
- keep backups local unless redacted and intentionally published

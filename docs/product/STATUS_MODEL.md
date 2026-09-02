# EMR Despachante — Status Models

## VehicleOverallStatus
- REGULAR
- ATTENTION
- IRREGULAR
- PROCESSING
- MANUAL_REVIEW
- UNKNOWN

## FineStatus
- OPEN
- PAYMENT_PENDING
- PAID
- CLEARANCE_PROCESSING
- CLEARED
- CANCELLED

## LicensingStatus
- ELIGIBLE
- BLOCKED
- PAYMENT_PENDING
- PAID
- PROCESSING
- DOCUMENT_READY
- FAILED

## PaymentStatus
- PENDING
- PAID
- FAILED
- CANCELLED
- REFUND_PENDING
- REFUNDED

## GovernmentSubmissionStatus
- NOT_REQUESTED
- QUEUED
- PROCESSING
- CONFIRMED
- FAILED
- MANUAL_REVIEW

## CaseStatus
- OPEN
- IN_PROGRESS
- WAITING_CLIENT
- WAITING_EXTERNAL
- RESOLVED
- CANCELLED

## CasePriority
- LOW
- MEDIUM
- HIGH
- CRITICAL

## OperatorStatus
- INVITED
- ACTIVE
- SUSPENDED
- DISABLED

## ServiceStatus
- ACTIVE
- INACTIVE

## Regra
Display status pode ser composto, mas source-of-truth statuses devem permanecer explícitos.

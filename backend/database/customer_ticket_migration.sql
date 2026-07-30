BEGIN;

-- Customer-created tickets have no employee creator.
ALTER TABLE ticket
    ALTER COLUMN created_by_employee_id DROP NOT NULL;

-- Stop if legacy rows need a customer assigned before enforcing the invariant.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM ticket
        WHERE customer_id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Assign a customer_id to every existing ticket before running this migration';
    END IF;
END
$$;

ALTER TABLE ticket
    ALTER COLUMN customer_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ticket_customer_created
    ON ticket(customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_status
    ON ticket(status);

COMMIT;

CREATE OR REPLACE FUNCTION public.tm_sum_transactions(
    period_interval INTERVAL, 
    transaction_type public."TransactionRecordType" DEFAULT NULL
) RETURNS TABLE(entity_id TEXT, total_amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT COALESCE("businessId", "endUserId") AS entity_id, SUM("transactionAmount")
    FROM public."TransactionRecord"
    WHERE "transactionDate" >= CURRENT_TIMESTAMP - period_interval
      AND ("transactionType" = transaction_type OR transaction_type IS NULL)
    GROUP BY entity_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.tm_count_transactions(
    period_interval INTERVAL, 
    transaction_type public."TransactionRecordType" DEFAULT NULL
) RETURNS TABLE(entity_id TEXT, transaction_count INT) AS $$
BEGIN
    RETURN QUERY
    SELECT COALESCE("businessId", "endUserId") AS entity_id, COUNT(*)
    FROM public."TransactionRecord"
    WHERE "transactionDate" >= CURRENT_TIMESTAMP - period_interval
      AND ("transactionType" = transaction_type OR transaction_type IS NULL)
    GROUP BY entity_id;
END;
$$ LANGUAGE plpgsql;

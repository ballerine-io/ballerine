CREATE OR REPLACE
FUNCTION public.search_workflow_data(
	search_text TEXT,
	entity_type TEXT,
	workflow_ids TEXT[],
	statuses TEXT[],
	project_ids TEXT[],
	assignee_ids TEXT[],
	case_statuses TEXT[],
	include_unassigned boolean
)
RETURNS TABLE (
	id TEXT
) AS $$
DECLARE
	search_term TEXT := regexp_replace(
		trim(
			regexp_replace(
				regexp_replace(search_text, '[^a-zA-Z0-9\s]', '', 'g'),
				'\s{1,}', ' ', 'g'
			)
		),
		'\s+', ':*&', 'g'
	);

BEGIN
	IF search_term != '' THEN
        search_term := concat(
	search_term,
	':*'
);
END IF;
RETURN QUERY
    SELECT
	wrd."id"
FROM
	public."WorkflowRuntimeData" wrd
LEFT JOIN LATERAL jsonb_array_elements_text(wrd.tags) AS tag ON
	TRUE
WHERE
	(
		search_term = ''
		OR
        (
			search_term <> ''
			AND
			to_tsquery('simple', search_term) @@
            to_tsvector('simple',
				regexp_replace(
					lower(CONCAT_WS(' ',
    					wrd.context->'entity'->>'id',
    					wrd.context->'entity'->>'ballerineEntityId',
    					wrd.context->'entity'->'data'->>'firstName',
    					wrd.context->'entity'->'data'->>'middleName',
    					wrd.context->'entity'->'data'->>'lastName',
    					wrd.context->'entity'->'data'->>'email',
    					wrd.context->'entity'->'data'->>'companyName',
    					wrd.context->'entity'->'data'->>'phone')),
					'[^a-zA-Z0-9\s]',
					'',
					'g'
				)
			)
		)
	)
	AND
    (
		"workflowDefinitionId" = ANY(workflow_ids)
		OR
        array_length(workflow_ids, 1) IS NULL
	)
	AND
    (
		"status"::TEXT = ANY(statuses)
		OR
        array_length(statuses, 1) IS NULL
	)
	AND
    (
		"projectId" = ANY(project_ids)
		OR
        array_length(project_ids, 1) IS NULL
	)
	AND
    (
		CASE
			WHEN entity_type = 'individuals' THEN "endUserId" IS NOT NULL
			ELSE "businessId" IS NOT NULL
		END
	)
	AND
    (
		"assigneeId" = ANY(assignee_ids)
		OR
        (
			include_unassigned
			AND "assigneeId" IS NULL
		)
		OR
        (
			include_unassigned IS NOT TRUE
			AND array_length(assignee_ids, 1) IS NULL
		)
	)
	AND
   	(
		tag = ANY(case_statuses)
		OR
   		array_length(case_statuses, 1) IS NULL
	);
END;

$$ LANGUAGE plpgsql;

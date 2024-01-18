CREATE OR REPLACE FUNCTION public.search_workflow_data(
    search_text text,
    entity_type text,
    workflow_ids text[],
    statuses text[],
    project_ids text[],
    assignee_ids text[],
    case_statuses text[],
    include_unassigned boolean
)
RETURNS TABLE (id text) AS $$
BEGIN
    RETURN QUERY
    SELECT wrd."id"
    FROM public."WorkflowRuntimeData" wrd
    CROSS JOIN LATERAL jsonb_array_elements_text(wrd.tags) as tag
    WHERE
        (
            ("context"->'entity'->'data'->>'companyName' ILIKE '%' || search_text || '%'
            OR "context"->'entity'->'data'->>'email' ILIKE '%' || search_text || '%'
            OR "context"->'entity'->'data'->>'firstName' ILIKE '%' || search_text || '%'
            OR "context"->'entity'->'data'->>'lastName' ILIKE '%' || search_text || '%')
            OR
            search_text IS NULL
        )
        AND
        (
            "workflowDefinitionId" = ANY(workflow_ids)
            OR
            array_length(workflow_ids, 1) IS NULL
        )
        AND
        (
            "status"::text = ANY(statuses)
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
            (include_unassigned AND "assigneeId" IS NULL)
            OR
            (include_unassigned IS NOT TRUE AND array_length(assignee_ids, 1) IS NULL)
        )
       	AND
       	(
       		tag = ANY(case_statuses)
       		OR
       		array_length(case_statuses, 1) IS NULL
       	);
END;
$$ LANGUAGE plpgsql;

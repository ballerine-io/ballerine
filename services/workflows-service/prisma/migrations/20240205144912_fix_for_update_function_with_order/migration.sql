CREATE OR REPLACE FUNCTION public.search_workflow_data(
    search_text TEXT,
    entity_type TEXT,
    order_by_column TEXT,
    order_direction TEXT,
    workflow_ids TEXT[],
    statuses TEXT[],
    project_ids TEXT[],
    assignee_ids TEXT[],
    case_statuses TEXT[],
    include_unassigned BOOLEAN
)
RETURNS TABLE(id TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    search_term TEXT := regexp_replace(trim(regexp_replace(regexp_replace(search_text, '[^a-zA-Z0-9\s]', '', 'g'), '\s{1,}', ' ', 'g')), '\s+', ':*&', 'g');
    query TEXT;
   	workflow_ids_str TEXT;
  	statuses_str TEXT;
  	project_ids_str TEXT;
 	  case_statuses_str TEXT;
	  assignee_ids_str TEXT;

BEGIN
    IF search_term != '' THEN
        search_term := concat(search_term, ':*');
    END IF;

   	IF ARRAY_LENGTH(workflow_ids, 1) IS NULL THEN
   		workflow_ids_str := 'ARRAY[]::TEXT[]';
   	ELSE
   		workflow_ids_str := 'ARRAY[''' || REPLACE(ARRAY_TO_STRING(workflow_ids, ','), ',', ''',''') || ''']::TEXT[]';
   	END IF;

   	IF ARRAY_LENGTH(statuses, 1) IS NULL THEN
   		statuses_str := 'ARRAY[]::TEXT[]';
   	ELSE
   		statuses_str := 'ARRAY[''' || REPLACE(ARRAY_TO_STRING(statuses, ','), ',', ''',''') || ''']::TEXT[]';
   	END IF;

   	IF ARRAY_LENGTH(project_ids, 1) IS NULL THEN
   		project_ids_str := 'ARRAY[]::TEXT[]';
   	ELSE
   		project_ids_str := 'ARRAY[''' || REPLACE(ARRAY_TO_STRING(project_ids, ','), ',', ''',''') || ''']::TEXT[]';
   	END IF;

   	IF ARRAY_LENGTH(case_statuses, 1) IS NULL THEN
   		case_statuses_str := 'ARRAY[]::TEXT[]';
   	ELSE
   		case_statuses_str :='ARRAY[''' || REPLACE(ARRAY_TO_STRING(case_statuses, ','), ',', ''',''') || ''']::TEXT[]';
   	END IF;

   	IF ARRAY_LENGTH(assignee_ids, 1) IS NULL THEN
   		assignee_ids_str := 'ARRAY[]::TEXT[]';
   	ELSE
   		assignee_ids_str := 'ARRAY[''' || REPLACE(ARRAY_TO_STRING(assignee_ids, ','), ',', ''',''') || ''']::TEXT[]';
   	END IF;

    query := '
		SELECT wrd."id"
		FROM public."WorkflowRuntimeData" wrd
		LEFT JOIN LATERAL jsonb_array_elements_text(wrd.tags) AS tag ON TRUE
		WHERE
		(
			''' || search_term || ''' = ''''
			OR
			(
				''' || search_term || ''' <> ''''
				AND to_tsquery(''simple'', ''' || search_term || ''') @@
					to_tsvector(''simple'',
						regexp_replace(lower(CONCAT_WS('' '',
							wrd.context->''entity''->>''id'',
							wrd.context->''entity''->>''ballerineEntityId'',
							wrd.context->''entity''->''data''->>''firstName'',
							wrd.context->''entity''->''data''->>''middleName'',
							wrd.context->''entity''->''data''->>''lastName'',
							wrd.context->''entity''->''data''->>''email'',
							wrd.context->''entity''->''data''->>''companyName'',
							wrd.context->''entity''->''data''->>''phone'')), ''[^a-zA-Z0-9\s]'', '''', ''g''))
			)
		)
		AND (
			"workflowDefinitionId" = ANY(' || workflow_ids_str || ')
			OR array_length(' || workflow_ids_str || ', 1) IS NULL
		)
		AND (
			"status"::TEXT = ANY(' || statuses_str || ')
			OR array_length(' || statuses_str || ', 1) IS NULL
		)
		AND (
			"projectId" = ANY(' || project_ids_str || ')
			OR array_length(' || project_ids_str || ', 1) IS NULL
		)
		AND (
			CASE
				WHEN ''' || entity_type || ''' = ''individuals''
				THEN "endUserId" IS NOT NULL
				ELSE "businessId" IS NOT NULL
			END
		)
		AND (
			"assigneeId" = ANY(' || assignee_ids_str || ')
			OR (' || include_unassigned || ' IS TRUE AND "assigneeId" IS NULL)
			OR (' || include_unassigned || ' IS NOT TRUE AND array_length(' || assignee_ids_str || ', 1) IS NULL)
		)
		AND (
			tag = ANY(' || case_statuses_str || ')
			OR array_length(' || case_statuses_str || ', 1) IS NULL
		) ';

    query := query || ' ORDER BY ' || quote_ident(order_by_column) || ' ' || (CASE WHEN lower(order_direction) = 'asc' THEN 'ASC' ELSE 'DESC' END);

    RETURN QUERY EXECUTE query;
END;
$$;

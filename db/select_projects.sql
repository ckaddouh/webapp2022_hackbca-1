SELECT 
	project.project_id as project_id, 
    project_name, 
    project_duration,
    event_type,
    DATE_FORMAT(project_date_proposed, '%Y-%m-%d') as project_date_proposed,
    project_team_id,
    project_description,
    event_interest,
    likes_id
FROM 
	event LEFT JOIN (
		SELECT COUNT(*) as likes_id, project_id 
        FROM likes
		GROUP BY project_id
	) as likes ON project.project_id = likes.project_id,
    project_team_id, project_type
WHERE
    
    and project.project_type_id = project_type.project_type_id

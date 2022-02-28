SELECT 
	project.project_id as project_id, 
    project_name, 
    project_type_id,
    project_team_id,
    DATE_FORMAT(date_proposed, '%m-%d-%Y') as project_date_proposed,
    likes_id,
    project_description
FROM 
	event LEFT JOIN (
		SELECT COUNT(*) as likes_id, project_id 
        FROM likes
		GROUP BY project_id
	) as event_user_counts ON project.project_id = event_user_counts.event_id,
    project_type, project_team_id
WHERE
	project.project_team_id = team.team_id
    and project.project_type_id = project_type.project_type_id
    and project.project_id = ?

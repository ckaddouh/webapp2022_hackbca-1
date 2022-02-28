SELECT 
	project.project_id as project_id, 
    project_name, 
    project_type_id,
    project_team_id,
    DATE_FORMAT(date_proposed, '%m-%d-%Y') as project_date_proposed,
    likes_id,
    project_description
FROM 
	project 
WHERE
	project.project_id = ?
LIMIT 1
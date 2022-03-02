SELECT 
    project.project_id, 
    project.project_name,
    project.project_team_id,
    project.project_type_id,
    DATE_FORMAT(date_proposed, '%Y-%m-%d') as date_proposed,
    project.project_description,
    project_likes
FROM 
	project 
WHERE
	project.project_id = ?
LIMIT 1
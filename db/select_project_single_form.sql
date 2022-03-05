SELECT 
    project.project_id, 
    project.project_name,
    team.team_name,
    project_type.name,
    DATE_FORMAT(date_proposed, '%Y-%m-%d') as date_proposed,
    project.description
    -- project_likes
FROM 
	project, team, project_type
WHERE
	project.project_id = ?
    and project.project_team_id = team.team_id
    and project.project_type_id = project_type.project_type_id
LIMIT 1
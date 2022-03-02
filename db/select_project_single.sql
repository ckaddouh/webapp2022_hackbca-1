SELECT 
    project.project_id, 
    project.project_name,
    project.project_team_id,
    project.project_type_id,
    DATE_FORMAT(date_proposed, '%Y-%m-%d') as date_proposed,
    project.project_description,
    project_likes
FROM 
	project LEFT JOIN (
		SELECT COUNT(*) as project_likes, project.project_id 
        FROM likes
		GROUP BY likes.project_id
	) as project_like_counts ON project.project_id = project_like_counts.project_id,
    project.project_team_id, project.project_type_id
WHERE
	project.project_team_id = team.team_id
    and project.project_type_id = project_type.project_type_id
    and project.project_id = ?
LIMIT 1
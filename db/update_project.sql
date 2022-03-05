UPDATE event
SET
    project.project_name = ?,
    project.project_team_id = ?,  
    project.project_type_id = ?, 
    project.date_proposed = STR_TO_DATE(?,'%m-%d-%Y'),
    project.description = ?
WHERE
	project.project_id = ?
;
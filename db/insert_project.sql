INSERT INTO project
        (`project_name`, `project_team_id`, `project_type_id`, `date_proposed`, `description`) 
VALUES 
        (?, 
        ?,  
        ?,
        STR_TO_DATE(?, '%m-%d-%Y'), 
        ?);

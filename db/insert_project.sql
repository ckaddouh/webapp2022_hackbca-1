INSERT INTO event
        (`project_name`, `project_type_id`, `project_team_id`, `date_proposed`, `description`) 
VALUES 
        (?, 
        ?,  
        ?,
        STR_TO_DATE(?, '%m-%d-%Y %h:%i %p'), 
        ?);

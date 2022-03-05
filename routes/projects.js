var express = require('express');
var router = express.Router();
var db = require('../db/db');

const fs = require('fs');
const path = require('path');
const { redirect } = require('express/lib/response');

function requireAdmin(req, res, next){
  if(res.locals.isAdmin)
      next();
  else
    res.redirect("/");
    // next("AGHHH NOT ALLOWED");
}

let projectsQuery = fs.readFileSync(path.join(__dirname, "../db/select_projects.sql"), "utf-8");

/* GET events "home" page - a list of all events. */
router.get('/', async function(req, res, next) {
  // let promise = db.queryPromise(projectsQuery)
  // promise.then((results) => {
  //   res.render('events', { title: 'Projects', style: "tables", projects: results});
  // }).catch((err) => {
  //   next(err);
  // });

  try {
    let results = await db.queryPromise(projectsQuery)
    console.log(results);
    res.render('projects', { title: 'Projects', style: "tables", projects: results});
  } catch (err) {
    next(err);
  }
 

});

let project_teams_query = fs.readFileSync(path.join(__dirname, "../db/select_project_teams.sql"), "utf-8");
let project_types_query = fs.readFileSync(path.join(__dirname, "../db/select_project_types.sql"), "utf-8");


router.get('/create', requireAdmin, async function(req, res, next) {
  try {

    let project_teams = await db.queryPromise(project_teams_query);
    let project_types = await db.queryPromise(project_types_query);
    res.render('projectform', {title: "Create Project", style: "newevent", 
                            project_teams:project_teams, 
                          project_types:project_types})
  } catch(err) {
    next(err);
  }
})

let singleProjectQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single.sql"), "utf-8");

router.get('/:project_id', function(req, res, next) {
  let project_id = req.params.project_id
  // GET FROM DATABASE: Select query where event_id = event_id from URL
  //For now, lets pretend
  // let event_data = {event_id: event_id,
  //                 event_name: "Opening Ceremony", 
  //                 event_location: "Auditorium",
  //                 event_date: "May 1 (Sat)",
  //                 event_time: "10:30 AM",
  //                 event_duration: "30m",
  //                 event_type: "Main",
  //                 event_interest: "100",
  //                 event_description: "Be there!"}
  db.query(singleProjectQuery, [project_id], (err, results) => {
    if (err)
      next(err);
    console.log(results);
    let project_data = results[0]; 
    res.render('project', { title: 'Project Details', 
                      styles: ["tables", "event"], 
                      project_id : project_id, 
                      project_data: project_data});
  });
});


let singleProjectForFormQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single_form.sql"), "utf-8");

router.get('/:project_id/modify', requireAdmin , async function(req, res, next) {
  try {

    let project_teams = await db.queryPromise(project_teams_query);
    let project_types = await db.queryPromise(project_types_query);
    let project_id = req.params.project_id
    let results = await db.queryPromise( singleProjectForFormQuery, [project_id]);
    let project_data = results[0];

    res.render('projectform', {title: "Modify Project", style: "newevent", 
                            project_teams:project_teams, 
                          project_types:project_types,
                        project: project_data}); // provide current project data
  } catch(err) {
    next(err);
  }

});

let insertProjectQuery = fs.readFileSync(path.join(__dirname, "../db/insert_project.sql"), "utf-8");
// (`event_name`, `event_location_id`, `event_type_id`, `event_dt`, `event_duration`, `event_description`) 
router.post('/', async function(req, res, next) { //requireAdmin
  try {
    let results = await db.queryPromise(insertProjectQuery, [req.body.project_name, 
      req.body.project_type_id, 
      req.body.project_team_id, 
      req.body.date_proposed,
      req.body.description,
    ]);

  let project_id_inserted = results.insertId;
  res.redirect(`/projects/${project_id_inserted}`);
  } catch(err) {
    next(err);
  }
})

let updateProjectQuery = fs.readFileSync(path.join(__dirname, "../db/update_project.sql"), "utf-8"); 
router.post('/:project_id', requireAdmin ,async function(req, res, next) {
  try {
    let results = await db.queryPromise(updateProjectQuery, [req.body.project_name, 
      req.body.project_type_id, 
      req.body.project_team_id, 
      req.body.date_proposed,
      req.body.description,
      req.params.project_id // or req.body.event_id, since its a hidden input in the form
    ]);

  res.redirect(`/projects/${req.params.project_id}`);
  } catch(err) {
    next(err);
  }
})

let deleteProjectQuery = "DELETE FROM project WHERE project_id = ?";
router.get('/:projects_id/delete', requireAdmin, async (req, res, next) => {
  try {
    await db.queryPromise(deleteProjectQuery, req.params.project_id);
    res.redirect('/projects')
  } catch (err) {
    next(err);
  }
})

module.exports = router;

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

let eventsQuery = fs.readFileSync(path.join(__dirname, "../db/select_projects.sql"), "utf-8");

/* GET events "home" page - a list of all events. */
router.get('/', async function(req, res, next) {
  // let promise = db.queryPromise(eventsQuery)
  // promise.then((results) => {
  //   res.render('events', { title: 'Events', style: "tables", events: results});
  // }).catch((err) => {
  //   next(err);
  // });

  try {
    let results = await db.queryPromise(eventsQuery)
    console.log(results);
    res.render('projects', { title: 'Projects', style: "tables", events: results});
  } catch (err) {
    next(err);
  }
 

});

let event_locations_query = fs.readFileSync(path.join(__dirname, "../db/select_event_locations.sql"), "utf-8");
let event_types_query = fs.readFileSync(path.join(__dirname, "../db/select_event_types.sql"), "utf-8");


router.get('/create', requireAdmin ,async function(req, res, next) {
  try {

    let event_locations = await db.queryPromise(event_locations_query);
    let event_types = await db.queryPromise(event_types_query);
  
    res.render('projectform', {title: "Create Project", style: "newevent", 
                            event_locations:event_locations, 
                          event_types:event_types})
  } catch(err) {
    next(err);
  }
})

let singleEventQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single.sql"), "utf-8");

router.get('/:project_id', function(req, res, next) {
  let project_id = req.params.event_id
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
  db.query(singleEventQuery, [event_id], (err, results) => {
    if (err)
      next(err);
    console.log(results);
    let event_data = results[0];
    res.render('project', { title: 'Project Details', 
                      styles: ["tables", "event"], 
                      project_id : project_id, 
                      project_data: project_data});
  });
});


let singleEventForFormQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single_form.sql"), "utf-8");

router.get('/:project_id/modify', requireAdmin , async function(req, res, next) {
  try {

    let event_locations = await db.queryPromise(event_locations_query);
    let event_types = await db.queryPromise(event_types_query);
    //Very much like the get('/:event_id') route... 
    let project_id = req.params.event_id
    let results = await db.queryPromise( singleProjectForFormQuery, [project_id]);
    let project_data = results[0];

    res.render('projectform', {title: "Modify Project", style: "newevent", 
                            event_locations:event_locations, 
                          event_types:event_types,
                        event: event_data}); // provide current event data
  } catch(err) {
    next(err);
  }

});

let insertEventQuery = fs.readFileSync(path.join(__dirname, "../db/insert_project.sql"), "utf-8");
// (`event_name`, `event_location_id`, `event_type_id`, `event_dt`, `event_duration`, `event_description`) 
router.post('/', requireAdmin ,async function(req, res, next) {
  try {
    let results = await db.queryPromise(insertEventQuery, [req.body.event_name, 
      req.body.event_location_id, 
      req.body.event_type_id, 
      `${req.body.event_date} ${req.body.event_time}`,
      req.body.event_duration,
      req.body.event_description
    ]);

  let project_id_inserted = results.insertId;
  res.redirect(`/projects/${event_id_inserted}`);
  } catch(err) {
    next(err);
  }
})

let updateEventQuery = fs.readFileSync(path.join(__dirname, "../db/update_project.sql"), "utf-8"); 
router.post('/:project_id', requireAdmin ,async function(req, res, next) {
  try {
    let results = await db.queryPromise(updateEventQuery, [req.body.event_name, 
      req.body.event_location_id, 
      req.body.event_type_id, 
      `${req.body.event_date} ${req.body.event_time}`,
      req.body.event_duration,
      req.body.event_description,
      req.params.event_id // or req.body.event_id, since its a hidden input in the form
    ]);

  res.redirect(`/projects/${req.params.event_id}`);
  } catch(err) {
    next(err);
  }
})

let deleteEventQuery = "DELETE FROM event WHERE project_id = ?";
router.get('/:projects_id/delete', requireAdmin, async (req, res, next) => {
  try {
    await db.queryPromise(deleteEventQuery, req.params.project_id);
    res.redirect('/projects')
  } catch (err) {
    next(err);
  }
})

module.exports = router;

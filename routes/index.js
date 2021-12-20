var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Server Manager' });
});
router.get('/console', function(req, res, next) {
  res.render('console', { selectedServer: "test" });
});
router.get("/properties",(req,res)=>{
  res.render("properties");
});
router.get("/settings",(req,res)=>{
  res.render("appsettings");
});
router.get("/logs",(req,res)=>{
  res.render("logs");
});
router.get("/permissions",(req,res)=>{
  res.render("permissions");
});
router.get("/properties",(req,res)=>{
  res.render("properties");
});
router.get("/whitelist",(req,res)=>{
  res.render("whitelist");
});
router.get("/resourcepacks",(req,res)=>{
  res.render("resourcepacks");
});
router.get("/behaviorpacks",(req,res)=>{
  res.render("behaviorpacks");
});

module.exports = router;

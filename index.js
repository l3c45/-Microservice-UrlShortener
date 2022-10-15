require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require("body-parser")
const dns = require('dns')
const mongoose=require("mongoose")
const validUrl=require("valid-url")
var  nanoid  = require("nanoid");


const mySecret = process.env['PASS']


mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

const UrlSchema = new mongoose.Schema({
  original_url:{
    type:String,
    required:true},
  short_url:{
  type:String,
  required:true,
    default:"zz99z"}
});

const Url = mongoose.model("Url", UrlSchema)

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
   res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.get("/api/shorturl/:route", function(req,res){
  let query=req.params.route
  Url.findOne({short_url:query},async function(err,found){
    console.log(found.original_url)
    await res.redirect(found.original_url)
  })

})


app.post("/api/shorturl",async function(req,res){

  if (validUrl.isWebUri(req.body.url)){
      let id =nanoid(5)
      const instance = new Url({
      original_url : req.body.url,
       short_url:id})
       await instance.save()

      res.json({
        original_url : req.body.url,
        short_url:id})

    } else {
    res.json({error	:"Invalid URL"})
    }
  
 }) 





app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

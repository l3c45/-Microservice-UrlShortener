require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const validUrl=require("valid-url")
const  nanoid = require("nanoid");
const port = process.env.PORT || 3000;


//MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());


//DATABASE 
mongoose.connect(process.env['PASS'], { useNewUrlParser: true, useUnifiedTopology: true });

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

//ROUTES
app.get('/', (req, res) => {
   res.sendFile(process.cwd() + '/views/index.html');
});

//Parametro route redirecciona a la url original
app.get("/api/shorturl/:route",  async (req,res) => {
  let query=req.params.route

  try{
   const found=await Url.findOne({short_url:query})
     res.redirect(found.original_url)
  }catch(err) {
    console.log(err);
  }

})

//Verifica si la URL es correcta , la almacena en DB asignandole un id aleatorio
app.post("/api/shorturl",async (req,res) => {

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
 
//STATIC 
app.use('/public', express.static(`${process.cwd()}/public`));

//PORT
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

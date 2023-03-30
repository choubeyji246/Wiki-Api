const express=require("express");
const bodyParser=require("body-parser");
const { default: mongoose } = require("mongoose");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const uri="mongodb+srv://ankit:kRdvKJhWd2qsQ0GE@cluster0.3sackxo.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri,{dbName:"wikiDb"},function(){
    console.log("Sucessfully connected to database");
})
const articleSchema={
    title: String,
    content: String
}
const Article=mongoose.model("article",articleSchema);

////////////////targeting all articles//////////////

app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticles){
        // console.log(foundArticles);
        res.send(foundArticles);
    })
})

.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);
const newArticle= new Article({
    title:req.body.title,
    content:req.body.content
})
newArticle.save(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Data entered sucessfully on posting request");
    }
})
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Data deleted succesfully");
        }
    })
})
////////////targeting a specific article


app.route("/articles/:articleTitle").get(function(req,res){
    Article.findOne({
        title:req.params.articleTitle
    },function(err,foundArticle){
       if(err){
        res.send(err);
       }else{
        res.send(foundArticle);
       }
    }
    )
})


.put(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })


  .patch(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })


  .delete(function(req, res){

    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000,function(){
    console.log("server starred at port 3000");
})
var express = require('express');
var router = express.Router();
var posts = require('../models/posts') ;
var user = require('../models/user') ;


/*var csrf = require('csurf') ;
var csrfProtection = csrf({ cookie: true })
router.use(csrfProtection) ;*/

var db = require('monk')("localhost/news") ;





var path  = require("path") ;
var fs = require('fs');

const fileUpload = require('express-fileupload');

router.use(fileUpload());

var url = 'mongodb://localhost:27017/news' ;
router.get('/' , function(req, res, next) {
    posts.find().limit(5).  sort({ date: -1 }).
    exec( function(err, news){
        if(err){
          console.log(err);
        } else{
            res.render('news/index',{
                "news": news});
        }
    }) ;
});

router.get('/page/:id' , function(req, res, next) {
    var page = req.params.id ;
    if(page==1){
        res.redirect("/") ;
    }
    else{
    posts.paginate({},{page:page ,  sort:{ date: -1 }, limit:5},function(err, news){
        if(err){
          console.log(err);
        } else{
            res.render('news/index',{
                "news": news.docs ,"npage":news.pages});
                console.log(news) ;
        }
    }) ;

       }
});



router.get('/user/adminpost' , isLoggedIn , function(req, res, next) {
  
    res.render('shop/post' );
 });

 router.post('/addpost' ,function(req, res, next) {
    var type = req.body.ntype ;
    var title    = req.body.title;
    var body = req.body.body;
   var file = req.files.foo ;
    var date = new Date() ;
    
    console.log(file.name) ;
    console.log(title) ;

    
    file.mv(path.join(__dirname ,"/uploads/" + file.name ), err => { 
        if (err) throw err;
        console.log("file moved succ" );
        });

        posts.create({
            "newstype": type,
            "title": title,
            "body": body ,
            "date":date ,
            "file":file.name 

          },  function(err, post){
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                res.redirect('/') ; 
                console.log("the new post is" +post) ;
            }
        });
    }); 
 


    router.get('/show/:id', function(req, res, next) {

        var posts = db.get('posts');
        posts.findOne(req.params.id, function(err, post){
            res.render('news/show',{
                "post": post , "coms":post.comments
            });
        });
    });

    router.get('/department/:id', function(req, res, next) {

        var news = req.params.id ;
        posts.find({newstype:news}).sort({ date: -1 }).exec(function(err, news){
            if(err){
              console.log(err);
            } else{
                res.render('shop/dept',{
                    "post": news});
            }
        })
    });

    router.get('/user/inf', isLoggedIn ,function(req, res, next){
    
        res.render('user/inf'  );
    });
    
      router.post('/inf/:id' , function(req, res, next){
        var patid = req.params.id ;
    
        var name = req.body.name ;
        var phone = req.body.phone ;
        var bday = req.body.bday ;
        var city = req.body.city ;
    
        var file = req.files.foo
    
    file.mv(path.join(__dirname ,"/uploads2/" + file.name ), err => { 
    if (err) throw err;
    console.log("file moved succ" );
    });
        console.log(req.files.foo);
    
            user.findByIdAndUpdate(
            patid,
            {$set: {"name": name,
            "phone": phone,
            "bday": bday,
            "city": city ,
            "ph" :file.name
            
          }}, 
            {new: true},
            function(err,user){
                if(err){
                    res.json({error :err}) ; 
                }
                console.log(user) ;
    
            });
            res.redirect('/') ;
    }) ;

    router.post('/comment/:id', isLoggedIn , function(req ,res ,next){
      var comment = req.body.com ;
      var photo = req.user.ph ;
      var name = req.user.name ;


      var date = new Date() ;

      postid = req.params.id

      var com = {text:comment, date:date , user:photo  , name:name };
      
      posts.findByIdAndUpdate(
        postid,
        {$push: {"comments":com }}, 
        {new: true},
        function(err ,doc){
            if (err){
                throw err;
            } 
                res.location('/show/'+postid) ;
                res.redirect('/show/'+postid) ;   /*  postid+"#"+comment_id */

           
        }) ;

    });



 

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
         return next() ;
    }
    res.redirect('/user/signin') ;
}
function notLoggedIn(req, res, next){
   if(!req.isAuthenticated()){
        return next() ;
   }
   res.redirect('/') ;
}
module.exports = router;

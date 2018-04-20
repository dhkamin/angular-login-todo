const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const fileUpload = require('express-fileupload');
var fs = require('fs');

const connection = (closure) =>{
    return MongoClient.connect('mongodb://localhost:27017/userDB',(err,client)=>{
      if (err) return console.log(err);
      let db = client.db('userDB');
      closure(db);
    })
  }
  router.post('/addTask',(req,res)=>{
    console.log("cmOiii bd "+req.body.id);
    connection((db)=>{
      db.collection('users').findOne({"_id":ObjectID(req.body.id) },(err,result)=>{
        console.log("cmOiii  nuulaaa  intrOuvable "+result);
        if(err||!result) {res.send({message:"Error"})}
        else{
          console.log("c mOi null"+req.body.task);
          console.log(req.body.task.list);
            db.collection('users').update(
               { "_id":ObjectID(req.body.id)},
              
                {$push : { tasks: { $each: [req.body.task] } }
               }
            );
            res.send({message:"Done"});
        }
      })
    })
  })

  // Update de la stutu done en true ou le contraire 
// vous devez passer l'id et le titre de la tache 
router.get('/:id/:title/done_status',(req,res)=>{
  connection((db)=>{
    db.collection('users').update(
      { "_id":ObjectID(req.params.id),"tasks.title": (req.params.title) },
       { $set: { "tasks.$.done" : true }}
       ,(error,resultat)=>{
           if (resultat){
             res.send({message:"mise a jour avec succes "});
           } else {
             res.send({message:"Erreur lors du mise a jour "});
           }  
        
         });
  })
})

// vous devez passer l'id et le titre de la tache 

router.get('/:id/:pos/done_status_bypos',(req,res)=>{
  connection((db)=>{
    
    let tid = { ["tasks."+req.params.pos+".done"] : true };
    
    let query = { "_id": ObjectID(req.params.id) };

    db.collection('users').update(
      { "_id":ObjectID(req.params.id)},
      { $set:    tid}
      ,(error,resultat)=>{
           if (resultat){
             res.send({message:"mise a jour avec succes "});
           } else {
             res.send({message:"Erreur lors du mise a jour "});
           }  
        
         });
  })
})

// update de toute la task 
router.post('/:id/:pos/update_task',(req,res)=>{
  connection((db)=>{
    console.log(req.params.id);
    console.log(req.params.pos);
    console.log(req.body.title);
    let tid = { ["tasks."+req.params.pos+".title"] : req.body.title };
    let tid2 = { ["tasks."+req.params.pos+".description"] : req.body.description };
    let tid3 = { ["tasks."+req.params.pos+".done"] : req.body.done };
    
    let query = { "_id": ObjectID(req.params.id) };

    db.collection('users').update(
      { "_id":ObjectID(req.params.id)},
      { $set: { ["tasks."+req.params.pos+".title"] : req.body.title,
                ["tasks."+req.params.pos+".description"] : req.body.description,
                ["tasks."+req.params.pos+".done"] : req.body.done }}
      ,(error,resultat)=>{
           if (resultat){
             res.send({message:"mise a jour avec succes "});
           } else {
             res.send({message:"Erreur lors du mise a jour "});
           }  
        
         });
  })
})
///   update  done  de l'element de la  liste  todo/task 
router.get('/:id/:postask/:postaskItem/done_item_list',(req,res)=>{
  connection((db)=>{
      console.log(req.params.id);
      console.log(req.params.postask);
      console.log(req.params.postaskItem);
      db.collection('users').update(  { "_id":ObjectID(req.params.id)},

      { $set: { ["tasks."+req.params.postask+".list."+req.params.postaskItem+".done"] : req.body.done,
           }},
           (error,resultat)=>{
            if (resultat){
              res.send({message:"mise a jour avec succes "});
            } else {
              res.send({message:"Erreur lors du mise a jour "});
            }  
         
          })
    });

  });
      


 
// vous devez passer l'id et le titre de la tache pour changer done en true
router.get('/:id/:title/done_status',(req,res)=>{
  connection((db)=>{
    db.collection('users').update(
      { "_id":ObjectID(req.params.id),"tasks.title": (req.params.title) },
       { $set: { "tasks.$.done" : true }}
       ,(error,resultat)=>{
           if (resultat){
             res.send({message:"mise a jour avec succes "});
           } else {
             res.send({message:"Erreur lors du mise a jour "});
           }  
        
         });
  })
})



// Suppression de 'Task' par son titre   
  router.get('/:id/:param/deleteTask',(req,res)=>{
    connection((db)=>{
      db.collection('users').findOne({"_id": ObjectID(req.params.id) },(err,result)=>{
        if(err||!result) {res.send({message:"Error"})}
        else{ 
            db.collection('users').update({'_id': ObjectID(req.params.id)}, 
            { $pull: { "tasks" : { param: req.params.param } } },(error,resultat)=>{
           if (resultat){
            console.log("Supression avec succes");
            res.send({message:"Supression avec succes"});
          } else {
              console.log("Echec de Supression");
              res.send({message:"Echec de Supression"});
            }  
            
            }
            );
        }
      })
    })
  })
  // Suppression de 'Task  //  image' par son titre   
  router.get('/:id/:title/:name/deleteTaskImage',(req,res)=>{
    console.log(req.params);
    connection((db)=>{
      db.collection('users').findOne({"_id": ObjectID(req.params.id) },(err,result)=>{
        if(err||!result) {res.send({message:"Error"})}
        else{ 
            db.collection('users').update({'_id': ObjectID(req.params.id)}, 
            { $pull: { "tasks" : { title: req.params.title ,url_img:"assets/uploads/"+req.params.name } } },(error,resultat)=>{
           if (resultat){
            fs.unlink("./src/assets/uploads/"+req.params.name, function() {
              res.send({message:"Supression avec succes"});
              console.log("Supression avec succes");
            });
           
          } else {
              console.log("Echec de Supression");
              res.send({message:"Echec de Supression"});
            }  
            
            }
            );
        }
      })
    })
  })



// Return Tous les tasks de l' ID 
router.get('/:id/getTasks',(req,res)=>{  
    connection((db)=>{
      db.collection('users').findOne({"_id":ObjectID(req.params.id) },(err,result)=>{
        if(err||!result) {res.send({message:"Error"})}
        else{
          const resultat = result.tasks;
          res.send(resultat);
}
      })
    })
  })
  
// Ajouter une note avec l upload d une image  
router.use(fileUpload());

router.post('/Add_img_task', function(req, res) {  
    if (!req.files)
    {return res.status(400).send('No files were uploaded.');}
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.task_pic;

  // Use the mv() method to place the file somewhere on your server
  // task_pic is the name of the 'file' input in HTML 
  const url = "assets/uploads/"+req.files.task_pic.name ;
  sampleFile.mv('./src/assets/uploads/'+req.files.task_pic.name).then(() => {
    connection((db)=>{
      db.collection('users').findOne({"_id":ObjectID(req.body.id) },(err,result)=>{
        if(err||!result) {result.send({message:"Error"})}
        else{
            db.collection('users').update(
               { "_id":ObjectID(req.body.id)},
                {$push : { tasks: { $each: [{title: req.body.title,
                   url_img: url, done: req.body.done, type : req.body.type ,
                   date: req.body.date, name: req.body.name,
                  param:req.body.param}] } }
               }
            );
        }
      })
    })
    res.send({message:'File uploaded'});
  })
  .catch((err) => {
    res.status(500).send(err);
  });

  });
  
 module.exports = router;

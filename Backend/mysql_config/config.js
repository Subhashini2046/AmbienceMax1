var multer = require('multer');
const date = require('date-and-time');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ambience_max",
    insecureAuth : true,
    multipleStatements: true
});

con.connect((err)=>{
  if(!err){
    console.log("Connect");
  }
  else{
    console.log("connection fail \n Error : " + JSON.stringify(err,undefined,2));
  }
});

module.exports = con;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5600;
const app = express();
app.use(cors());
app.use(bodyParser.json());

let mysqlConnection2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'birthdate@18',
    database: 'new_ambi',
    multipleStatements: true
})

// var DIR = './uploads/';
var DIR = 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\';

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\')
  },
  filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`)
  }
})

const upload = multer({ storage: storage })
app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files);
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
  });
})

const storagepnc = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_PNC_Docs\\')
  },
  filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`)
  }
})
const uploadpnc = multer({ storage: storagepnc })
app.post('/pncFiles', uploadpnc.array('files'), (req, res, next) => {
  const files = req.files;
  console.log(files);
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
  });
})

const storageboq = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'C:\\CommonFolderMirror\\RUMP_Req_RUMP_Supporting_Docs\\')
  },
  filename: (req, file, callBack) => {

      callBack(null, `${req.body.id}-${file.originalname}`)
  }
})
const uploadboq = multer({ storage: storageboq })
app.post('/BoqFiles', uploadboq.array('files'), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send({sttus:  'ok',
    files:files
  });
})

mysqlConnection2.connect((err) => {
  if (!err) {
      console.log('DB connection successful!');
  }
  else {
      console.log('Db Connection Failed : ' + JSON.stringify(err, undefined, 2));
  }
})

app.get('/api', function (req, res) {
  res.end('file catcher example');
});
 
app.post('/api', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end(err.toString());
    }
 
    res.end('File is uploaded');
  });
});


app.post("/resendReq",(req,res)=>{
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  sql = `update datarumprequest set RumprequestLevel = '${accessID}' where RUMPRequestPK = '${reqId}';`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.send(JSON.stringify({
        result:"passed"
      }));
    }
  })
});

app.post("/addLogApprovedReq",(req,res)=>{
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  // action_by=req.body.action_taken_by;
  reqComment = req.body.comment;
  userId = req.body.user_id;
  processingTime = req.body.processing_time;

  var sql1 = `select admName from dataadmin where admAdminPK='${userId};`

  con.query(sql1,function(err,result){

    if(err){
      console.log(err);
    }
    else{
      role_name = result[0].admName;

      sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestProcessingTime,RUMPRequestComments,RUMPRequestRoleName) values(${reqId},${accessID},"Approved",${processingTime},${reqComment},${role_name});`

      con.query(sql,function(err,result){
        if(err){
          console.log(err);
        }else{
          console.log(result);
          res.send(JSON.stringify({
            result:"passed",
           // id:res.insertId
          }));
        }
      })


    }

  });


  // sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Approved",'${action_by}',"Approved")`
  // con.query(sql,function(err,result){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log(result);
  //     res.send(JSON.stringify({
  //       result:"passed",
  //       id:res.insertId
  //     }));
  //   }
  // })
});

app.post("/addResendReqLog",(req,res)=>{
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  // action_by=req.body.action_taken_by;
  resendTo = req.body.resendto;
  reqComment = req.body.comment;
  userId = req.body.user_id;
  processingTime = req.body.processing_time;

  var sql1 = `select admName from dataadmin where admAdminPK='${userId};`

  con.query(sql1,function(err,result){

    if(err){
      console.log(err);
    }
    else{
      role_name = result[0].admName;
      
      request_action = "Resend to"+resendTo;

      sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestProcessingTime,RUMPRequestComments,RUMPRequestRoleName) values(${reqId},${accessID},${request_action},${processingTime},${reqComment},${role_name});`

      con.query(sql,function(err,result){
        if(err){
          console.log(err);
        }else{
          console.log(result);
          res.send(JSON.stringify({
            result:"passed",
           // id:res.insertId
          }));
        }
      })


    }

  });



  // sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Resent",'${action_by}',"Resent")`
  // con.query(sql,function(err,result){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log(result);
  //     res.send(JSON.stringify({
  //       result:"passed",
  //       id:res.insertId
  //     }));
  //   }
  // })

});


app.post("/addLogCompleteReq",(req,res)=>{
  accessID = req.body.access_id;
  reqId = req.body.req_id;
  // action_by=req.body.action_taken_by;
  userId = req.body.user_id;
  processingTime = req.body.processing_time;

  var sql1 = `select admName from dataadmin where admAdminPK='${userId};`

  con.query(sql1,function(err,result){

    if(err){
      console.log(err);
    }
    else{
      role_name = result[0].admName;

      sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestProcessingTime,RUMPRequestRoleName) values(${reqId},${accessID},"Completed",${processingTime},${role_name});`

      con.query(sql,function(err,result){
        if(err){
          console.log(err);
        }else{
          console.log(result);
          res.send(JSON.stringify({
            result:"passed",
           // id:res.insertId
          }));
        }
      })


    }

  });

});


app.post("/addLogNewReq",(req,res)=>{
  
  const now = new Date();
  let req_date=date.format(now, 'YYYY-MM-DD HH:mm:ss')
  sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},(SELECT  RUMPInitiatorId FROM datarumprequest WHERE RUMPRequestPK = ${req.body.req_id}),'Initiated Phase 1','${req_date}','${req.body.user_name}',1);`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{

      console.log(result);
      res.send(JSON.stringify({
        result:"passed",
        id:res.insertId,
      }));
    }
  })

  // accessID = req.body.access_id;
  // reqId = req.body.req_id;

  // userId = req.body.user_id;

  // var sql1 = `select admName from dataadmin where admAdminPK='${userId};`

  // con.query(sql1,function(err,result){

  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     role_name = result[0].admName;

  //     sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestRoleName) values(${reqId},${accessID},"Initated",${role_name});`

  //     con.query(sql,function(err,result){
  //       if(err){
  //         console.log(err);
  //       }else{
  //         console.log(result);
  //         res.send(JSON.stringify({
  //           result:"passed",
  //          // id:res.insertId
  //         }));
  //       }
  //     })


  //   }


  //aprocessingTime=moment(Date.now()).format('HH:mm:ss');;
  // sql = `insert into request_actionnnn (req_id,acc_id,areq_action,aaction_taken_by,acomment) values(${reqId},${role},"Request Initiate","Initiator","Request Initiated")`
  // con.query(sql,function(err,result){
  //   if(err){
  //     console.log(err);
  //   }else{
        
  //     console.log(result);
  //     res.send(JSON.stringify({
  //       result:"passed",
  //       id:res.insertId
  //     }));
  //   }
  // })
});

app.get('/download', (req, res) => {
  const file='C:/CommonFolderMirror/RUMP_Req_PNC_Docs/'+req.query.filename;
  console.log(req.query.filename,file);
  res.download(file);
});

// app.get('/RequestFle', (req, res) => {
//   const file='C:/CommonFolderMirror/RUMP_Req_RUMP_Supporting_Docs/'+req.query.filename;
//   console.log(req.query.filename,file);
//   res.download(file);
// });

app.post("/users", (req, res) => {
  let req_id = req.body.req_id;
  let role_id=req.body.role_id;
  let space=req.body.space;
  sql = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
  on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
  where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
        if(result.length>0){
          sql1 = `select linkRUMPAdminAccessPK as accessId,
          linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
          inner join linkrumpadminaccess 
          on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
          inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
          where rumprequestfk=${req_id} and RUMPRequestActionTiming <(select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
          on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
          where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1) 
          group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql1,function(err,result){
            if(err){
              console.log(err);
            }else{
                console.log(result);
                res.send(result);
            }
          })
        }
        else{
          sql2 = `select linkRUMPAdminAccessPK as accessId,
          linkRUMPRoleFK as roleId,pickRUMPRoleDescription from datarumprequestaction 
          inner join linkrumpadminaccess 
          on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
          inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
          where rumprequestfk=${req_id} and RUMPRequestActionTiming group by linkRUMPRoleFK,linkRUMPSpace;`
          con.query(sql2,function(err,result){
            if(err){
              console.log(err);
            }else{
                console.log(result);
                res.send(result);
            }
          })
        }
    }
  })
  
});

app.get('/api/users/:id', (req, res) => {

  let req_id = req.params.id;
    console.log(req_id);
    mysqlConnection2.query(`select distinct linkRUMPAdminAccessPK as accessId,
    pickRUMPRoleDescription as role from linkrumpadminaccess inner join datarumprequestaction
    on(datarumprequestaction.RUMPRequestRole=linkrumpadminaccess.linkRUMPAdminAccessPK)
    inner join pickrumprole on(linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK)
    where RUMPRequestFK = '${req_id}';`, (err, rows, fields) => {
      if (!err) {
          console.log("..........//");
            console.log(rows);
            res.send(rows);

        }
        else {
            console.log(err);
        }
    })
//   let req_id = req.params.id;

//  // let req_id = req.body.req_id;

//   console.log(req_id);

//   let role_user = [];

//   mysqlConnection2.query(`select distinct linkRUMPAdminAccessPK,pickRUMPRoleDescription from linkrumpadminaccess inner join datarumprequestaction on(datarumprequestaction.RUMPRequestRole=linkrumpadminaccess.linkRUMPAdminAccessPK) inner join pickrumprole on(linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK) where RUMPRequestFK = '${req_id}';`, (err, rows, fields) => {
//       if (!err) {
//         console.log("..........//");
//           console.log(rows);

//           res.send(rows);

//       }
//       else {
//           console.log(err);
//       }
//   })
});

app.get('/api/logs/:id', (req, res) => {
  let req_id = req.params.id;
  console.log(req_id);
  mysqlConnection2.query(`select * from datarumprequestaction where RUMPRequestFK=${req_id} ;`, (err, rows, fields) => {
      if (!err) {
        console.log("..........//");
          console.log(rows);
          res.send(rows);

      }
      else {
          console.log(err);
      }
  })
});

app.listen(port, () => {
  console.log(`Server Started at Port number ${port}`);
});

const date = require('date-and-time');

let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/approve",(req,res)=>{

    role = req.body.userRole;
    reqId = req.body.req_id;
    console.log('role....', role);
    console.log('reqId......', reqId);
    sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
  });

    // role = req.body.userRole;
    // reqId = req.body.req_id;
    // sql = `update requests set req_level = '${role}' where req_id = '${reqId}';`
    // con.query(sql,function(err,result){
    //   if(err){
    //     console.log(err);
    //   }else{
    //     console.log(result);
    //   }
    // })
  });


  router.post("/approveRequest", (req, res) => {
    let accessID=req.body.accessID;
  var sql = `select linkrumprequestflowpk as wid,w_flow as wflow,datarumprequest.RumprequestLevel as requestLevel,
  datarumprequest.RUMPInitiatorId as initiatorId from linkrumprequestflow inner join datarumprequest 
  on datarumprequest.RUMPRequestFlowFK=linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK=${req.body.req_id};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let wflowdata = result[0].wflow.split(',');
      let requestLevel = result[0].requestLevel;
      let initiatorId = result[0].initiatorId;
      let nextValue = '';
      let meType = req.body.meType;

      if (requestLevel != 3) {
        for (let i = 0; i < wflowdata.length; i++) {
          if (requestLevel == wflowdata[i]) {
            nextValue = wflowdata[i + 1];
            if (meType.toString().trim() === "Civil") {
              if (nextValue.includes('c')) {
                nextValue = wflowdata.filter(data => data.includes('c')).map(data => {
                  return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
                })
              }
              else { nextValue = nextValue; }
            }
            else if (meType.toString().trim() === "Electrical") {
              if (nextValue.includes('e')) {
                nextValue = wflowdata.filter(data => data.includes('e')).map(data => {
                  return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))
                })
              }
              else { nextValue = nextValue; }
            }
          }
        }
      } else {
        nextValue = initiatorId;
      }
      sql = `update datarumprequest set RUMPRequestStatus=if(RumprequestLevel=3,'Closed','Pending'),RUMPRequestUnreadStatus=1,
             RumprequestLevel=${nextValue},RUMPRequestApprovalLevel=${accessID} where rumprequestpk=${req.body.req_id};`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          //res.send(result);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Approved','${actionTime}','${req.body.reqComment}','${req.body.role_name}',1);`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(JSON.stringify({
                result: "passed",
              }));
            }
          })
        }
      })
    }
  });
  });


  router.post("/addCompeteRequest", (req, res) => {
    
    sql = `update datarumprequest set RUMPRequestUnreadStatus=1,RUMPRequestStatus='Completed' where RUMPRequestPK = '${req.body.req_id}';`
    
    con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      const now = new Date();
      let actionTime=date.format(now, 'YYYY-MM-DD HH:mm:ss')
      sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'Completed','${actionTime}','Completed','${req.body.role_name}',1);`

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
    }
  })
});

router.post("/resendRequest", (req, res) => {
  let resendToId=req.body.resendToId;
  let accessID=req.body.accessID;
  let w_flow = [];
  let wflowdata = [];
  let wflowdata1 = [];
  let addIntoApprovalLevel=0;
  sql=`Select w_flow,RUMPRequestMEType,RUMPInitiatorId,RUMPRequestApprovalLevel from datarumprequest inner join linkrumprequestflow on (datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk) where RUMPRequestPK =${req.body.req_id};`
  con.query(sql,function(err,result){
    if(err){console.log(err);}
    else{
      w_flow = result[0].w_flow.split(',');
      let intiator_id = result[0].RUMPInitiatorId;
        let me_type = result[0].RUMPRequestMEType;
        let ApprovalLevel=result[0].RUMPRequestApprovalLevel; 
        for (let i = 0; i < w_flow.length; i++) {
  
          if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
            wflowdata.push(w_flow[i]);
          }
  
          else if (me_type == 0 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(0, w_flow[i].indexOf('or') + 'or'.length);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (me_type == 1 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r') + 1);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (w_flow[i].includes('i')) {
            wflowdata.push(intiator_id);
          }

        }
      let accessIDIndex=wflowdata.indexOf(accessID.toString());
      let ApprovalLevelIndex = wflowdata.indexOf(ApprovalLevel.toString())
      console.log("ra",accessID,ApprovalLevel);
      console.log(wflowdata,accessIDIndex,ApprovalLevelIndex)
      if(accessIDIndex==intiator_id){
        addIntoApprovalLevel=ApprovalLevel
      }else{
      if(accessIDIndex>=ApprovalLevelIndex){
        addIntoApprovalLevel=accessID;
      }
      else{addIntoApprovalLevel=ApprovalLevel}}
  var sql = `select pickrumprole.pickRUMPRoleDescription as role from pickrumprole inner join linkrumpadminaccess 
  on pickRUMPRolePK=linkRUMPRoleFK where linkRUMPAdminAccessPK=${req.body.resendToId};`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ result: "failed1" }));
    } else {
      let role = result[0].role;
      let request_action = "Resent to " + role;
      sql = `update datarumprequest set RUMPRequestUnreadStatus=1,ispnc=${req.body.pnc},RumprequestLevel=${req.body.resendToId},RUMPRequestApprovalLevel=${addIntoApprovalLevel}
  where rumprequestpk=${req.body.req_id};`
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          // res.send(result);
          const now = new Date();
          let actionTime = date.format(now, 'YYYY-MM-DD HH:mm:ss')
          sql = `insert into datarumprequestaction (RUMPRequestFK,RUMPRequestRole,RUMPRequestAction,RUMPRequestActionTiming,RUMPRequestComments,RUMPRequestRoleName,RUMPRequestStage) values(${req.body.req_id},${req.body.accessID},'${request_action}','${actionTime}','${req.body.reqComment}','${req.body.role_name}',1);`
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(JSON.stringify({
                result:"passed"
              }));
            }
          })
        }
      })
        }
      })
    }
  });
});

router.post("/getSpocs", (req, res) => {
  reqId = req.body.req_id;
  sql = `select (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc1FK) as venSpoc1,
  (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc2FK) as venSpoc2,
  (select rumpspoName from datarumpvendorspoc where rumpspoVendorSpocPK=rumpvenSpoc3FK) as venSpoc3,
  rumpvenVendorPK,rumpvenName as venName from datarumpvendor where rumpvenVendorPK in(
  select  RUMPRequestTaggedVendor1 as v1 from datarumprequest
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor1 is not null
  union 
  select  RUMPRequestTaggedVendor2 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor2 is not null
  union
  select  RUMPRequestTaggedVendor3 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor3 is not null
  union
  select  RUMPRequestTaggedVendor4 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor4 is not null
  union
  select  RUMPRequestTaggedVendor5 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor5 is not null
  union
  select  RUMPRequestTaggedVendor6 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor6 is not null
  union
  select  RUMPRequestTaggedVendor7 as v1 from datarumprequest 
  where RUMPRequestPK=${reqId} and RUMPRequestTaggedVendor7 is not null);`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })
});

router.post("/getComment", (req, res) => {
  reqId = req.body.req_id;
  sql = `select RUMPRequestComments from datarumprequestaction where RUMPRequestFK=${reqId} order by RUMPRequestActionTiming desc limit 1;`
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  })
})


  router.post("/workflow",(req,res)=>{
    reqId = req.body.req_id;
    console.log(reqId);
    sql = `Select w_flow from requests inner join workflow on requests.w_id = workflow.w_id where req_id = '${reqId}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(result);
      }
    })
  });


  router.post("/users1", (req, res) => {
    console.log("hhhhhhhhh")
    let req_id = req.body.req_id;
    let w_flow = [];
    let wflowdata = [];
    let wflowdata1 = []
    let intiator_id = '';
    let accessId = req.body.accessId;
    let ApprovalLevel = 0;
    let role_id = req.body.role_id;
    let space = req.body.space;
    sql = `Select w_flow,RUMPRequestMEType,RUMPRequestApprovalLevel,RUMPInitiatorId from datarumprequest inner join linkrumprequestflow on (datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk) where RUMPRequestPK =?;`
    con.query(sql, req_id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        ApprovalLevel = result[0].RUMPRequestApprovalLevel;
        intiator_id = result[0].RUMPInitiatorId;
        let me_type = result[0].RUMPRequestMEType;
        w_flow = result[0].w_flow.split(',');
        for (let i = 0; i < w_flow.length; i++) {
  
          if (typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)) {
            wflowdata.push(w_flow[i]);
          }
  
          else if (me_type == 0 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(0, w_flow[i].indexOf('or') + 'or'.length);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (me_type == 1 && w_flow[i].includes('or')) {
  
            w_flow[i] = w_flow[i].replace("c", "");
            w_flow[i] = w_flow[i].replace('e', '');
            w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r') + 1);
            w_flow[i] = w_flow[i].replace('or', '');
            console.log(w_flow[i]);
            wflowdata.push(w_flow[i]);
  
          }
          else if (w_flow[i].includes('i')) {
            wflowdata.push(intiator_id);
          }
  
        }
        let ApprovalLevelIndex = wflowdata.indexOf(ApprovalLevel.toString())
        for (let i = 0; i <= ApprovalLevelIndex; i++) {
          wflowdata1.push(wflowdata[i]);
        }
        if (!wflowdata1.includes(intiator_id.toString())) {
          wflowdata1.push(intiator_id.toString())
        }
        console.log(wflowdata1, 'w');
        sql = `select RUMPRequestActionTiming from datarumprequestaction inner join linkrumpadminaccess 
        on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
        where rumprequestfk=${req_id} and linkRUMProleFK=${role_id} and linkRUMPSpace=${space} limit 1;`
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.length > 0) {
              sql = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?) and RUMPRequestRole!=(select RUMPRequestRole from datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              where rumprequestfk=? and linkRUMProleFK=? and linkRUMPSpace=? limit 1);`
              con.query(sql, [req_id, wflowdata1, req_id, role_id, space], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
  
                  console.log(result,"iiiiiiii");
                  res.send(result);
                }
              })
            }
            else {
              sql = `select distinct linkRUMPAdminAccessPK as accessId,linkRUMPRoleFK as roleId,pickRUMPRoleDescription 
              from datarumprequestaction datarumprequestaction inner join linkrumpadminaccess 
              on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole)
              inner join pickrumprole on(pickrumprole.pickRUMPRolePK=linkrumpadminaccess.linkrumprolefk)
              where RUMPRequestFK=? and RUMPRequestRole in(?);`
              con.query(sql, [req_id, wflowdata1, req_id, role_id, space], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  let res1=[]
                  res1=result;
                  console.log(res1,"iiiiijjjj");
                  res.send(JSON.stringify(result));
                }
              })
            }
          }
        })
      }
    })
  })

  module.exports = router;

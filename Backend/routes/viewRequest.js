const { promise } = require("protractor");

let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  router.post("/viewRequestData",(req,res) =>{
    console.log("+++++++++++++");
    data = req.body;
    req_id=data.reqId;
    console.log(req_id);
    sql1 = `select * from datarumprequest where RUMPRequestPK='${req_id}';`
      con.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    req_data= result
    console.log('-----',req_data);
    req_level=result[0].RumprequestLevel;
      console.log('-----',req_level);
      sql = `select pickRUMPRoleDescription from linkrumpadminaccess inner join pickrumprole on linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK where linkRUMPAdminAccessPK = '${req_level}';`
    con.query(sql,function(err,result){
      if(err){
        console.log(err);
      }else{
        console.log(result);
        role_name=result;
        res.send(
            JSON.stringify({
              req_data: req_data,
              role_name:role_name
            })
          );
      }
    })
    }
  })
});


router.get("/getRole",(req,res)=>{
  reqId = req.body.req_id;
  sql = `Select pickRUMPRoleDescription from pickrumprole order by pickRUMPRolePK;`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.send(JSON.stringify({
        result:"passed",
        role_name:result
    }));
    }
  })
})

router.post("/viewStatus",(req,res)=>{
  reqId = req.body.req_id;
  console.log(reqId);
  let wflowdata=[];
  let me_type = null;
  let intiator_id = '';
  w_flow=[];
  role=[];
  role1=[];
  sql = `select RUMPRequestRoleName as RequestRoleName,RUMPRequestAction as RequestAction,RUMPRequestActionTiming as RequestActionDate,time(RUMPRequestActionTiming) RequestActionTiming, pickrumprole.pickRUMPRoleDescription as roleDescription from datarumprequestaction inner join linkrumpadminaccess ON datarumprequestaction.RUMPRequestRole = linkrumpadminaccess.linkRUMPAdminAccessPK inner join pickrumprole ON pickrumprole.pickRUMPRolePK = linkrumpadminaccess.linkRUMPRoleFK where RUMPRequestFK= ${reqId};`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      reqLog=result;
      
  sql = `Select ispnc,RUMPRequestStatus,RumprequestLevel,RUMPInitiatorId,w_flow,RUMPRequestMEType from datarumprequest inner join linkrumprequestflow on datarumprequest.RUMPRequestFlowFK = linkrumprequestflow.linkrumprequestflowpk where RUMPRequestPK = ${reqId};`
  con.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      w_flow=result[0].w_flow.split(',');
      me_type = result[0].RUMPRequestMEType;
      requestLevel=result[0].RumprequestLevel;
      reqStatus=result[0].RUMPRequestStatus;
      console.log("dd",requestLevel);
      intiator_id = result[0].RUMPInitiatorId;
      ispnc=result[0].ispnc;
      console.log("............");
      console.log("wflow",w_flow);

      for (let i = 0; i < w_flow.length; i++) {

        if(typeof w_flow[i] === 'string' && (w_flow[i].includes('or') == false && w_flow[i].includes('i') == false)){
          wflowdata.push(w_flow[i]);
        }
       
        else if(me_type == 0 && w_flow[i].includes('or')){

        w_flow[i] = w_flow[i].replace("c","");
        w_flow[i] = w_flow[i].replace('e','');
        w_flow[i] = w_flow[i].substring(0,w_flow[i].indexOf('or')+'or'.length);
        w_flow[i] = w_flow[i].replace('or','');
        console.log(w_flow[i]);
        wflowdata.push(w_flow[i]);

        }
        else if(me_type == 1 && w_flow[i].includes('or')){

          w_flow[i] = w_flow[i].replace("c","");
          w_flow[i] = w_flow[i].replace('e','');
          w_flow[i] = w_flow[i].substring(w_flow[i].indexOf('r')+1);
          w_flow[i] = w_flow[i].replace('or','');
          console.log(w_flow[i]);
          wflowdata.push(w_flow[i]);
      
        }
        else if(w_flow[i].includes('i')){
          wflowdata.push(intiator_id);
        }

      }


      const loop = new Promise((resolve,reject) => {  wflowdata.forEach((element,i) => {

        tval = element;

        sql1= `select pickRUMPRoleDescription from linkrumpadminaccess inner join pickrumprole on linkrumpadminaccess.linkRUMPRoleFK = pickrumprole.pickRUMPRolePK where linkRUMPAdminAccessPK = ${tval};`

        let fetch = new Promise((resolve,reject)=>{

          con.query(sql1,function(err,result){
            if(err){
              console.log(err);         
            }
            else{
    
              role1.push(result);
              resolve();
            }
          })

        })

        fetch.then(()=>{
          if(i === wflowdata.length -1){
            resolve();
          }
        })

        })
      })

      loop.then(()=>{
        res.send(
          JSON.stringify({
              result:"passed",
              w_flow:wflowdata,
              role:role1,
              requestLevel:requestLevel,
              intiator_id:intiator_id,
              reqStatus:reqStatus,
              reqLog:reqLog,
              ispnc:ispnc
          })
         );
      })
    
      
      }
  })
}
});
});


router.post("/requestDetails", (req, res) => {
  sql1 = `select * from datarumprequest where RUMPRequestPK=${req.body.reqId};`
  con.query(sql1, (err, result) => {
      if (err) {
          console.log(err);}
      else {
          res.send(JSON.stringify(result));
      }
  });
});

router.post("/pdfTableData", (req, res) => {
  let req_id = req.body.req_id;
  let tableData=[];
  let tableData1=[];
  let tableData2=[]
   sql1 = `select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
   RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
   (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
   (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId from datarumprequestaction
   inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
 (RUMPRequestAction='Initiated Phase 1' or RUMPRequestAction='Approved' or RUMPRequestAction='Submitted' or RUMPRequestAction='Approved (Closed)') group by RUMPRequestRole order by RUMPRequestActionTiming desc;`
   con.query(sql1,req_id, (err, result) => {
     if (err) {
       console.log(err);
     }
     else {
       result.forEach(element=>{
         tableData.push(element);
       })
   console.log(tableData);
       for(let i=tableData.length-1;i>=0;i-- ){
         if(tableData[i]!=null){
         tableData1.push(tableData[i]);}
       }
       let HeadOfMaintenanceIndex=0;
       for(let i=0;i<tableData1.length-1;i++){
         if(tableData1[i].role1.includes('Head of Maintenance'))
         {HeadOfMaintenanceIndex=i}
       }
       sql=`select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
       RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
       (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
       (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId   from datarumprequestaction
       inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
     (RUMPRequestAction='Initiated Phase 2') order by RUMPRequestActionTiming desc limit 1;`
     con.query(sql,req_id, (err, result) => {
       if (err) {
         console.log(err);
       }
       else {
         for(let i=0;i<=HeadOfMaintenanceIndex;i++){
          if(tableData1[i]!=null){
         tableData2.push(tableData1[i])}
         } 
         tableData2.push(result[0]);
         for(let i=HeadOfMaintenanceIndex+1;i<tableData1.length;i++){
          if(tableData1[i]!=null){
           tableData2.push(tableData1[i]);}
         } 
     sql=`select  RUMPRequestRoleName user, RUMPRequestRole as role, RUMPRequestAction as action ,
     RUMPRequestActionTiming as actionTiming,RUMPRequestComments as comment,
     (select pickRUMPRoleDescription from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as role1,
     (select pickRUMPRolePK from pickrumprole where pickRUMPRolePK=linkrumpadminaccess.linkRUMPRoleFK) as roleId   from datarumprequestaction
     inner join linkrumpadminaccess on(linkrumpadminaccess.linkRUMPAdminAccessPK=datarumprequestaction.RUMPRequestRole) where RUMPRequestFK=?  and 
   RUMPRequestAction='Completed';`
   con.query(sql,req_id, (err, result) => {
     if (err) {
       console.log(err);
     }
     else {if(result>0){
      tableData2.push(result[0]);}
     res.send(tableData2);
     }
   })
 }
     })
 }
   })
 });

module.exports = router;
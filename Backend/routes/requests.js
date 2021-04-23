let express = require("express"),
  async = require("async"),
  router = express.Router(),
  con = require("../mysql_config/config");

  // user_id = 2;
  // role_id = 2;
  // w_id = 1;

//   router.post("/all_reqs",(req,res)=>{

//     data = req.body;
//   //   console.log(data);
//   //         var sql2 = `select role_id from access where user_id = '${user_id}';`
//   //         con.query(sql2, function (err, result) {
//   //           if (err) {
//   //             console.log(err);
//   //           } else {
//   //             role_id = result[0].role_id;
//   //             console.log(result);
              
//   //               sql3 = `Select h_id from access where user_id = '${user_id}' and role_id = '${role_id}';`
//   //               con.query(sql3,function(err , result){
//   //                 if(err){
//   //                   console.log(err);
//   //                 }else{
//   //                   h_id = result[0].h_id;
//   //                   len = h_id.length;
//   //                   console.log('length of h_id is ' + len);
//   //                   console.log(result);
//   //                   // h_id is substr of b_id ---> w_id (Link table)
//   //                   sql4 = `Select * from link inner join access on link.b_id = access.h_id where '${h_id}' = substr(b_id,1,'${len}');`
//   //                   con.query(sql4,function(err,result){
//   //                     if(err){
//   //                       console.log(err);
//   //                     }else{
//   //                       if(result.length > 0){
//   //                         let w_id;
//   //                         reqData = [];
//   //                         const loop = new Promise((resolve,reject) =>{  result.forEach((element,index) => {
//   //                               w_id = element.work_id;
//   //                               console.log(w_id);
//   //                               sql5 = `Select * from requests where w_id = '${w_id}' order by req_id desc;select count(*) as "closed" from requests where w_id = '${w_id}' and req_status = 'closed'`;
//   //                               let fetch = new Promise((resolve,reject)=>{
//   //                               con.query(sql5,function(err,result){
//   //                                 if(err){
//   //                                   console.log(err);
//   //                                 }else{
//   //                                   reqData.push(...result[0]);
//   //                                   resolve();
//   //                                 }
  
//   //                               })
//   //                             })
//   //                             fetch.then(()=>{
//   //                               // console.log(reqData);
//   //                               if(index === result.length -1){
//   //                                 resolve();
//   //                               }
//   //                             })
  
//   //                         })
  
//   //                       })
//   //                       loop.then(()=>{
                          
//   //                         res.send(
//   //                           JSON.stringify({
//   //                             result: "passed",
                            
//   //                             req_data: reqData,
//   //                             role_id : role_id,
                              
//   //                             h_id: h_id
//   //                           })
//   //                         );
//   //                       })
//   //                       }
//   //                     }
//   //                   })
//   //                 }
//   //               })
              
//   //           }
//   //         })

//   user_id = data.user_id;
//   console.log(data);
//   sql1 = `select * from datarumprequest inner join linkrumprequestflow on(linkrumprequestflow.w_id=datarumprequest.RUMPRequestFlowFK) where (w_flow like '%${accessId},%' or w_flow like '%${accessId}c%' or w_flow like '%${accessId}e%' or RUMPInitiatorId='${accessId}') and  RumprequestLevel<>'${accessId}' order by RUMPRequestPK desc;`
// con.query(sql1, (err, result) => {

//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(result);
//     res.send(
//       JSON.stringify({
//         result: "passed",
//         req_data: result
//       })
//     );
//   }
// })
      

//   });


  router.post("/pending_reqs",(req,res)=>{

    if (req.body.role == 0) {
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest
      inner join linkrumpadminaccess as t1 on RUMPInitiatorId=t1.linkRUMPAdminAccessPK inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where t1.linkRUMPRoleFK=0 and t1.linkRUMPSpace=? and RUMPRequestStatus='Pending' and (t1.linkrumpspace!=t2.linkRUMPSpace or t1.linkRUMPRoleFK != t2.linkRUMPRoleFK) order by RUMPRequestdate desc;`, [req.body.space], (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result))
      })
    } else if (req.body.role == 3 || req.body.role == 4) {
      let myrole = req.body.role;
      let narr = [];
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=?  and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result[0].length; i++) {
          let wflowdata = result[0][i].wflow.split(',');
          if (myrole == 3) {
            wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
              return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
            })
          }
          else if (myrole == 4) {
            wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
              return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
            })
          }
          for (let j = 0; j < wflowdata.length; j++) {
            for (k = 0; k < result[1].length; k++) {
              if (result[1][k].id == wflowdata[j]) {
                narr.push(result[0][i].wid);
                break;
              }
            }
          }
        }
        let metype=1;
        if(myrole==3){
          metype=0;
        }
        con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
        RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Pending' and (t2.linkRUMPSpace != ? or t2.linkrumprolefk != ?) order by RUMPRequestdate desc`,
          [metype,[...narr],req.body.space,req.body.role], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result))
          }
        )
      })
    } else {
      let narr = [];
      con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result[0].length; i++) {
          let wflowdata = result[0][i].wflow.split(',');
          wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
          console.log(wflowdata);
          for (let j = 0; j < wflowdata.length; j++) {
            for (k = 0; k < result[1].length; k++) {
              if (result[1][k].id == wflowdata[j]) {
                narr.push(result[0][i].wid);
                break;
              }
            }
          }
        }
        con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
        RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess as t2 on RumprequestLevel=t2.linkRUMPAdminAccessPK where rumprequestflowfk in(?) and RUMPRequestStatus='Pending' and (t2.linkRUMPSpace != ? or t2.linkrumprolefk != ?) order by RUMPRequestdate desc`,
          [narr,req.body.space,req.body.role], (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify(result))
          }
        )
      })
    }

});


router.post("/closed_reqs",(req,res)=>{

  if (req.body.role == 0) {
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,ispnc,RUMPRequestStatus
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
    inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
    where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Closed' order by rumprequestpk desc `, req.body.space, (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (myrole == 3) {
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
            return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
          })
        }
        else if (myrole == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
            return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype=1;
      if(myrole==3){
        metype=0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Closed' order by rumprequestpk desc  `,
        [metype,narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  } else {
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        console.log(wflowdata);
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Closed' order by rumprequestpk desc`,
        [narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }

});



router.post("/open_reqs",(req,res)=>{

  if (req.body.role == 0) {
    console.log("ddddd", req.body.role)
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest
      inner join linkrumpadminaccess on rumprequestlevel=linkRUMPAdminAccessPK
      where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Pending' order by RUMPRequestdate desc`, [req.body.space, req.body.access_id], (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    console.log("----", req.body.access_id)
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;

      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (myrole == 3) {
          console.log("bbb", wflowdata)
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
            return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
          })
        }
        else if (myrole == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
            return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype = 1;
      if (myrole == 3) {
        metype = 0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
        where rumprequestmetype=? and rumprequestflowfk in(?) and linkrumprolefk=? and linkRUMPSpace=? order by RUMPRequestdate desc`,
        [metype, narr, myrole, req.body.space], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  } else {
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
      select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        console.log("dddddd", result[1]);
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        console.log(wflowdata);
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus,ispnc from datarumprequest inner join linkrumpadminaccess on linkrumpadminaccesspk=rumprequestlevel
        where rumprequestflowfk in(?) and linkrumprolefk=? and linkRUMPSpace=? order by RUMPRequestdate desc;`,
        [narr, req.body.role, req.body.space], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }
});



router.post("/complete_reqs",(req,res)=>{

  if (req.body.role == 0) {
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
    inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
    where linkrumprolefk=0 and linkRUMPSpace=? and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`, req.body.space, (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (myrole == 3) {
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
            return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
          })
        }
        else if (myrole == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
            return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype=1;
      if(myrole==3){
        metype=0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
       from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`,
        [metype,narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  } else {
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        console.log(wflowdata);
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus
       from datarumprequest where rumprequestflowfk in(?) and RUMPRequestStatus='Completed' order by RUMPRequestDate desc`,
        [narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }

});



router.post("/check_asRead",(req,res)=>{
 // accessID = req.body.access_id;
  reqId = req.body.req_id;
  sql = `update datarumprequest set RUMPRequestUnreadStatus = 0 where RUMPRequestPK = '${reqId}';`
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



router.post("/check_asUnRead",(req,res)=>{
 // accessID = req.body.access_id;
  reqId = req.body.req_id;
  sql = `update datarumprequest set RUMPRequestUnreadStatus = 1 where RUMPRequestPK = '${reqId}';`
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




router.post('/all_request', (req, res) => {
  if (req.body.role == 0) {
    con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
    RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest
    inner join linkrumpadminaccess on RUMPInitiatorId=linkRUMPAdminAccessPK
    where linkrumprolefk=0 and linkRUMPSpace=? order by RUMPRequestdate desc`, req.body.space, (err, result) => {
      if (err) throw err;
      res.end(JSON.stringify(result))
    })
  } else if (req.body.role == 3 || req.body.role == 4) {
    let myrole = req.body.role;
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        if (myrole == 3) {
          wflowdata = wflowdata.filter(data => data.includes('c')).map(data => {
            return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
          })
        }
        else if (myrole == 4) {
          wflowdata = wflowdata.filter(data => data.includes('e')).map(data => {
            return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
          })
        }
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      let metype=1;
      if(myrole==3){
        metype=0;
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestmetype=? and rumprequestflowfk in(?) order by RUMPRequestdate desc `,
        [metype,narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  } else {
    let narr = [];
    con.query(`select linkrumprequestflowpk as wid,w_flow as wflow from linkrumprequestflow;
    select linkrumpadminaccesspk as id from linkrumpadminaccess where linkrumprolefk=? and linkrumpspace=? ;`, [req.body.role, req.body.space], (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result[0].length; i++) {
        let wflowdata = result[0][i].wflow.split(',');
        wflowdata = wflowdata.filter(data => !data.includes('or') && !data.includes('i'));
        console.log(wflowdata);
        for (let j = 0; j < wflowdata.length; j++) {
          for (k = 0; k < result[1].length; k++) {
            if (result[1][k].id == wflowdata[j]) {
              narr.push(result[0][i].wid);
              break;
            }
          }
        }
      }
      con.query(`select RUMPRequestNumber,RUMPRequestPK,RUMPRequestSubject,RUMPRequestType,RUMPRequestDate,
      RUMPRequestStatus,(RUMPRequestUnreadStatus+0) as UnreadStatus from datarumprequest where rumprequestflowfk in(?) order by RUMPRequestdate desc`,
        [narr], (err, result) => {
          if (err) throw err;
          res.end(JSON.stringify(result))
        }
      )
    })
  }
});


  module.exports = router;
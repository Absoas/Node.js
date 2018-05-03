var express = require('express');         //Expess프레임 워크를 통해 Server 생성하기 위해 express module 가져오기 
var bodyParser = require("body-parser");  // json type을 body-parser로 묶는 용도
var oracledb = require('oracledb');       //Oracle db module 가져오기
var async = require('async');             //함수 정리.
var dbConfig = require('./dbconfig.js');
var app = express(); 
var fs = require('fs'); 
var setDb = require('./setDb.js');
var hostname = '192.168.0.3'; //192.168.255.110 , 203.249.114.88 ,192.168.0.4
var port = 4000;                  // port 4000 지정  

app.use(bodyParser.urlencoded({ extended: false }));  // extended:true를 해줘야 한다 .왜냐하면 url인코딩이 계속 적용될지 1번만 적용할지 묻는 것이기 때문
app.use(bodyParser.json());   



	app.get('/users', function(req, res){                      
		 oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
			      user          : dbConfig.user,               // user
			      password      : dbConfig.password,           // password
			      connectString: dbConfig.connectString
			}, function(err, connection) {  
			     if (err) {                                   //err이벤트 발생시
			          console.error(err.message);             //err.message를 console창에 출력
			          return;  
			     }
			     oracledb.outFormat = oracledb.OBJECT;
			     connection.execute(
			     		  'SELECT TEMP, BPM FROM sensor',
			     		  
			     		  function(err, result)
			     		  {
			     		    if (err) { console.error(err.message); return; }
			     		   // var jsonSensor = JSON.stringify(result.rows);
			     		    res.json(result.rows);
			     		    console.log(result.rows);
			     });     
			});
		});	
	
	app.get('/infusionSelect', function(req, res){                      
		 oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
			      user          : dbConfig.user,               // user
			      password      : dbConfig.password,           // password
			      connectString: dbConfig.connectString
			}, function(err, connection) {  
			     if (err) {                                   //err이벤트 발생시
			          console.error(err.message);             //err.message를 console창에 출력
			          return;  
			     }
			     oracledb.outFormat = oracledb.OBJECT;
			     connection.execute(
			     		  'select infusion.id,infusion.infusion_name,infusion.infusion_total_amount,infusion.disease from infusion',
			     		  
			     		  function(err, result)
			     		  {
			     		    if (err) { console.error(err.message); return; }
			     		   // var jsonSensor = JSON.stringify(result.rows);
			     		    res.json(result.rows);
			     		    console.log(result.rows);
			     		//    console.log(result.rows[0].ID);  // result.rows[0]번째 줄의 ID를 로그창에 띄움
			     });     
			});
		});


app.get('/JoinSelect', function(req, res){                      
	 oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
		      user          : dbConfig.user,               // user
		      password      : dbConfig.password,           // password
		      connectString: dbConfig.connectString
		}, function(err, connection) {  
		     if (err) {                                   //err이벤트 발생시
		          console.error(err.message);             //err.message를 console창에 출력
		          return;  
		     }
		     oracledb.outFormat = oracledb.OBJECT;
		     connection.execute(
		     		  'select patientinfo.NAME,patientinfo.AGE,medical_record.* from patientinfo, medical_record where patientinfo.id = medical_record.id',
		     		  
		     		  function(err, result)
		     		  {
		     		    if (err) { console.error(err.message); return; }
		     		   // var jsonSensor = JSON.stringify(result.rows);
		     		    res.json(result.rows);
		     		    console.log(result.rows);
		     });     
		});
	});

app.post('/delete', function (req, res) {
	var post=req.body;
  	res.send("회원정보가 등록되었습니다.");
  	var id = post.id;
  	
  	oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
	      user          : dbConfig.user,               // user
	      password      : dbConfig.password,           // password
	      connectString: dbConfig.connectString
	}, function(err, connection) {  
	     if (err) {                                   //err이벤트 발생시
	          console.error(err.message);             //err.message를 console창에 출력
	          return;  
	     }
	     
	     console.log(id);
	     connection.execute("DELETE from PatientInfo where id = :id ", //execute를 통해 sql문 출력 가능하게끔 함 
	    		 {
	    	 	  id : id,
	    		 },
	    		 { autoCommit: true },                              //autoCommit을 통해 Commit 자동화 
	    		 
	     function(err, result) {  									
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	        	  console.log("patient_info delete");
	          }
	     }); 	     
	     
	     connection.execute("DELETE from Medical_record where id = :id ", //execute를 통해 sql문 출력 가능하게끔 함 
	    		 {
	    	 	  id : id,
	    		 },
	    		 { autoCommit: true },                              //autoCommit을 통해 Commit 자동화 
	    		 
	     function(err, result) {  									
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	        	  console.log("Medical_record delete");
	          }
	     }); 	     
	});
 res.end("yes");
});

app.post('/register', function (req, res) {
	var post=req.body;
  	res.send("회원정보가 등록되었습니다.");
  	var id = post.id;
  	var name = post.name;
  	var age = post.age;
  	var telephone = post.telephone;
  	var protector_name = post.Protector_Name;
  	var protector_phone = post.Protector_Phone;
  	
  	oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
	      user          : dbConfig.user,               // user
	      password      : dbConfig.password,           // password
	      connectString: dbConfig.connectString
	}, function(err, connection) {  
	     if (err) {                                   //err이벤트 발생시
	          console.error(err.message);             //err.message를 console창에 출력
	          return;  
	     }
	     
	     console.log(name,"+",age,"+",telephone,"+",protector_name,"+",protector_phone);
	     connection.execute("INSERT INTO patientInfo VALUES(:id,:NAME,:AGE,:TELEPHONE,:PROTECTOR_NAME,:PROTECTOR_PHONE)", //execute를 통해 sql문 출력 가능하게끔 함 
	    		 {
	    	 	  id : id,
	    	      NAME : name ,
	    	 	  AGE : age , 
	    	 	  TELEPHONE : telephone , 
	    	 	  PROTECTOR_NAME : protector_name , 
	    	 	  PROTECTOR_PHONE : protector_phone , 
	    		 },
	    		 { autoCommit: true },                              //autoCommit을 통해 Commit 자동화 
	    		 
	     function(err, result) {  									
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	        	  console.log("DB success");
	          }
	     }); 	     
	});
 res.end("yes");
});

app.post('/infoDetail', function (req, res) { // 추가 사항 입력 코드
	var post=req.body;
  	res.send("추가 사항이 입력되었습니다.");
  	var id = post.id;
  	var temp = post.temp;
  	var bpm = post.bpm;
  	var respiration = post.respiration;
  	var blood_pressure = post.blood_pressure;
  	var theOther = post.theOther;
  	var Patient_Room = post.Patient_Room;
  	
    console.log(id,"+",temp,"+",bpm,"+",blood_pressure,"+",respiration,"+",theOther,"+",Patient_Room);
    
  	oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
	      user          : dbConfig.user,               // user
	      password      : dbConfig.password,           // password
	      connectString: dbConfig.connectString
	}, function(err, connection) {  
	     if (err) {                                   //err이벤트 발생시
	          console.error(err.message);             //err.message를 console창에 출력
	          return;  
	     }
	     
	     connection.execute("INSERT INTO MEDICAL_RECORD VALUES(:ID, :PATIENT_ROOM, :BPM, :BODY_TEMP, :RESPIRATION, :BLOOD_PRESSURE, :THE_OTHERS)", //execute를 통해 sql문 출력 가능하게끔 함 
	    		 {
	    	      ID : id,
	    	  	  BODY_TEMP : temp ,
	    	  	  BPM : bpm , 
	    	  	  BLOOD_PRESSURE : blood_pressure , 
	    	 	  RESPIRATION : respiration , 
	    	 	  THE_OTHERS : theOther , 
	    	 	  PATIENT_ROOM: Patient_Room,
	    		 },{ autoCommit: true },                              //autoCommit을 통해 Commit 자동화 
	    		 
	     function(err, result) {  									
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	        	  console.log("DB success");
	          }
	     }); 	     
	});
 res.end("yes");
});




app.get('/motor', function (req, res) { // 추가 사항 입력 코드
	
	var speed1 = 1;	
	var motor_speed = speed1;
	
	res.json(speed1);
		
	res.end();
});



app.post('/infusion', function(req, res){
	  var post=req.body;
    res.send("회원정보가 등록되었습니다.");
   	var id = post.id;
  	var name = post.name;
  	var total_amount = post.total;
  	var disease = post.disease;
  	
  	console.log(id,name,total_amount,disease);
    
  	
	oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
	      user          : dbConfig.user,               // user
	      password      : dbConfig.password,           // password
	      connectString: dbConfig.connectString
	}, function(err, connection) {  
	     if (err) {                                   //err이벤트 발생시
	          console.error(err.message);             //err.message를 console창에 출력
	          return;  
	     }
	     console.log(req.body);                       	   // req.body 에 있는 모든 데이터를 console창에 출력	  
	 
	     connection.execute("INSERT INTO Infusion (id,Infusion_name,Infusion_total_amount,disease) VALUES(:ID, :NAME, :TOTAL ,:DISEASE)", //execute를 통해 sql문 출력 가능하게끔 함 
	    		 {
   	      			ID : id,
   	      			NAME : name ,
   	      			TOTAL : total_amount , 
   	      			DISEASE : disease , 
	    		 },
	    		 { autoCommit: true },                              //autoCommit을 통해 Commit 자동화 
	    		 
	     function(err, result) {  									
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	        	  console.log("DB success");
	          }
	     }); 	     
	});

		
   res.end("yes");
});

	

app.post('/upload', function(req, res){                // "upload" 하며 post를 통해 db로 보내는 함수
   oracledb.getConnection({                            // DB에 연결하기 위해 getConnection함수를 사용
	      user          : dbConfig.user,               // user
	      password      : dbConfig.password,           // password
	      connectString: dbConfig.connectString
	}, function(err, connection) {  
	     if (err) {                                   //err이벤트 발생시
	          console.error(err.message);             //err.message를 console창에 출력
	          return;  
	     }
	     console.log(req.body);                       	   // req.body 에 있는 모든 데이터를 console창에 출력	   
	     var temperature=req.body.temp;                        // req.body.temp값을 temperature 라는 변수에 저장
	     var bpm=req.body.bpm;								   // req.body.bpm값을   bpm 라는 변수에 저장
	     console.log("temp = "+ temperature);              // console 창에 temperature 값 출력
	     console.log("bpm = " + bpm);	            	   // console 창에 bpm 값 출력
	     
	     connection.execute("INSERT INTO SENSOR(TEMP,BPM) VALUES(:TEMP, :BPM)",
	    		 {
   			temp : temperature,
   		    bpm : bpm,
		 },
	    		 { autoCommit: true },
	    		 
	     function(err, result) {  
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	          }
	     });  	 
	     
	     connection.execute("UPDATE Medical_record SET body_temp = :temp where id = 1",
	    		 {
      			temp : temperature,
 		 },
	    		 { autoCommit: true },
	    		 
	     function(err, result) {  
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	          }
	     });  
	     
	     connection.execute("UPDATE Medical_record SET BPM = :body_bpm where id = 1",
	    		 {
	    	 body_bpm : bpm,
		 },
	    		 { autoCommit: true },
	    		 
	     function(err, result) {  
	          if (err) {  
	               console.error(err.message);  
	               doRelease(connection);  
	               return;  
	          }  
	          else{
	          }
	     });  
	});
   res.end("yes");
});


app.listen(port, hostname, function () {            // port , hostname을 읽어서 출력 
	console.log(`Server running at http://${hostname}:${port}/`);  
});



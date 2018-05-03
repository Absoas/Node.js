var oracledb = require('oracledb');       //Oracle db module 가져오기
var async = require('async');             //함수 정리.
var dbConfig = require('./dbconfig.js');

var doconnect = function(cb) {
	  oracledb.getConnection(
	    {
	      user          : dbConfig.user,
	      password      : dbConfig.password,
	      connectString: dbConfig.connectString
	    },
	    cb);
	};

var dorelease = function(conn) {
	 conn.close(function (err) {
	    if (err)
	      console.error(err.message);
	    });
	};

var dodelete = function (conn, cb) {
	 conn.execute(
	   "delete from yb",
	   function(err)
	   {
	    if (err) {
	      console.error(err.message); 
	      return cb(err, conn);
	    } else {
	      return cb(null, conn);
	    }
	  });
	 };
	 
var doselect = function (conn, cb) {
	conn.execute(
		    "SELECT * from yb",
		    function(err, result)
		    {
		      if (err) {
		    	  console.error(err.message);  
		    	  console.log("fail");
		        return cb(err, conn);
		      } else {
		        return cb(null, conn);
		      }
		    });
		};

var doinsert = function(conn, cb) {
	conn.execute(
			"insert into yb values(:temp,:bpm )",
			[11.23, 60],
			{ autoCommit: true }, 
			function(err, result) {
				if (err) {
					console.error(err.message);
					console.log("fail");
					return cb(err, conn);
				} else {
					return cb(null, conn);
				}
			});
		};
		
		async.waterfall(  //콜백 정리
				  [
				    doconnect,
				    doselect,
				    dodelete,
				    doinsert // comment this out if you want to verify the data later
				  ],
				  function (err, conn) {
				    if (err) { console.error("async err: ==>", err, "<=="); }
				    if (conn)
				      dorelease(conn);
				  });
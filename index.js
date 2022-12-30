const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
const mycon = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

let c = mycon.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "Sandy@123",
    database : "college"
});

c.connect(function(error){
    if(error){console.log(error);}
    else{
        console.log('Database Connected');
    }
});

app.post('/Signup',(request,response)=>{

   let {role,firstname,lastname,dob,gender,email,mobile,password} = request.body;
   
   let sql = "insert into signdetails(username,password,firstname,lastname,dob,gender,email,mobile,role,status) values(?,?,?,?,?,?,?,?,?)";

   c.query(sql,[email,password,firstname,lastname,dob,gender,email,mobile,role,0],(error,result)=>{
    if(error){
        let s = {"status":"error"};
        response.send(s);
    }
    else{
        let s = {"status":"success"};
        response.send(s);
    }
   })
})

app.post("/Signin",(request,response)=>{
    let {username,password} = request.body;

    let sql = 'select * from signdetails where username=?';

    c.query(sql,[username],(error,result)=>{
        if(error){
            let s = {"status":"syntaxerror"};
            response.send(s);
        }
        else if(result.length > 0){
            let username1 = result[0].username;
            let password1 = result[0].password;
            let role = result[0].role;
            let id = result[0].id;

            if(username1 === username && password1 === password){
                let s = {"status":"success","id":id,"role":role};
                response.send(s);
            }
            else{
                let s = {"status":"Invalid"};
                response.send(s);
            }
        }
        else{
            let s = {"status":"error"}
            response.send(s);
        }
    })


})

app.listen(3002 ,()=>{console.log('Server running on 3002')});
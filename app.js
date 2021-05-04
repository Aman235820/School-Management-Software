const express=require('express');
const app=express();

const mongoose= require('mongoose');

const DB = 'mongodb+srv://aman:somaniaman@cluster0.2rxcu.mongodb.net/schoolmg?retryWrites=true&w=majority';

mongoose.connect(DB,{ useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
.then(()=>console.log("Connection established sucessfully....")).catch((err)=> console.log(err));


const path=require('path');
const hbs=require('hbs');
const multer =require('multer');
const register=require('./register');
const teacher=require('./teacher');
const attendance=require('./attendance');
const marks = require('./marks')
const fs = require('fs');

const excelToJson = require('convert-excel-to-json');

const pdf=require('pdfkit');
const myDoc=new pdf();




const{json}=require('express');
const port=process.env.PORT || 5000;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
})

 
var upload = multer({ storage: storage })


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine","hbs");


app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname,"/uploads")));
app.use(express.static(path.join(__dirname, '/docs')));


app.get("/",(req,res)=>{
    res.render("index");
});

app.get('/regi',(req,res)=>{
	res.render('regi');
});
app.get('/log',(req,res)=>{
	res.render('log');
});

app.get("/sign",(req,res)=>{
	res.render('sign');
});
app.get("/login",(req,res)=>{
	res.render('login');
});

app.get("/signint",(req,res)=>{
	res.render('signint');
});
app.get("/logint",(req,res)=>{
	res.render('logint');
});



app.get('/admin',(req,res)=>{
	res.render('admin')
});

app.get("/pss",(req,res)=>{
	res.render('pss');
});




app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", upload.single("pimage"),async(req,res)=>{
    try{
    	const student= new register({
    		firstName:req.body.fname,
			lastName:req.body.lname,
			mobileNumber:req.body.Phone,
			age:req.body.age,
			gender:req.body.Gender,
	    	emailAddress:req.body.email,
			password:req.body.password,
	 		address:req.body.address,
	 		image:req.file.filename
    	})
		const registered=await student.save();
		res.status(201).render("index");
    	

    }catch(err){res.status(400).send(err)}
});

app.post("/teacher", upload.single("timage"),async(req,res)=>{
    try{
    	const teachers= new teacher({
    		firstName:req.body.fname,
			lastName:req.body.lname,
			mobileNumber:req.body.Phone,
			age:req.body.age,
			gender:req.body.Gender,
	    	emailAddress:req.body.email,
			password:req.body.password,
	 		address:req.body.address,
	 		image:req.file.filename
    	})
		const registered=await teachers.save();
		res.status(201).render("index");
    	

    }catch(err){res.status(400).send(err)}
});

app.post("/login",async(req,res)=>{
	 try{
    	const email=req.body.email;
    	const password=req.body.password;

    	const data = await register.findOne({emailAddress:email});
  
  		if(data.password === password){
    		res.status(201).render('std',{
    			id:data._id,
    			fname:data.firstName,
    			lname:data.lastName,
    			phone:data.mobileNumber,
    			age:data.age,
    			email:data.emailAddress,
    			image:data.image

    		});
    	}
    	else
    	{
    		res.status(400).render('login',{
    	error:"**Invalid login credintials"
    });
    	}

    }catch(err){res.status(400).render('login',{
    	error:"**Invalid login credintials"
    })};
 });

app.post("/teclog",async(req,res)=>{
	 try{
    	const email=req.body.email;
    	const password=req.body.password;

    	const data = await teacher.findOne({emailAddress:email});
  
  		if(data.password === password){
    		res.status(201).render('fac',{
    			name:data.firstName,
    			phone:data.mobileNumber,
    			age:data.age,
    			email:data.emailAddress,
    			image:data.image

    		});
    	}
    	else
    	{
    		res.status(400).render('logint',{
    	error:"**Invalid login credintials"
    });
    	}

    }catch(err){res.status(400).render('logint',{
    	error:"**Invalid login credintials"
    })};
 });

app.get("/disp" ,async(req,res)=>{
	try{
	const display= await register.find();
     //console.log(ress);
        res.render('disp',{
        	users:display
        });
   } catch(error){
      res.status(404).send("error");
    }
});

app.get("/dispstd/:id" ,async(req,res)=>{
	try{

		const id=req.params.id;
	const show= await register.find({_id:id});
	//console.log(show);
    
        res.render('dispstd',{
        	users:show
        });
   } catch(error){
      res.status(404).send("error");
    }
});

app.post("/update/:id" ,async(req,res)=>{

	try{
		const id=req.params.id;
		const update=await register.findByIdAndUpdate(id,{firstName:req.body.fname,
			lastName:req.body.lname,
			mobileNumber:req.body.phn,
			age:req.body.age,
	 		address:req.body.add
	 		});

		res.redirect('/disp');
   } catch(error){
      res.status(404).send("error");
    }
});

app.get("/delete/:id",async(req,res)=>{
    try{
	const id= req.params.id;
	const del = await register.findByIdAndDelete(id);
	res.redirect("/allstds");
       
    }catch(error){
      res.status(404).send("error");
    }

});

app.get("/marks/:id", async(req,res)=>{
	try{

		const id=req.params.id;
	const show= await register.find({_id:id});
		res.render("marks",{
			users:show
		});
	}catch(error){
      res.status(404).send("error");
  }
});

app.post("/result/:id", async(req,res)=>{
	try{
		const id=req.params.id;
		const del = await marks.findOneAndDelete({Identity:id});

		const result= new marks({
    		Name:req.body.name,
			Identity:req.body.id,
			Physics:req.body.phy,
			Chemistry:req.body.chm,
			Mathematics:req.body.mat,
			Percentage:req.body.percentage

})
		const entry=await result.save();
		res.status(201).redirect("/disp");

	}catch(error){
      res.status(404).send("error");
  }
});

app.get("/results/:id",async(req,res)=>{
		try{
			const id=req.params.id;
			const show= await marks.find({Identity:id});
		res.render("result",{
			users:show
		});


		}catch(error){
      res.status(404).send("error");
  }

});

app.get("/atdnce",async(req,res)=>{
		try{
		const display= await register.find();
		const atdncc= await attendance.find();
		res.render("atdnce",{
			stds:display,
			atds:atdncc
		
		});



		}catch(error){
      res.status(404).send("error");
  }


});


app.post("/attendance/:id",async(req,res)=>{

try{

	const id=req.params.id;

	const del = await attendance.findOneAndDelete({Identity:id});

	const upd= new attendance({
    		Name:req.body.name,
			Identity:req.body.id,
			Physics:req.body.ph,
			Chemistry:req.body.ch,
			Mathematics:req.body.mt,
			Tilldate:req.body.dates
})
	const enter=await upd.save();

	res.redirect("/atdnce");

       
    }catch(error){
      res.status(404).send("<h3 style='color:red'>**units not inserted correctly !!</h3>");
    }
});


app.get("/showattd/:id",async(req,res)=>{
		try{
			const id=req.params.id;
			const show= await attendance.find({Identity:id});
			//console.log(show);
		res.render("shwattdn",{
			users:show
		});


		}catch(error){
      res.status(404).send("error");
  }

});

app.get('/downloadTC/:id',async(req,res)=>{
	 try{
	 const id=req.params.id;
    const result= await register.findOne({_id:id});
    const firstname=result.firstName;
	 const lastname=result.lastName;
	 const name = firstname+" "+lastname; 
            myDoc.pipe(fs.createWriteStream( name + '.pdf'));
          
	        myDoc.font('Times-Roman');	
	        myDoc.fontSize(30);
	        myDoc.text('Dear ' + name + ',' , 50 , 50 );
	        myDoc.fontSize(20);
	        myDoc.text(' ');
	        myDoc.text('We are granting you leaving certificate' );
	        myDoc.fontSize(15);
	        myDoc.fillColor('red');
	        myDoc.text('The conduct of yours has been good');
	        myDoc.text(' ');
	        myDoc.fillColor('green');
	        myDoc.text('we wish you all the best for your future studies.');
            myDoc.end();
       

            setTimeout(function(){const data=fs.readFileSync('./'+name+'.pdf',{root:'/docs'})
            res.contentType('application/pdf')
            res.send(data)
            },port)

       

   
    }catch(error){
      res.status(404).send("error");
  }
        

});

app.get('/admlogin',(req,res)=>{
	res.render('admlogin')
});

app.post("/administ",(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;
const e="admin@gmail.com";
const p="1234";
if(email==e&&password==p){
  res.render('admin');
}
	else
    	{
    		res.status(400).render('admlogin',{
    	error:"**Invalid login credintials"
    });
    	}

    }catch(err){res.status(400).render('admlogin',{
    	error:"**Invalid login credintials"
    })};
 });

app.get('/allstds',async(req,res)=>{
	try{
	const display= await register.find();
	res.render('allstds',{
		users:display
	});
}catch(error){
      res.status(404).send("error");
  }
});

app.get('/facultydisp',async(req,res)=>{
	try{
	const display= await teacher.find();
	res.render('facultydisp',{
		users:display
	});
}catch(error){
      res.status(404).send("error");
  }
});

app.get("/dispteach/:id" ,async(req,res)=>{
	try{

		const id=req.params.id;
	const show= await teacher.find({_id:id});
	//console.log(show);
    
        res.render('dispteach',{
        	users:show
        });
   } catch(error){
      res.status(404).send("error");
    }
});

app.post("/updatefac/:id" ,async(req,res)=>{

	try{
		const id=req.params.id;
		const update=await teacher.findByIdAndUpdate(id,{firstName:req.body.fname,
			lastName:req.body.lname,
			mobileNumber:req.body.phn,
			age:req.body.age,
	 		address:req.body.add
	 		});

		res.redirect('/facultydisp');
   } catch(error){
      res.status(404).send("error");
    }
});

app.get("/deleteteach/:id",async(req,res)=>{
    try{
	const id= req.params.id;
	const del = await teacher.findByIdAndDelete(id);
	res.redirect("/facultydisp");
       
    }catch(error){
      res.status(404).send("error");
    }

});







app.post("/pssd",async(req,res)=>{
	try{
	if(req.body.pswd=='1234'){
		let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb+srv://aman:somaniaman@cluster0.2rxcu.mongodb.net/schoolmg?retryWrites=true&w=majority';

// -> Read Excel File to Json Data

const excelData = excelToJson({
    sourceFile: 'customers.xlsx',
    sheets:[{
		// Excel Sheet Name
        name: 'Customers',
		
		// Header Row -> be skipped and will not be present at our result object.
		header:{
            rows: 1
        },
		
		// Mapping columns to keys
        columnToKey: {
        	A: 'firstName',
 			B: 'lastName',
			C: 'mobileNumber',
			D: 'age',
			E: 'gender',
			F: 'emailAddress',
			G: 'password',
			H: 'address'
        }
    }]
});

// -> Log Excel Data to Console
console.log(excelData);

// -> Insert Json-Object to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  
  var dbo = db.db("schoolmg");
  
  dbo.collection("records").insertMany(excelData.Customers, (err, res) => {
	if (err) throw err;
	
	console.log("Number of documents inserted: " + res.insertedCount);
	db.close();
  });
});


	res.redirect("/allstds");

	}
	else{
		res.render('pss',{
			err:'Wrong Password'
		});
	}



}catch(error){
      res.status(404).send("error");
  }
});











app.get("*",(req,res)=>{
	res.send("Error 404");
});
app.listen(port,()=>{
	console.log("Server is listening at port:" + port);
});
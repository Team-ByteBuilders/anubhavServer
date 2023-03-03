//Register
const register = async (req, res) => {
	const username = req.body.username;
    const password = req.body.password;
    const dob = req.body.dob;
    console.log(username,password)
    bcrypt.hash(password,salt,async(err,hash)=>{
        if(err){
            console.log(err)
        } 
        res = await db.request().query(`INSERT INTO users (id,name,password,dob) VALUES (154,${username},${password},${dob})`)
        res.send(res);

    })   
};
const verifyJWT = ( req,res,next) =>{
    const token=req.headers("x-accesss-token")
    if(!token){
        res.send("yoo give us our token back ")
    }
    else{
        jwt.verify(token,"jwtsecret",(err,decoded)=>{
            if(err){
                res.json({auth:false,message:"you failed to authenticate"})
            }
            else{
                req.useId=decoded.id;
                next()
            }
        })
    }

}


//login
const login = async (req, res) => {
	const username = req.body.username;
    const password = req.body.password;
    console.log(username,password)
   
     db.query(`SELECT * FROM sql12602314 where username= ? `,
     username,
     (err,result)=>{
        if(result.length>0){
            bcrypt.compare(password , result[0].password , (err,response)=>{
                if(response){
                    const id=result[0].id;
                    const token=jwt.sign({id},"jwtsectret",{
                        expiresIn:300,
                    })
                    res.json({auth:true,token:token,result:result});
                }
                else{
                    res.send({message:"wrong combination of username and password"})
                }
            })
        }
        else if(result==0){
            res.send({message:"user does not exist!!"})
        }
        else if (err){
          //  res.send({message:"enter correct asked detail"})
            res.send(err)
        }

    }
    )
};
const userDetails = async (req, res) => {
	const altPhnNo = req.body.altPhnNo;
    const modeOfContact = req.body.modeOfContact;
    console.log(altPhnNo,modeOfContact)
	res=await db.request().query(`INSERT INTO userdetails (altPhnNo,modeOfContact) VALUES(?,?)`,
	[altPhnNo,modeOfContact],
	(err,result)=>{
		console.log(err);

	}
	 
	)
    
};

const resetPassword = async (req, res) => {
	// reset pass
};

module.exports = {
	register,
	login,
	resetPassword,
	userDetails
};

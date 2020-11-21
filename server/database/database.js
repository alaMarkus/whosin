const db = require("mysql2")

const connection = {
    user: "groot",
    password: "groot",
    host: "95.216.173.144",
    database: "whosin",
    dateStrings: true
}

const con = db.createConnection(connection)

con.connect(function(err){
    if(err) throw err;
    console.log("connected to database")
})

exports.insertGet = (sql, args) =>  {
    return new Promise((resolve,reject)=>{
        if (args===undefined){
            con.execute(sql, function(err, result){
                if (err){
                    console.log("ERROR: ")
                    console.log(err.message)
                    reject(new Error(err.message))
                }else{
                    resolve(result)
                }
            })
        }else{
            if (args.includes(undefined)){
                reject(new Error("undefined value in args"))
            }
            if (args.includes("")){
                reject(new Error("empty value in args"))
            }
            else{
                con.execute(sql, [...args], function(err,result){
                    if (err){
                        console.log("ERROR: ")
                        console.log(err.message)
                        reject(new Error(err.message))
                    }else{
                        resolve(result)
                    }
                })
            }
        }
    })
}

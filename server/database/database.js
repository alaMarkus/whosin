const db = require("mysql2")

const connection = {
    user: "groot",
    password: "groot",
    host: "95.216.173.144",
    database: "whosin",
    dateStrings: true
}
const pool = db.createPool({
    user: "groot",
    password: "groot",
    host: "95.216.173.144",
    database: "whosin",
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const con = db.createConnection(connection)


/*con.connect(function(err){
    if(err) throw err;
    console.log("connected to database")
})*/

exports.insertGet = (sql, args) =>  {
    //console.log("called insertGet")
    return new Promise((resolve,reject)=>{
        if (args===undefined){
            pool.execute(sql, function(err, result){
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
                pool.execute(sql, [...args], function(err,result){
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

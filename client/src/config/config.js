if (process.env.NODE_ENV === 'production'){
    //exports.apiUrl = "http://whosin.site"
    exports.apiUrl = "http://95.216.173.144:8085"
    //exports.apiUrl = "http://127.0.0.1:8085"
}else{
    exports.apiUrl = "http://localhost:8085"
}


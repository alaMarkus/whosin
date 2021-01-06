if (process.env.NODE_ENV === 'production'){
    exports.apiUrl = "http://whosin.site"
}else{
    exports.apiUrl = "http://localhost:8085"
}


let mysql = require("mysql");
let util = require("util");
const Huffman = new (require("./Huffman").Huffman)();
const md5 = require("md5");
const diff = require("diff");




class DataBase {
    static instance;
    static inst=false;
    mysql;
    constructor(){
        if(DataBase.inst){throw "too many instances"}
        DataBase.inst=true;
        this.mysql = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'GOT',
            insecureAuth: true
        };
    }
    static Instance(){
        if(!this.instance){
            this.instance = new DataBase();
        }
        return this.instance;
    }

    insertRepo(name, callback) {
        let sql = `INSERT INTO REPOSITORIO (nombre) VALUES ("${name}")`;
        console.log(sql)
        let conn = mysql.createConnection(this.mysql);
        conn.query(sql, (err, result, fields)=>{
            callback(result.InsertId);
			conn.end();
        })
    }
    /**
     * 
     * @param {id que identifica el repositorio en la metadata del cliente} repositorioId 
     * @param {autor del commit. por ahora es nulo} autor 
     * @param {mensaje a ser guardado como parte del commit} mensaje 
     * @param {hora en la que se realizó el commit} hora 
     * @param {lista de archivos a ser guardados en la base de datos} addFiles 
     * @param {lista de cambios a ser guardados sobre los archivos} changes 
     * @param {función que recibe el id del commit procesado} callback 
     */
    addCommit(repositorioId, autor, mensaje, hora, addFiles, changes, callback) {
        let sql = `INSERT INTO COMMITS (rep_id, autor, mensaje, hora)
                VALUES (${repositorioId}, ${autor}, ${mensaje}, ${Date.now});`;

        let conn = mysql.createConnection(this.mysql)
        conn.query(sql, (err, result, fields)=>{



			callback(result.insertId);
			conn.end();
		});
    }
	getFile(fileId, callback){
		let sql = `SELECT * FROM ARCHIVO`;
		
    }
    test(callback) {
        let conn = mysql.createConnection(this.mysql)
        function queryProcess(err, result, fields){
            tables = [];
            result.forEach(x => {tables.push(x.Tables_in_GOT)});
            conn.end();
        }
        conn.query("show tables", queryProcess);
    }
}

module.exports.DataBase = DataBase;

let DB = DataBase.Instance()
console.log(DB.insertRepo("hemlo",(a)=>{
    console.log(a);
}))
//select archivo test

console.log(DB.getFile(1,(file)=>{
	console.log(file);
}));


/*
tablaCodigos = [
    {"codigo":01,"simbolo":"a"},
    {"codigo":2123123,"simbolo":"w"},
    {"codigo":2123123,"simbolo":"w"},
    {"codigo":2123123,"simbolo":"w"}
]
codigo=[1,2,3,4,123,10111,122210101,010101];*/

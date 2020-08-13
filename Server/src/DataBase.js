const mysql2 = require("mysql2/promise");
const util = require("util");
const md5 = require("md5");
const diff = require("diff");
const compression = require("./Huffman");
const { REPL_MODE_STRICT } = require("repl");

class DataBase {
    static instance;
    static inst = false;
    mysql;
    encoder;
    constructor() {
        if (DataBase.inst) { throw "too many instances" }
        DataBase.inst = true;
        this.mysql = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'GOT',
            insecureAuth: true
        };
        this.encoder = new compression.Huffman();
    }
    static Instance() {
        if (!this.instance) {
            this.instance = new DataBase();
        }
        return this.instance;
    }
    async executeQuery(query) {
        const conn = await mysql2.createConnection(this.mysql)
        const [result] = await conn.execute(query);
        conn.end();
        return result;
    }

    async insertRepo(name) {
        const result = await this.executeQuery(`INSERT INTO REPOSITORIO (nombre) VALUES ("${name}")`)
        return result.insertId;
    }

    async insertCommit(repoId, parentCommit, mensaje, autor = "") {
        let sql = `INSERT INTO COMMITS (rep_id, parent_commit, mensaje, autor)
        VALUES (${repoId}, ${parentCommit}, ${mensaje}, "${autor}");`;
        return this.executeQuery(sql)
    }

    async insertArchivo(ruta, commit, contenido) {
       
        let contents = this.encoder.compress(contenido);
        let sql = `INSERT INTO ARCHIVO (ruta, commit_id, huffman_code, huffman_tree)
                    values ("${ruta}", ${commit}, "${contents.code}", "${contents.tabla}")`
        return await this.executeQuery(sql);
    }

    async getFile(ruta, callback) {
        let sql = `SELECT * FROM ARCHIVO where ruta="${ruta}"`;
        let [file] =  await this.executeQuery(sql);
        return file;
    }

    async test2() {
        return await this.executeQuery("SHOW TABLES")
    }
}


module.exports.DataBase = DataBase;

let DB = DataBase.Instance()
async function tester() {
    let res = await DB.getFile("/sdasdasdasda/asdasds/asdasd.js");
    console.log(res)
}
tester()
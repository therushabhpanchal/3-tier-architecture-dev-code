const mysql = require('mysql2/promise');
const dbConfig = require('./DbConfig');

const db = mysql.createPool({
    host: dbConfig.DB_HOST,
    user: dbConfig.DB_USER,
    password: dbConfig.DB_PWD,
    database: dbConfig.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = db;

//const db = require('./db');


// ADD TRANSACTION
async function addTransaction(amount, description) {
    const sql = `
        INSERT INTO transactions (amount, description)
        VALUES (?, ?)
    `;

    const [result] = await db.query(sql, [amount, description]);
    return result;
}


// GET ALL TRANSACTIONS
async function getAllTransactions() {
    const [rows] = await db.query('SELECT * FROM transactions');
    return rows;
}


// GET TRANSACTION BY ID
async function findTransactionById(id) {
    const [rows] = await db.query(
        'SELECT * FROM transactions WHERE id = ?',
        [id]
    );
    return rows;
}


// DELETE ALL TRANSACTIONS
async function deleteAllTransactions() {
    const [result] = await db.query('DELETE FROM transactions');
    return result;
}


// DELETE TRANSACTION BY ID
async function deleteTransactionById(id) {
    const [result] = await db.query(
        'DELETE FROM transactions WHERE id = ?',
        [id]
    );
    return result;
}


module.exports = {
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById
};

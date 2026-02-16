const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());


// HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

//backend test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

//whoami test
app.get("/whoami", (req, res) => {
  res.json({
    hostname: os.hostname(),
    privateIp: req.socket.localAddress
  });
});

// ADD TRANSACTION
app.post('/api/transaction', async (req, res) => {
    try {
        const { amount, desc } = req.body;

        if (!amount || !desc) {
            return res.status(400).json({
                message: 'amount and desc are required'
            });
        }

        await transactionService.addTransaction(amount, desc);

        res.status(201).json({
            message: 'Transaction added successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add transaction',
            error: err.message
        });
    }
});


// GET ALL TRANSACTIONS
app.get('/api/transaction', async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();

        res.status(200).json({
            result: transactions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to fetch transactions',
            error: err.message
        });
    }
});


// GET SINGLE TRANSACTION BY ID
app.get('/api/transaction/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const rows = await transactionService.findTransactionById(id);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to fetch transaction',
            error: err.message
        });
    }
});


// DELETE ALL TRANSACTIONS
app.delete('/api/transaction', async (req, res) => {
    try {
        await transactionService.deleteAllTransactions();

        res.status(200).json({
            message: 'All transactions deleted'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to delete transactions',
            error: err.message
        });
    }
});


// DELETE TRANSACTION BY ID
app.delete('/api/transaction/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await transactionService.deleteTransactionById(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: `Transaction ${id} deleted`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to delete transaction',
            error: err.message
        });
    }
});


app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});

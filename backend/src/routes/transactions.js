const express = require('express');
const router = express.Router();
const { validateTransaction } = require('../middleware/validate');
const {
  getAllTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.get('/', getAllTransactions);
router.post('/', validateTransaction, addTransaction);
router.patch('/:id', validateTransaction, editTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
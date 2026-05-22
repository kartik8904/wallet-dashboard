const { v4: uuidv4 } = require('uuid');
const store = require('../store/db');
const { calculateBalance } = require('../utils/balance');
const { createError } = require('../middleware/errorHandler');

const getAllTransactions = (req, res) => {
  const userId = req.user.id;
  const { search, type, status, currency, page = 1, limit = 10 } = req.query;

  let transactions = [...store.getTransactions(userId)];

  if (search) {
    transactions = transactions.filter(t =>
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (type) transactions = transactions.filter(t => t.type === type);
  if (status) transactions = transactions.filter(t => t.status === status);
  if (currency) transactions = transactions.filter(t => t.currency === currency);

  transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = transactions.length;
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const paginated = transactions.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
};

const addTransaction = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, amount, currency, description, status } = req.body;
    const currentBalance = calculateBalance(store.getTransactions(userId));

    if (type === 'debit' && status === 'completed' && parseFloat(amount) > currentBalance) {
      return next(createError(
        'insufficient_balance',
        `Insufficient balance. Your current balance is ₹${currentBalance} but you tried to debit ₹${amount}`
      ));
    }

    const transaction = {
      id: uuidv4(),
      type,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      description,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.addTransaction(userId, transaction);

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

const editTransaction = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { type, amount, currency, description, status } = req.body;

    const transactions = store.getTransactions(userId);
    const oldTransaction = transactions.find(t => t.id === id);

    if (!oldTransaction) {
      return next(createError('not_found', 'Transaction not found'));
    }

    // Step 1 — calculate balance without the old transaction
    // We temporarily remove the old transaction from the list
    // and calculate what the balance would be without it
    const transactionsWithoutOld = transactions.filter(t => t.id !== id);
    const balanceWithoutOld = calculateBalance(transactionsWithoutOld);

    // Step 2 — check if the new transaction is a debit that exceeds available balance
    if (
      type === 'debit' &&
      status === 'completed' &&
      parseFloat(amount) > balanceWithoutOld
    ) {
      return next(createError(
        'insufficient_balance',
        `Insufficient balance. Available balance after removing this transaction is ₹${balanceWithoutOld} but you tried to debit ₹${amount}`
      ));
    }

    // Step 3 — save the updated transaction
    const updatedTransaction = {
      ...oldTransaction,
      type,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      description,
      status,
      updatedAt: new Date().toISOString()
    };

    store.updateTransaction(userId, id, updatedTransaction);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction
    });
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const transactions = store.getTransactions(userId);
    const exists = transactions.find(t => t.id === id);

    if (!exists) {
      return next(createError('not_found', 'Transaction not found'));
    }

    store.deleteTransaction(userId, id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction
};

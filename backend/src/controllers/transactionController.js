const { v4: uuidv4 } = require('uuid');
const store = require('../store/db');
const { calculateBalance } = require('../utils/balance');
const { createError } = require('../middleware/errorHandler');

const getAllTransactions = (req, res) => {
  const { search, type, status, currency, page = 1, limit = 10 } = req.query;

  let transactions = [...store.transactions];

  if (search) {
    transactions = transactions.filter(t =>
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (type) {
    transactions = transactions.filter(t => t.type === type);
  }

  if (status) {
    transactions = transactions.filter(t => t.status === status);
  }

  if (currency) {
    transactions = transactions.filter(t => t.currency === currency);
  }

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
    const { type, amount, currency, description, status } = req.body;

    const currentBalance = calculateBalance(store.transactions);

    if (type === 'debit' && status === 'completed' && amount > currentBalance) {
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

    store.transactions.push(transaction);

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
    const { id } = req.params;
    const { type, amount, currency, description, status } = req.body;

    const index = store.transactions.findIndex(t => t.id === id);

    if (index === -1) {
      return next(createError('not_found', 'Transaction not found'));
    }

    const currentBalance = calculateBalance(store.transactions);
    const oldTransaction = store.transactions[index];

    let balanceWithoutOld = currentBalance;
    if (oldTransaction.type === 'credit' && oldTransaction.status === 'completed') {
      balanceWithoutOld -= oldTransaction.amount;
    } else if (oldTransaction.type === 'debit' && oldTransaction.status === 'completed') {
      balanceWithoutOld += oldTransaction.amount;
    }

    if (type === 'debit' && status === 'completed' && amount > balanceWithoutOld) {
      return next(createError(
        'insufficient_balance',
        `Insufficient balance. Available balance is ₹${balanceWithoutOld} but you tried to debit ₹${amount}`
      ));
    }

    store.transactions[index] = {
      ...store.transactions[index],
      type,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      description,
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: store.transactions[index]
    });
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = (req, res, next) => {
  try {
    const { id } = req.params;
    const index = store.transactions.findIndex(t => t.id === id);

    if (index === -1) {
      return next(createError('not_found', 'Transaction not found'));
    }

    store.transactions.splice(index, 1);

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
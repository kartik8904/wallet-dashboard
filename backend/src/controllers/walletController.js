const store = require('../store/db');
const { calculateBalance, calculateTotalCredits, calculateTotalDebits } = require('../utils/balance');

const getWallet = (req, res) => {
  const balance = calculateBalance(store.transactions);
  const totalCredits = calculateTotalCredits(store.transactions);
  const totalDebits = calculateTotalDebits(store.transactions);

  res.json({
    success: true,
    data: {
      ...store.wallet,
      balance,
      totalCredits,
      totalDebits,
      totalTransactions: store.transactions.length,
      currency: 'INR',
      symbol: '₹'
    }
  });
};

module.exports = { getWallet };
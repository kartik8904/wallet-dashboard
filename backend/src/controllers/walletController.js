const store = require('../store/db');
const { calculateBalance, calculateTotalCredits, calculateTotalDebits } = require('../utils/balance');

const getWallet = (req, res) => {
  const userId = req.user.id;
  const transactions = store.getTransactions(userId);
  const wallet = store.getWallet(userId);

  res.json({
    success: true,
    data: {
      ...wallet,
      balance: calculateBalance(transactions),
      totalCredits: calculateTotalCredits(transactions),
      totalDebits: calculateTotalDebits(transactions),
      totalTransactions: transactions.length,
      currency: 'INR',
      symbol: '₹'
    }
  });
};

module.exports = { getWallet };

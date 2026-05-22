const calculateBalance = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    if (transaction.status !== 'completed') return acc;
    
    if (transaction.type === 'credit') {
      return acc + transaction.amount;
    }
    
    if (transaction.type === 'debit') {
      return acc - transaction.amount;
    }
    
    return acc;
  }, 0);
};

const calculateTotalCredits = (transactions) => {
  return transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);
};

const calculateTotalDebits = (transactions) => {
  return transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);
};

module.exports = { calculateBalance, calculateTotalCredits, calculateTotalDebits };
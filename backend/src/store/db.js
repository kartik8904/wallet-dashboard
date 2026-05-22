const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data.json');

const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({}));
      return {};
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database:', err.message);
  }
};

const getUserData = (userId) => {
  const db = readDB();
  if (!db[userId]) {
    db[userId] = {
      wallet: {
        id: `wallet_${userId}`,
        name: 'My Wallet',
        currency: 'INR',
        createdAt: new Date().toISOString()
      },
      transactions: []
    };
    writeDB(db);
  }
  return db[userId];
};

const store = {
  getWallet(userId) {
    return getUserData(userId).wallet;
  },
  getTransactions(userId) {
    return getUserData(userId).transactions;
  },
  addTransaction(userId, transaction) {
    const db = readDB();
    if (!db[userId]) getUserData(userId);
    const freshDb = readDB();
    freshDb[userId].transactions.push(transaction);
    writeDB(freshDb);
  },
  updateTransaction(userId, id, updatedTransaction) {
    const db = readDB();
    const index = db[userId].transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      db[userId].transactions[index] = updatedTransaction;
      writeDB(db);
    }
  },
  deleteTransaction(userId, id) {
    const db = readDB();
    db[userId].transactions = db[userId].transactions.filter(t => t.id !== id);
    writeDB(db);
  }
};

module.exports = store;

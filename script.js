let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Shared elements (may or may not exist depending on page)
const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const savingsEl = document.getElementById("savings");
const balanceEl = document.getElementById("balance");
const historyEl = document.getElementById("history");

// 🧾 Transaction Page Logic
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!desc || isNaN(amount) || amount <= 0) return;

    const newTransaction = { desc, amount, type };
    transactions.push(newTransaction);
    saveTransactions();
    renderHistory();
    form.reset();
  });
}

// 📊 Dashboard Summary Logic
function updateSummary() {
  if (!incomeEl || !expensesEl || !savingsEl || !balanceEl) return;

  let income = 0, expenses = 0, saving = 0;

  transactions.forEach(tx => {
    if (tx.type === "income") income += tx.amount;
    else if (tx.type === "expense") expenses += tx.amount;
    else if (tx.type === "savings") saving += tx.amount;
  });

  incomeEl.textContent = `Income: ₹${income}`;
  expensesEl.textContent = `Expenses: ₹${expenses}`;
  savingsEl.textContent = `Savings: ₹${saving}`;
  balanceEl.textContent = `Balance: ₹${income - expenses - saving}`;
}

// 📜 Render History (used on both pages)
function renderHistory() {
  if (!historyEl) return;

  historyEl.innerHTML = "";
  transactions.forEach((tx, index) => {
    const li = document.createElement("li");

    if (form) {
      // Transaction page: show edit/delete buttons
      li.innerHTML = `
        <strong>${tx.desc}</strong> - ₹${tx.amount} (${tx.type})
        <button onclick="editTransaction(${index})">✏️</button>
        <button onclick="deleteTransaction(${index})">🗑️</button>
      `;
    } else {
      // Dashboard page: show plain history
      li.textContent = `${tx.desc} - ₹${tx.amount} (${tx.type})`;
    }

    historyEl.appendChild(li);
  });
}

// 🗑️ Delete transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderHistory();
  updateSummary();
}

// ✏️ Edit transaction
function editTransaction(index) {
  const tx = transactions[index];
  descInput.value = tx.desc;
  amountInput.value = tx.amount;
  typeInput.value = tx.type;

  transactions.splice(index, 1);
  saveTransactions();
  renderHistory();
  updateSummary();
}

// 💾 Save to localStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// 🔄 Initial load
renderHistory();
updateSummary();

// Savings Page Logic
const savingsForm = document.getElementById("savings-form");
const savingsDescInput = document.getElementById("savings-desc");
const savingsAmountInput = document.getElementById("savings-amount");
const savingsHistoryEl = document.getElementById("savings-history");

if (savingsForm) {
  savingsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = savingsDescInput.value.trim();
    const amount = parseFloat(savingsAmountInput.value);

    if (!desc || isNaN(amount) || amount <= 0) return;

    const newSavings = { desc, amount, type: "savings" };
    transactions.push(newSavings);
    saveTransactions();
    renderSavingsHistory();
    savingsForm.reset();
  });

  renderSavingsHistory();
}

function renderSavingsHistory() {
  if (!savingsHistoryEl) return;

  savingsHistoryEl.innerHTML = "";
  transactions
    .filter(tx => tx.type === "savings")
    .forEach((tx, index) => {
      const li = document.createElement("li");
      li.textContent = `${tx.desc} - ₹${tx.amount}`;
      savingsHistoryEl.appendChild(li);
    });
}

const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Save to localStorage (for demo purposes)
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful! You can now log in.");
    window.location.href = "login.html";
  });
}
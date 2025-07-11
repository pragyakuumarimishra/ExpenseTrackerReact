import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { addDoc, collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other"
];

function toCSV(rows) {
  if (!rows.length) return '';
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(row => Object.values(row).join(',')).join('\n');
  return `${header}\n${body}`;
}

function Dashboard({ dark, setDark }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [budget, setBudget] = useState("");
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);

  // All hooks must be called unconditionally
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, "users", user.uid, "expenses"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setExpenses(data);
      }
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  // Calculate total for budget
  const filteredExpenses = expenses.filter(e => {
    const expDate = e.date || new Date().toISOString().slice(0, 10);
    return expDate.slice(0, 7) === filterMonth;
  });
  const totalThisMonth = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  useEffect(() => {
    if (budget && totalThisMonth > parseFloat(budget)) {
      setShowBudgetAlert(true);
    } else {
      setShowBudgetAlert(false);
    }
  }, [budget, totalThisMonth]);

  if (!user) {
    return <p>Loading... Please login or sign up.</p>;
  }

  const addExpense = async (e) => {
    e.preventDefault();
    setError("");
    if (!amount || !category || !date) {
      setError("Please enter amount, category, and date.");
      return;
    }
    try {
      await addDoc(collection(db, "users", user.uid, "expenses"), {
        amount: parseFloat(amount),
        category,
        date
      });
      setAmount("");
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "expenses", id));
  };

  const chartData = {
    labels: [...new Set(filteredExpenses.map((e) => e.category))],
    datasets: [
      {
        data: filteredExpenses.reduce(
          (acc, cur) => {
            const idx = acc.labels.indexOf(cur.category);
            if (idx === -1) {
              acc.labels.push(cur.category);
              acc.data.push(cur.amount);
            } else {
              acc.data[idx] += cur.amount;
            }
            return acc;
          },
          { labels: [], data: [] }
        ).data,
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#facc15"]
      }
    ]
  };

  const handleExportCSV = () => {
    const rows = filteredExpenses.map(({ id, ...rest }) => rest);
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${filterMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center dark:bg-gray-800">
          <h2 className="text-xl font-bold">Welcome, {user.email}</h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDark(d => !d)}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 dark:bg-gray-700 dark:text-yellow-300 dark:hover:bg-gray-600"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => signOut(auth)}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow dark:bg-gray-800 dark:text-white">
          <form onSubmit={addExpense} className="flex flex-col md:flex-row gap-2 mb-6">
            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              type="number"
              min="0"
              step="0.01"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700">
              Add Expense
            </button>
          </form>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 dark:bg-red-900 dark:text-red-200">{error}</div>}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <span>Filter by Month:</span>
              <input
                type="month"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Monthly Budget:</span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
            <button
              onClick={handleExportCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Export CSV
            </button>
          </div>
          {showBudgetAlert && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 dark:bg-yellow-900 dark:text-yellow-200">
              <strong>Alert:</strong> You have exceeded your monthly budget!
            </div>
          )}
          <ul className="mb-8">
            {filteredExpenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center border-b py-2 dark:border-gray-700"
              >
                <span>
                  <span className="font-semibold">₹{e.amount}</span> - {e.category} <span className="text-xs text-gray-500 dark:text-gray-400">[{e.date}]</span>
                </span>
                <button
                  onClick={() => deleteExpense(e.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <div className="max-w-xs mx-auto">
            <Pie data={chartData} />
          </div>
          <div className="mt-6 text-center">
            <span className="font-bold">Total this month:</span> ₹{totalThisMonth}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

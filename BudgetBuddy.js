
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// ==========================================
// CONFIGURATION
// ==========================================

const STORAGE_KEY = "@budgetbuddy_data";

const CATEGORIES = [
  { name: "Food", emoji: "🍔" },
  { name: "Transportation", emoji: "🚌" },
  { name: "School", emoji: "📚" },
  { name: "Shopping", emoji: "🛍️" },
  { name: "Bills", emoji: "💡" },
  { name: "Health", emoji: "💊" },
  { name: "Entertainment", emoji: "🎮" },
  { name: "Other", emoji: "📦" },
];

const INCOME_CATEGORIES = [
  "Allowance",
  "Salary",
  "Business",
  "Gift",
  "Other",
];

const INITIAL_DATA = {
  transactions: [],
  budget: 5000,
  goals: [],
};

const money = (amount) =>
  "₱" + Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
};

const dateLabel = (date) =>
  new Date(date).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

function StatCard({ title, amount, emoji, color }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <Text style={styles.statEmoji}>{emoji}</Text>
        <View
          style={[styles.statDot, { backgroundColor: color }]}
        />
      </View>

      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.statAmount} numberOfLines={1}>
        {money(amount)}
      </Text>
    </View>
  );
}

function PrimaryButton({ title, onPress, color = "#21865B" }) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function EmptyState({ emoji, title, description }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function App() {
  const [screen, setScreen] = useState("Dashboard");

  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState("5000");
  const [goals, setGoals] = useState([]);

  const [loaded, setLoaded] = useState(false);

  // TRANSACTION FORM
  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  // BUDGET FORM
  const [newBudget, setNewBudget] = useState("");

  // SAVINGS FORM
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [contribution, setContribution] = useState("");
  const [activeGoal, setActiveGoal] = useState(null);

  const [historyFilter, setHistoryFilter] = useState("All");

  // ========================================
  // LOAD LOCAL DATA
  // ========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const data = JSON.parse(saved);

          setTransactions(data.transactions || []);
          setBudget(String(data.budget ?? 5000));
          setGoals(data.goals || []);
        }
      } catch (error) {
        Alert.alert("Error", "Unable to load saved data.");
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  // ========================================
  // SAVE DATA AUTOMATICALLY
  // ========================================

  useEffect(() => {
    if (!loaded) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            transactions,
            budget,
            goals,
          })
        );
      } catch (error) {
        console.log("Save error:", error);
      }
    };

    saveData();
  }, [transactions, budget, goals, loaded]);

  // ========================================
  // FINANCIAL CALCULATIONS
  // ========================================

  const monthTransactions = useMemo(() => {
    return transactions.filter(
      (item) => item.month === currentMonth()
    );
  }, [transactions]);

  const totalIncome = monthTransactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = monthTransactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  // Overall available balance:
  // All income minus all expenses recorded.
  const balance = transactions.reduce((sum, item) => {
    return sum +
      (item.type === "Income" ? item.amount : -item.amount);
  }, 0);

  const monthlyBudget = Math.max(0, Number(budget) || 0);

  const remainingBudget = monthlyBudget - totalExpenses;

  const budgetPercentage =
    monthlyBudget > 0
      ? (totalExpenses / monthlyBudget) * 100
      : 0;

  // ========================================
  // ADD TRANSACTION
  // ========================================

  const addTransaction = () => {
    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount) ||
        numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Enter an amount greater than zero.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Missing Description", "Enter a transaction description.");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount: numericAmount,
      description: description.trim(),
      category,
      date: new Date().toISOString(),
      month: currentMonth(),
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setAmount("");
    setDescription("");
    setCategory(type === "Income" ? "Allowance" : "Food");

    setScreen("Transactions");

    Alert.alert("Success", "Transaction added successfully.");
  };

  // ========================================
  // DELETE TRANSACTION
  // ========================================

  const deleteTransaction = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions((previous) =>
              previous.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  // ========================================
  // UPDATE MONTHLY BUDGET
  // ========================================

  const updateBudget = () => {
    const value = Number(newBudget);

    if (!newBudget.trim() || !Number.isFinite(value) || value < 0) {
      Alert.alert("Invalid Budget", "Enter a valid budget amount.");
      return;
    }

    setBudget(String(value));
    setNewBudget("");

    Alert.alert("Success", "Monthly budget updated.");
  };

  // ========================================
  // CREATE SAVINGS GOAL
  // ========================================

  const addGoal = () => {
    const target = Number(goalTarget);

    if (!goalName.trim() || !goalTarget.trim() ||
        !Number.isFinite(target) || target <= 0) {
      Alert.alert(
        "Invalid Goal",
        "Enter a goal name and a valid target amount."
      );
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      target,
      saved: 0,
    };

    setGoals((previous) => [...previous, newGoal]);

    setGoalName("");
    setGoalTarget("");

    Alert.alert("Success", "Savings goal created.");
  };

  // ========================================
  // ADD SAVINGS CONTRIBUTION
  // ========================================

  const addContribution = () => {
    const value = Number(contribution);

    if (!activeGoal || !contribution.trim() ||
        !Number.isFinite(value) || value <= 0) {
      Alert.alert("Invalid Amount", "Enter a valid savings amount.");
      return;
    }

    const goal = goals.find((item) => item.id === activeGoal);

    if (!goal) return;

    if (value > goal.target - goal.saved) {
      Alert.alert(
        "Amount Too High",
        "Your contribution is greater than the remaining goal."
      );
      return;
    }

    if (value > Math.max(0, balance)) {
      Alert.alert(
        "Insufficient Balance",
        "You do not have enough available balance."
      );
      return;
    }

    // Record savings as an expense so the wallet
    // balance and spending totals remain accurate.
    const savingTransaction = {
      id: Date.now().toString(),
      type: "Expense",
      amount: value,
      description: `Savings: ${goal.name}`,
      category: "Savings",
      date: new Date().toISOString(),
      month: currentMonth(),
    };

    setTransactions((previous) => [
      savingTransaction,
      ...previous,
    ]);

    setGoals((previous) =>
      previous.map((item) =>
        item.id === activeGoal
          ? { ...item, saved: item.saved + value }
          : item
      )
    );

    setContribution("");
    setActiveGoal(null);

    Alert.alert("Success", "Savings contribution added.");
  };

  // ========================================
  // DELETE SAVINGS GOAL
  // ========================================

  const deleteGoal = (id) => {
    Alert.alert(
      "Delete Goal",
      "Do you want to remove this savings goal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setGoals((previous) =>
              previous.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  };

  // ========================================
  // DASHBOARD SCREEN
  // ========================================

  const Dashboard = () => {
    const recent = transactions.slice(0, 4);

    return (
      <View>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.greeting}>WELCOME BACK 👋</Text>
            <Text style={styles.welcomeTitle}>My Finances</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>BB</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            TOTAL AVAILABLE BALANCE
          </Text>

          <Text style={styles.balanceAmount}>
            {money(balance)}
          </Text>

          <View style={styles.balanceFooter}>
            <View>
              <Text style={styles.balanceSmallLabel}>
                Monthly Income
              </Text>
              <Text style={styles.balanceSmallValue}>
                +{money(totalIncome)}
              </Text>
            </View>

            <View>
              <Text style={styles.balanceSmallLabel}>
                Monthly Expenses
              </Text>
              <Text style={styles.balanceSmallValue}>
                -{money(totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatCard
            title="Income"
            amount={totalIncome}
            emoji="💰"
            color="#279B6A"
          />

          <StatCard
            title="Expenses"
            amount={totalExpenses}
            emoji="💸"
            color="#E27869"
          />
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setType("Income");
              setCategory("Allowance");
              setScreen("Add");
            }}
          >
            <Text style={styles.actionEmoji}>➕</Text>
            <Text style={styles.actionText}>Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setType("Expense");
              setCategory("Food");
              setScreen("Add");
            }}
          >
            <Text style={styles.actionEmoji}>💳</Text>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <SectionTitle
            right={
              <TouchableOpacity onPress={() => setScreen("Budget")}>
                <Text style={styles.seeAll}>View Budget →</Text>
              </TouchableOpacity>
            }
          >
            Monthly Budget
          </SectionTitle>

          <View style={styles.progressInfo}>
            <Text style={styles.muted}>Amount spent</Text>
            <Text style={styles.boldText}>
              {money(totalExpenses)} / {money(monthlyBudget)}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  backgroundColor:
                    budgetPercentage >= 100 ? "#D9534F" : "#279B6A",
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.budgetMessage,
              remainingBudget < 0 && { color: "#D9534F" },
            ]}
          >
            {remainingBudget >= 0
              ? `${money(remainingBudget)} remaining this month`
              : `${money(Math.abs(remainingBudget))} over budget`}
          </Text>
        </View>

        <View style={styles.card}>
          <SectionTitle
            right={
              <TouchableOpacity
                onPress={() => setScreen("Transactions")}
              >
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            }
          >
            Recent Transactions
          </SectionTitle>

          {recent.length === 0 ? (
            <EmptyState
              emoji="🧾"
              title="No transactions yet"
              description="Start recording your income and expenses."
            />
          ) : (
            recent.map((item) => (
              <TransactionRow
                key={item.id}
                item={item}
              />
            ))
          )}
        </View>

        <View style={styles.card}>
          <SectionTitle
            right={
              <TouchableOpacity onPress={() => setScreen("Savings")}>
                <Text style={styles.seeAll}>View Goals →</Text>
              </TouchableOpacity>
            }
          >
            Savings Overview
          </SectionTitle>

          {goals.length === 0 ? (
            <Text style={styles.muted}>
              No savings goals yet. Create one to start saving.
            </Text>
          ) : (
            goals.slice(0, 2).map((goal) => (
              <GoalProgress key={goal.id} goal={goal} />
            ))
          )}
        </View>
      </View>
    );
  };

  // ========================================
  // TRANSACTION ROW
  // ========================================

  const TransactionRow = ({ item }) => {
    const isIncome = item.type === "Income";

    const categoryInfo = CATEGORIES.find(
      (cat) => cat.name === item.category
    );

    const emoji =
      isIncome
        ? "💰"
        : categoryInfo?.emoji || "💵";

    return (
      <View style={styles.transactionRow}>
        <View style={styles.transactionIcon}>
          <Text style={{ fontSize: 21 }}>{emoji}</Text>
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>
            {item.description}
          </Text>

          <Text style={styles.transactionMeta}>
            {item.category} • {dateLabel(item.date)}
          </Text>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? "#21865B" : "#D96A60" },
            ]}
          >
            {isIncome ? "+" : "-"}{money(item.amount)}
          </Text>

          <TouchableOpacity
            onPress={() => deleteTransaction(item.id)}
          >
            <Text style={styles.deleteLink}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ========================================
  // TRANSACTIONS SCREEN
  // ========================================

  const TransactionsScreen = () => {
    const filtered = transactions.filter((item) => {
      return historyFilter === "All" ||
        item.type === historyFilter;
    });

    return (
      <View>
        <SectionTitle>Transaction History</SectionTitle>

        <Text style={styles.muted}>
          All your recorded financial activities.
        </Text>

        <View style={styles.filterRow}>
          {["All", "Income", "Expense"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                historyFilter === filter && styles.activeFilter,
              ]}
              onPress={() => setHistoryFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  historyFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          {filtered.length === 0 ? (
            <EmptyState
              emoji="📭"
              title="No transactions found"
              description="Your transaction records will appear here."
            />
          ) : (
            filtered.map((item) => (
              <TransactionRow key={item.id} item={item} />
            ))
          )}
        </View>

        <PrimaryButton
          title="+ Add New Transaction"
          onPress={() => setScreen("Add")}
        />
      </View>
    );
  };

  // ========================================
  // ADD TRANSACTION SCREEN
  // ========================================

  const AddScreen = () => {
    const availableCategories =
      type === "Income"
        ? INCOME_CATEGORIES
        : CATEGORIES.map((item) => item.name);

    return (
      <View style={styles.card}>
        <SectionTitle>Add Transaction</SectionTitle>

        <Text style={styles.formLabel}>Transaction Type</Text>

        <View style={styles.typeRow}>
          {["Income", "Expense"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeButton,
                type === item && styles.activeType,
                type === item &&
                  item === "Income" && { backgroundColor: "#21865B" },
              ]}
              onPress={() => {
                setType(item);
                setCategory(
                  item === "Income" ? "Allowance" : "Food"
                );
              }}
            >
              <Text
                style={[
                  styles.typeText,
                  type === item && styles.activeTypeText,
                ]}
              >
                {item === "Income" ? "＋ Income" : "－ Expense"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.formLabel}>Amount (PHP)</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter amount (e.g. 500)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.formLabel}>Description</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Lunch, Weekly allowance"
          value={description}
          onChangeText={setDescription}
          maxLength={80}
        />

        <Text style={styles.formLabel}>Category</Text>

        <View style={styles.categoryGrid}>
          {availableCategories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.activeCategory,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title="Save Transaction"
          onPress={addTransaction}
        />

        <PrimaryButton
          title="Cancel"
          color="#778078"
          onPress={() => setScreen("Dashboard")}
        />
      </View>
    );
  };

  // ========================================
  // BUDGET SCREEN
  // ========================================

  const BudgetScreen = () => {
    const categoryExpenses = CATEGORIES.map((cat) => {
      const total = monthTransactions
        .filter(
          (item) =>
            item.type === "Expense" &&
            item.category === cat.name
        )
        .reduce((sum, item) => sum + item.amount, 0);

      return { ...cat, total };
    }).filter((item) => item.total > 0);

    return (
      <View>
        <SectionTitle>Monthly Budget Planner</SectionTitle>

        <View style={styles.card}>
          <Text style={styles.formLabel}>Your Monthly Budget</Text>

          <Text style={styles.bigMoney}>
            {money(monthlyBudget)}
          </Text>

          <Text style={styles.muted}>
            Set a spending limit for this month.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter new monthly budget"
            keyboardType="decimal-pad"
            value={newBudget}
            onChangeText={setNewBudget}
          />

          <PrimaryButton
            title="Update Budget"
            onPress={updateBudget}
          />
        </View>

        <View style={styles.statGrid}>
          <StatCard
            title="Spent"
            amount={totalExpenses}
            emoji="💸"
            color="#D96A60"
          />

          <StatCard
            title="Remaining"
            amount={remainingBudget
              > 0 ? remainingBudget : 0}
            emoji="💚"
            color="#279B6A"
          />
        </View>

        <View style={styles.card}>
          <SectionTitle>Budget Progress</SectionTitle>

          <Text style={styles.bigMoney}>
            {Math.round(budgetPercentage)}%
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  backgroundColor:
                    budgetPercentage >= 100 ? "#D9534F" : "#279B6A",
                },
              ]}
            />
          </View>

          <Text style={styles.muted}>
            {remainingBudget >= 0
              ? `You can still spend ${money(remainingBudget)}.`
              : `You exceeded your budget by ${money(
                  Math.abs(remainingBudget)
                )}.`}
          </Text>
        </View>

        <View style={styles.card}>
          <SectionTitle>Expenses by Category</SectionTitle>

          {categoryExpenses.length === 0 ? (
            <Text style={styles.muted}>
              No expenses recorded this month.
            </Text>
          ) : (
            categoryExpenses.map((item) => {
              const percentage =
                totalExpenses > 0
                  ? (item.total / totalExpenses) * 100
                  : 0;

              return (
                <View key={item.name} style={styles.categoryStat}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.categoryStatName}>
                      {item.emoji} {item.name}
                    </Text>
                    <Text style={styles.boldText}>
                      {money(item.total)}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    );
  };

  // ========================================
  // SAVINGS PROGRESS COMPONENT
  // ========================================

  const GoalProgress = ({ goal }) => {
    const percentage =
      goal.target > 0
        ? Math.min((goal.saved / goal.target) * 100, 100)
        : 0;

    return (
      <View style={styles.goalProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.boldText}>{goal.name}</Text>
          <Text style={styles.goalPercentage}>
            {Math.round(percentage)}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%` },
            ]}
          />
        </View>

        <Text style={styles.muted}>
          {money(goal.saved)} of {money(goal.target)}
        </Text>
      </View>
    );
  };

  // ========================================
  // SAVINGS SCREEN
  // ========================================

  const SavingsScreen = () => (
    <View>
      <SectionTitle>My Savings Goals 💚</SectionTitle>

      <View style={styles.card}>
        <Text style={styles.formLabel}>Goal Name</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. New Laptop"
          value={goalName}
          onChangeText={setGoalName}
        />

        <Text style={styles.formLabel}>Target Amount (PHP)</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 25000"
          value={goalTarget}
          onChangeText={setGoalTarget}
          keyboardType="decimal-pad"
        />

        <PrimaryButton
          title="+ Create Savings Goal"
          onPress={addGoal}
        />
      </View>

      {goals.length === 0 ? (
        <View style={styles.card}>
          <EmptyState
            emoji="🐷"
            title="No savings goals yet"
            description="Create your first savings goal and start building your future."
          />
        </View>
      ) : (
        goals.map((goal) => {
          const percentage =
            Math.min((goal.saved / goal.target) * 100, 100);

          return (
            <View style={styles.card} key={goal.id}>
              <View style={styles.progressInfo}>
                <Text style={styles.goalName}>{goal.name}</Text>

                <Text style={styles.goalPercentage}>
                  {Math.round(percentage)}%
                </Text>
              </View>

              <Text style={styles.bigMoney}>
                {money(goal.saved)}
              </Text>

              <Text style={styles.muted}>
                Target: {money(goal.target)}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>

              {goal.saved >= goal.target ? (
                <Text style={styles.completedText}>
                  🎉 Goal completed!
                </Text>
              ) : (
                <PrimaryButton
                  title="＋ Add Savings"
                  onPress={() => {
                    setActiveGoal(goal.id);
                    setContribution("");
                  }}
                />
              )}

              {activeGoal === goal.id && (
                <View style={styles.contributionBox}>
                  <Text style={styles.formLabel}>
                    Contribution Amount (PHP)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    value={contribution}
                    onChangeText={setContribution}
                    keyboardType="decimal-pad"
                  />

                  <PrimaryButton
                    title="Confirm Savings"
                    onPress={addContribution}
                  />

                  <TouchableOpacity
                    onPress={() => setActiveGoal(null)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={() => deleteGoal(goal.id)}
              >
                <Text style={styles.deleteLink}>
                  Delete Goal
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}

      <View style={styles.card}>
        <Text style={styles.formLabel}>Total Saved</Text>

        <Text style={styles.bigMoney}>
          {money(
            goals.reduce((sum, goal) => sum + goal.saved, 0)
          )}
        </Text>
      </View>
    </View>
  );

  // ========================================
  // ANALYTICS SCREEN
  // ========================================

  const AnalyticsScreen = () => {
    const maxValue = Math.max(
      totalIncome,
      totalExpenses,
      1
    );

    return (
      <View>
        <SectionTitle>Financial Analytics 📊</SectionTitle>

        <Text style={styles.muted}>
          Your financial summary for the current month.
        </Text>

        <View style={styles.card}>
          <SectionTitle>Income vs Expenses</SectionTitle>

          {[
            {
              name: "Income",
              value: totalIncome,
              color: "#279B6A",
            },
            {
              name: "Expenses",
              value: totalExpenses,
              color: "#D96A60",
            },
          ].map((item) => (
            <View key={item.name} style={styles.categoryStat}>
              <View style={styles.progressInfo}>
                <Text style={styles.boldText}>{item.name}</Text>
                <Text style={styles.boldText}>
                  {money(item.value)}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <SectionTitle>Spending Breakdown</SectionTitle>

          {CATEGORIES.map((cat) => {
            const total = monthTransactions
              .filter(
                (item) =>
                  item.type === "Expense" &&
                  item.category === cat.name
              )
              .reduce((sum, item) => sum + item.amount, 0);

            if (total === 0) return null;

            return (
              <View key={cat.name} style={styles.transactionRow}>
                <Text style={styles.statEmoji}>{cat.emoji}</Text>

                <Text style={styles.transactionDetails}>
                  {cat.name}
                </Text>

                <Text style={styles.boldText}>
                  {money(total)}
                </Text>
              </View>
            );
          })}

          {totalExpenses === 0 && (
            <Text style={styles.muted}>
              Add some expenses to see your spending breakdown.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <SectionTitle>Financial Summary</SectionTitle>

          <SummaryRow label="Total Income" value={totalIncome} />
          <SummaryRow label="Total Expenses" value={totalExpenses} />
          <SummaryRow label="Monthly Balance" value={totalIncome - totalExpenses} />
          <SummaryRow
            label="Available Overall Balance"
            value={balance}
          />
        </View>
      </View>
    );
  };

  const SummaryRow = ({ label, value }) => (
    <View style={styles.summaryRow}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.boldText}>{money(value)}</Text>
    </View>
  );

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (!loaded) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingLogo}>BudgetBuddy 💚</Text>
        <Text style={styles.muted}>Loading your finances...</Text>
      </View>
    );
  }

  // ========================================
  // MAIN NAVIGATION
  // ========================================

  const renderScreen = () => {
    switch (screen) {
      case "Dashboard":
        return <Dashboard />;

      case "Transactions":
        return <TransactionsScreen />;

      case "Add":
        return <AddScreen />;

      case "Budget":
        return <BudgetScreen />;

      case "Savings":
        return <SavingsScreen />;

      case "Analytics":
        return <AnalyticsScreen />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F8F6"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderScreen()}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { name: "Dashboard", emoji: "🏠", label: "Home" },
          { name: "Transactions", emoji: "📋", label: "Activity" },
          { name: "Budget", emoji: "💰", label: "Budget" },
          { name: "Savings", emoji: "🐷", label: "Savings" },
          { name: "Analytics", emoji: "📊", label: "Reports" },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => setScreen(item.name)}
          >
            <Text style={styles.navEmoji}>
              {item.emoji}
            </Text>

            <Text
              style={[
                styles.navLabel,
                screen === item.name && styles.activeNavLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.navAdd}
          onPress={() => setScreen("Add")}
        >
          <Text style={styles.navAddText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F6",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#F5F8F6",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingLogo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#21865B",
    marginBottom: 12,
  },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  greeting: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "bold",
    color: "#84918A",
  },

  welcomeTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#213D30",
    marginTop: 5,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#D9EEE3",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#21865B",
    fontWeight: "bold",
  },

  balanceCard: {
    backgroundColor: "#21865B",
    borderRadius: 20,
    padding: 23,
    marginBottom: 17,
    elevation: 4,
  },

  balanceLabel: {
    color: "#D8F1E3",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },

  balanceAmount: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginVertical: 15,
  },

  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#65A987",
    paddingTop: 15,
  },

  balanceSmallLabel: {
    color: "#D8F1E3",
    fontSize: 11,
  },

  balanceSmallValue: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 14,
  },

  statGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  statEmoji: {
    fontSize: 22,
  },

  statDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },

  statLabel: {
    color: "#829087",
    fontSize: 12,
  },

  statAmount: {
    color: "#243D30",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 5,
  },

  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#E2F1E8",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  actionEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },

  actionText: {
    color: "#21865B",
    fontWeight: "bold",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 17,
    marginBottom: 15,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#243D30",
  },

  seeAll: {
    color: "#21865B",
    fontSize: 12,
    fontWeight: "bold",
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressTrack: {
    height: 9,
    backgroundColor: "#EAF0EC",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#279B6A",
    borderRadius: 10,
  },

  budgetMessage: {
    fontSize: 12,
    color: "#21865B",
    marginTop: 7,
    fontWeight: "600",
  },

  muted: {
    fontSize: 13,
    color: "#85928A",
    lineHeight: 20,
  },

  boldText: {
    fontSize: 13,
    color: "#243D30",
    fontWeight: "bold",
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F3F1",
  },

  transactionIcon: {
    width: 42,
    height: 42,
    backgroundColor: "#EDF5EF",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  transactionDetails: {
    flex: 1,
    marginLeft: 11,
  },

  transactionName: {
    fontSize: 13,
    color: "#243D30",
    fontWeight: "bold",
  },

  transactionMeta: {
    fontSize: 10,
    color: "#929C96",
    marginTop: 5,
  },

  transactionRight: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontWeight: "bold",
    fontSize: 12,
  },

  deleteLink: {
    color: "#D36B61",
    fontSize: 11,
    marginTop: 5,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    padding: 20,
  },

  emptyEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#243D30",
  },

  emptyDescription: {
    color: "#89958E",
    textAlign: "center",
    fontSize: 12,
    marginTop: 7,
    lineHeight: 19,
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 18,
  },

  filterButton: {
    backgroundColor: "#E9EFEB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: "#21865B",
  },

  filterText: {
    color: "#65766C",
    fontSize: 12,
    fontWeight: "bold",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  primaryButton: {
    backgroundColor: "#21865B",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 13,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  formLabel: {
    fontSize: 13,
    color: "#52655A",
    fontWeight: "bold",
    marginBottom: 9,
    marginTop: 14,
  },

  input: {
    backgroundColor: "#F5F8F6",
    borderWidth: 1,
    borderColor: "#E3EBE5",
    padding: 14,
    borderRadius: 11,
    fontSize: 14,
    color: "#243D30",
    marginBottom: 5,
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
  },

  typeButton: {
    flex: 1,
    backgroundColor: "#F2E8E7",
    padding: 14,
    borderRadius: 11,
    alignItems: "center",
  },

  activeType: {
    backgroundColor: "#D96A60",
  },

  typeText: {
    color: "#AD5A53",
    fontWeight: "bold",
  },

  activeTypeText: {
    color: "#FFFFFF",
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    backgroundColor: "#EDF3EF",
    padding: 11,
    borderRadius: 10,
  },

  activeCategory: {
    backgroundColor: "#21865B",
  },

  categoryText: {
    color: "#52665A",
    fontSize: 12,
  },

  activeCategoryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  bigMoney: {
    fontSize: 27,
    color: "#21865B",
    fontWeight: "bold",
    marginVertical: 10,
  },

  categoryStat: {
    marginBottom: 15,
  },

  categoryStatName: {
    fontSize: 13,
    color: "#52655A",
  },

  goalProgress: {
    marginBottom: 17,
  },

  goalPercentage: {
    color: "#21865B",
    fontWeight: "bold",
  },

  goalName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#243D30",
  },

  contributionBox: {
    backgroundColor: "#F5F8F6",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  completedText: {
    color: "#21865B",
    fontWeight: "bold",
    marginTop: 12,
  },

  cancelText: {
    color: "#85928A",
    textAlign: "center",
    padding: 12,
  },

  deleteLink: {
    color: "#D36B61",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF2F0",
  },

  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EDE9",
    paddingTop: 10,
    paddingBottom: 12,
  },

  navItem: {
    alignItems: "center",
    flex: 1,
  },

  navEmoji: {
    fontSize: 19,
  },

  navLabel: {
    fontSize: 9,
    color: "#87948B",
    marginTop: 4,
  },

  activeNavLabel: {
    color: "#21865B",
    fontWeight: "bold",
  },

  navAdd: {
    width: 39,
    height: 39,
    backgroundColor: "#21865B",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  navAddText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
});


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@studymate_data";

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [subjectName, setSubjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loaded) saveData();
  }, [subjects, tasks, schedule, loaded]);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);
        setSubjects(data.subjects || []);
        setTasks(data.tasks || []);
        setSchedule(data.schedule || []);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to load saved data.");
    } finally {
      setLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ subjects, tasks, schedule })
      );
    } catch (error) {
      Alert.alert("Error", "Unable to save data.");
    }
  };

  const addSubject = () => {
    if (!subjectName.trim()) {
      Alert.alert("Required", "Please enter a subject name.");
      return;
    }

    setSubjects((previous) => [
      ...previous,
      { id: Date.now().toString(), name: subjectName.trim() },
    ]);

    setSubjectName("");
  };

  const deleteSubject = (id) => {
    Alert.alert("Delete Subject", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setSubjects((previous) =>
            previous.filter((item) => item.id !== id)
          ),
      },
    ]);
  };

  const addTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Required", "Please enter a task title.");
      return;
    }

    setTasks((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        title: taskTitle.trim(),
        subject: taskSubject.trim() || "General",
        deadline: taskDeadline.trim() || "No deadline",
        completed: false,
      },
    ]);

    setTaskTitle("");
    setTaskSubject("");
    setTaskDeadline("");
  };

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const addSchedule = () => {
    if (!scheduleTitle.trim() || !scheduleTime.trim()) {
      Alert.alert("Required", "Enter an activity and its time.");
      return;
    }

    setSchedule((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        title: scheduleTitle.trim(),
        time: scheduleTime.trim(),
      },
    ]);

    setScheduleTitle("");
    setScheduleTime("");
  };

  const deleteSchedule = (id) => {
    setSchedule((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const Header = ({ title, subtitle }) => (
    <View style={styles.header}>
      <Text style={styles.logo}>StudyMate</Text>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );

  const PrimaryButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const EmptyMessage = ({ message }) => (
    <Text style={styles.empty}>{message}</Text>
  );

  const HomeScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header
        title="Hello, Student! 👋"
        subtitle="Let's make today productive."
      />

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to StudyMate!</Text>
        <Text style={styles.welcomeText}>
          Plan your school activities, organize your assignments,
          and achieve your academic goals.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Overview</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{subjects.length}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Study Progress</Text>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Task Completion</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>

        <Text style={styles.smallText}>
          {completedTasks} out of {tasks.length} tasks completed
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Upcoming Tasks</Text>

      {tasks.filter((task) => !task.completed).slice(0, 3).length === 0 ? (
        <EmptyMessage message="No pending tasks. Enjoy your free time!" />
      ) : (
        tasks
          .filter((task) => !task.completed)
          .slice(0, 3)
          .map((task) => (
            <View style={styles.itemCard} key={task.id}>
              <Text style={styles.itemTitle}>{task.title}</Text>
              <Text style={styles.smallText}>
                {task.subject} • {task.deadline}
              </Text>
            </View>
          ))
      )}
    </ScrollView>
  );

  const SubjectsScreen = () => (
    <ScrollView>
      <Header
        title="My Subjects"
        subtitle="Manage your school subjects."
      />

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Subject Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject name"
          value={subjectName}
          onChangeText={setSubjectName}
        />
        <PrimaryButton title="Add Subject" onPress={addSubject} />
      </View>

      <Text style={styles.sectionTitle}>Subject List</Text>

      {subjects.length === 0 ? (
        <EmptyMessage message="No subjects added yet." />
      ) : (
        subjects.map((subject) => (
          <View style={styles.itemCard} key={subject.id}>
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>{subject.name}</Text>
              <TouchableOpacity
                onPress={() => deleteSubject(subject.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const TasksScreen = () => (
    <ScrollView>
      <Header
        title="Assignments"
        subtitle="Keep track of your school activities."
      />

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Research Paper"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <Text style={styles.inputLabel}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Database Management"
          value={taskSubject}
          onChangeText={setTaskSubject}
        />

        <Text style={styles.inputLabel}>Deadline</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. November 25, 2026"
          value={taskDeadline}
          onChangeText={setTaskDeadline}
        />

        <PrimaryButton title="Add Task" onPress={addTask} />
      </View>

      <Text style={styles.sectionTitle}>My Tasks</Text>

      {tasks.length === 0 ? (
        <EmptyMessage message="No assignments yet. Add your first task!" />
      ) : (
        tasks.map((task) => (
          <View style={styles.itemCard} key={task.id}>
            <View style={styles.itemRow}>
              <TouchableOpacity
                style={styles.taskInfo}
                onPress={() => toggleTask(task.id)}
              >
                <Text
                  style={[
                    styles.itemTitle,
                    task.completed && styles.completedText,
                  ]}
                >
                  {task.completed ? "✓ " : "○ "}
                  {task.title}
                </Text>
                <Text style={styles.smallText}>
                  {task.subject} • {task.deadline}
                </Text>
                <Text style={styles.statusText}>
                  {task.completed ? "Completed" : "Pending"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const ScheduleScreen = () => (
    <ScrollView>
      <Header
        title="Study Schedule"
        subtitle="Organize your daily study activities."
      />

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Activity</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Review Mathematics"
          value={scheduleTitle}
          onChangeText={setScheduleTitle}
        />

        <Text style={styles.inputLabel}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8:00 AM - 9:00 AM"
          value={scheduleTime}
          onChangeText={setScheduleTime}
        />

        <PrimaryButton title="Add Schedule" onPress={addSchedule} />
      </View>

      <Text style={styles.sectionTitle}>My Schedule</Text>

      {schedule.length === 0 ? (
        <EmptyMessage message="No study schedule added yet." />
      ) : (
        schedule.map((item) => (
          <View style={styles.itemCard} key={item.id}>
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.smallText}>{item.time}</Text>
              </View>

              <TouchableOpacity
                onPress={() => deleteSchedule(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderScreen = () => {
    switch (screen) {
      case "Subjects":
        return SubjectsScreen();
      case "Tasks":
        return TasksScreen();
      case "Schedule":
        return ScheduleScreen();
      default:
        return HomeScreen();
    }
  };

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.logo}>StudyMate</Text>
        <Text style={styles.smallText}>Loading your study data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FC" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderScreen()}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { name: "Home", icon: "⌂" },
          { name: "Subjects", icon: "▤" },
          { name: "Tasks", icon: "✓" },
          { name: "Schedule", icon: "◷" },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => setScreen(item.name)}
          >
            <Text
              style={[
                styles.navIcon,
                screen === item.name && styles.activeNav,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                screen === item.name && styles.activeNav,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },
  header: {
    marginBottom: 22,
  },
  logo: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#356AE6",
    marginBottom: 18,
  },
  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#172B4D",
  },
  subtitle: {
    fontSize: 14,
    color: "#7B879B",
    marginTop: 6,
  },
  welcomeCard: {
    backgroundColor: "#356AE6",
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  welcomeText: {
    color: "#E9F0FF",
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172B4D",
    marginTop: 12,
    marginBottom: 14,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#356AE6",
  },
  statLabel: {
    fontSize: 11,
    color: "#7B879B",
    marginTop: 5,
    textAlign: "center",
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressLabel: {
    fontWeight: "600",
    color: "#172B4D",
  },
  progressPercent: {
    color: "#356AE6",
    fontWeight: "bold",
  },
  progressBackground: {
    height: 9,
    backgroundColor: "#E7ECF5",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#356AE6",
    borderRadius: 10,
  },
  smallText: {
    fontSize: 12,
    color: "#7B879B",
    marginTop: 7,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#344563",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F4F7FC",
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    marginBottom: 15,
    color: "#172B4D",
  },
  primaryButton: {
    backgroundColor: "#356AE6",
    padding: 15,
    borderRadius: 11,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 14,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#172B4D",
  },
  taskInfo: {
    flex: 1,
  },
  statusText: {
    color: "#356AE6",
    fontSize: 12,
    marginTop: 6,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#8A94A6",
  },
  deleteText: {
    color: "#E05252",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 10,
  },
  empty: {
    textAlign: "center",
    color: "#8A94A6",
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 14,
    fontSize: 13,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E9EDF4",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navIcon: {
    fontSize: 22,
    color: "#A0AABD",
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: "#A0AABD",
  },
  activeNav: {
    color: "#356AE6",
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
  },
});

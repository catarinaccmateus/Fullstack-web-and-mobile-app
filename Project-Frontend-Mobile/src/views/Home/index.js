import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import styles from "./styles";

// COMPONENTS
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
import TaskCard from "./../../components/TaskCard";

//API
import api from "./../../services/api";

export default function Home() {
  const [filter, setFilter] = useState("today");
  const [tasks, setTasks] = useState([]);
  const [load, setLoad] = useState(false);
  const [lateCount, setLateCount] = useState("");

  async function loadTasks() {
    setLoad(true);
    await api.get(`/task/filter/${filter}/11:11`).then((response) => {
      setTasks(response.data);
      setLoad(false);
    });
  }

  async function lateVerify() {
    setLoad(true);
    await api.get(`/task/filter/late/11:11`).then((response) => {
      setLateCount(response.data.length);
    });
  }

  function Notification() {
    setFilter("late");
  }

  useEffect(() => {
    loadTasks();
    lateVerify();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Header
        showNotification={true}
        showBack={false}
        pressNotification={Notification}
        late={lateCount}
      />

      <View style={styles.filter}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text
            style={
              filter === "all"
                ? styles.textActivated
                : styles.filtertextInactive
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("today")}>
          <Text
            style={
              filter === "today"
                ? styles.textActivated
                : styles.filtertextInactive
            }
          >
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("month")}>
          <Text
            style={
              filter === "month"
                ? styles.textActivated
                : styles.filtertextInactive
            }
          >
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("week")}>
          <Text
            style={
              filter === "week"
                ? styles.textActivated
                : styles.filtertextInactive
            }
          >
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("year")}>
          <Text
            style={
              filter === "year"
                ? styles.textActivated
                : styles.filtertextInactive
            }
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.title}>
        <Text style={styles.titleText}>
          {filter === "late" && "LATE "}TASKS
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {load ? (
          <ActivityIndicator color="#EE6B26" size={50} />
        ) : (
          tasks.map((task) => (
            <TaskCard
              done={task.done}
              when={task.when}
              title={task.title}
              type={task.type}
            />
          ))
        )}
      </ScrollView>

      <Footer icon={"add"} />
    </View>
  );
}

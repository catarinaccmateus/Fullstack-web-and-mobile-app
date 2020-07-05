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

//IMPORT EXPO NETWORK TO GET MAC-ADDRESS
import * as Network from "expo-network";

export default function Home({ navigation }) {
  const [filter, setFilter] = useState("today");
  const [tasks, setTasks] = useState([]);
  const [load, setLoad] = useState(false);
  const [lateCount, setLateCount] = useState("");
  const [macaddress, setMacaddress] = useState("");

  async function loadTasks() {
    setLoad(true);
    console.log("macaddess:« ", macaddress, "on load tasks");
    if (macaddress) {
      await api
        .get(`/task/filter/${filter}/${macaddress}`)
        .then((response) => {
          console.log("response", response.data);
          setTasks(response.data);
          setLoad(false);
        })
        .catch((Err) => {
          console.log("error loading tasks", Err);
        });
    }
  }

  async function lateVerify() {
    setLoad(true);
    console.log("late verify");
    await api.get(`/task/filter/late/${macaddress}`).then((response) => {
      console.log("RESPONSE", response.data);
      setLateCount(response.data.length);
    });
  }

  function Notification() {
    setFilter("late");
  }

  function New() {
    navigation.navigate("Task");
  }

  function Show(id) {
    navigation.navigate("Task", { taskId: id });
  }

  async function getMacAddress() {
    if (!macaddress) {
      const macaddress1 = await Network.getMacAddressAsync();
      await setMacaddress(macaddress1);
    }
  }

  useEffect(() => {
    getMacAddress().then(() => {
      loadTasks();
      lateVerify();
    });
  }, [filter, macaddress]);

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
              onPress={() => {
                Show(task._id);
              }}
            />
          ))
        )}
      </ScrollView>

      <Footer icon={"add"} onPress={New} />
    </View>
  );
}

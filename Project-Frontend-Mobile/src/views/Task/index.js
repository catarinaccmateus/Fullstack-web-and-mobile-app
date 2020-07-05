import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";

//Components
import Header from "./../../components/Header/index";
import Footer from "./../../components/Footer/index";
import typeIcons from "../../utils/typeIcons";
import DateTimeInput from "../../components/DateTimeInput/index";

import styles from "./styles";

//IMPORT API
import api from "./../../services/api";

//IMPORT EXPO NETWORK TO GET MAC-ADDRESS
import * as Network from "expo-network";

export default function Task({ navigation }) {
  const [id, setId] = useState();
  const [done, setDone] = useState(false);
  const [type, setType] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [macaddress, setMacaddress] = useState("");
  const [load, setLoad] = useState(true);

  //trying teacher's solution:
  const [when, setWhen] = useState();
  const [date, setDate] = useState();
  const [hour, setHour] = useState();

  //Creatin a new task
  async function SaveTak() {
    //Alert.alert(`${date}T${hour}.000, `);
    if (!type) return Alert.alert("Click in one type.");

    if (!title) return Alert.alert("Write one title.");

    if (!description) return Alert.alert("Write one description.");

    if (!date) return Alert.alert("Select one date.");

    if (!hour) return Alert.alert("Write one time.");

    if (id) {
      await api
        .put(`/task/${id}`, {
          macaddress,
          done,
          type,
          title,
          description,
          when: `${date}T${hour}.000`,
        })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      await api
        .post("/task", {
          macaddress,
          type,
          title,
          description,
          when: `${date}T${hour}.000`,
        })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }

  async function loadTask() {
    const task = await api.get(`/task/${id}`);
    setLoad(true);
    setDone(task.data.done);
    setTitle(task.data.title);
    setDescription(task.data.description);
    setDate(task.data.when);
    setHour(task.data.when);
    setType(task.data.type);
    setWhen(task.data.when);
  }

  //get macaddress
  async function getMacAddress() {
    await Network.getMacAddressAsync()
      .then((response) => {
        setMacaddress(response);
        setLoad(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  useEffect(() => {
    getMacAddress();
    if (id !== navigation.state.params) {
      //Added the id verification because setId doesn't change de id on time of the loadtask()
      setId(navigation.state.params.taskId);
      loadTask().then(() => setLoad(false));
    }
  }, [id]);

  return (
    <KeyboardAvoidingView behaviour="padding" style={styles.container}>
      <Header showBack={true} navigation={navigation} />
      {load ? (
        <ActivityIndicator
          color="#EE6B26"
          size={50}
          style={{ marginTop: 150 }}
        />
      ) : (
        <ScrollView style={{ width: "100%" }}>
          <ScrollView
            horizontal={true}
            showsVerticalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {typeIcons.map(
              (icon, index) =>
                icon !== null && (
                  <TouchableOpacity onPress={() => setType(index)} key={index}>
                    <Image
                      source={icon}
                      style={[
                        styles.imageIcon,
                        type && type !== index && styles.typeIconInactive,
                      ]}
                    />
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            maxLength={30}
            placeholder="Remind me"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={styles.inputarea}
            maxLength={200}
            multiline={true}
            placeholder="Details of the activity I need to remind myself."
            onChangeText={(text) => setDescription(text)}
            value={description}
          />

          <DateTimeInput save={setDate} when={when} />
          <DateTimeInput save={setHour} when={when} type={"time"} />

          {id && (
            <View style={styles.inLine}>
              <View style={styles.inputInLine}>
                <Switch
                  onValueChange={() => setDone(!done)}
                  value={done}
                  thumbColor={done ? "#00761b" : "#ee6b26"}
                />
                <Text style={styles.switchLabel}>Finish</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.removeLabel}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
      <Footer icon={"save"} onPress={SaveTak} />
    </KeyboardAvoidingView>
  );
}

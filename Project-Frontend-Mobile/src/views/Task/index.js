import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Switch,
} from "react-native";

//Components
import Header from "./../../components/Header/index";
import Footer from "./../../components/Footer/index";
import typeIcons from "../../utils/typeIcons";

import styles from "./styles";

export default function Task() {
  const [done, setDone] = useState(false);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Header showBack={true} />
      <ScrollView style={{ width: "100%" }}>
        <ScrollView
          horizontal={true}
          showsVerticalScrollIndicator={false}
          style={{ marginVertical: 10 }}
        >
          {typeIcons.map(
            (icon) =>
              icon !== null && (
                <TouchableOpacity>
                  <Image source={icon} style={styles.imageIcon} />
                </TouchableOpacity>
              )
          )}
        </ScrollView>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Remind me"
        />
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={styles.inputarea}
          maxLength={200}
          multiline={true}
          placeholder="Details of the activity I need to remind myself."
        />
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
      </ScrollView>
      <Footer icon={"save"} />
    </KeyboardAvoidingView>
  );
}

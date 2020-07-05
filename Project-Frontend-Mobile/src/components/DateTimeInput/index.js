import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  TextInput,
  View,
  Image,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import S from "./styles";

const DATE = "date";
const TIME = "time";
const CALENDAR = "calendar";
const CLOCK = "clock";
const DATE_FORMAT_TO_USER = "dd / MM / yyyy";
const DATE_FORMAT_TO_MONGODB = "yyyy-MM-dd";
const TIME_FORMAT_TO_USER = "HH:mm";
const TIME_FORMAT_TO_MONGODB = "HH:mm:ss";

import iconCalendar from "./../../assets/calendar.png";
import iconClock from "./../../assets/clock.png";

/**g
 * Apresentar calendario ou hora
 * @param {type} type = DATE apresenta o calendario
 * @param {type} type = TIME apresenta o picker do relogio
 */

export default function DateTimeInput({ type = DATE, save, when }) {
  const [dateTime, setDateTime] = useState();
  const [date, setDate] = useState(new Date());
  const [dateHasSelected, setDateHasSelected] = useState(false);
  const [show, setShow] = useState(false);

  function selectDate() {
    setDateTime(format(new Date(date), DATE_FORMAT_TO_USER));
    save(format(new Date(date), DATE_FORMAT_TO_MONGODB));
  }

  function selectTime() {
    setDateTime(format(new Date(date), TIME_FORMAT_TO_USER));
    save(format(new Date(date), TIME_FORMAT_TO_MONGODB));
  }

  function showPicker() {
    setShow(true);
  }

  const isShowDate = () => {
    return type === DATE;
  };

  const onChange = (event, selectedDate) => {
    setShow(false);

    if (!selectedDate) {
      return;
    }

    const currentDate = new Date();
    if (new Date(selectedDate.getTime() + 5 * 60000) < currentDate) {
      //I am adding 5 minutes since some watches may have some minutes of difference.
      return Alert.alert("You cant select a time in the past");
    }

    setDateHasSelected(true);
    setDate(selectedDate);
  };

  const applyValueSelected = () => {
    if (isShowDate()) {
      selectDate();
    } else {
      selectTime();
    }
  };

  function setDateTimeFromTaskToEdit() {
    if (isShowDate()) {
      //If it is a date, we transform the time in date.
      setDateTime(format(new Date(when), DATE_FORMAT_TO_USER));
      save(format(new Date(when), DATE_FORMAT_TO_MONGODB));
    } else {
      //If it is an hour, we transform the time in hour.
      setDateTime(format(new Date(when), TIME_FORMAT_TO_USER));
      save(format(new Date(when), TIME_FORMAT_TO_MONGODB));
    }
  }

  _renderDateTimePicker = () => {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          textColor="#20295F"
          value={date}
          mode={isShowDate() ? DATE : TIME}
          is24Hour={true}
          display={isShowDate() ? CALENDAR : CLOCK}
          onChange={onChange}
          minimumDate={new Date()}
        />
      </View>
    );
  };

  useEffect(() => {
    setShow(Platform.OS === "ios");
    when && setDateTimeFromTaskToEdit();
    dateHasSelected && applyValueSelected();
  }, [when, date]);

  return Platform.OS === "ios" ? (
    <View style={S.content}>
      {show && _renderDateTimePicker()}
      <Image
        style={S.iconTextInput}
        source={type === "date" ? iconCalendar : iconClock}
      />
    </View>
  ) : (
    <TouchableOpacity onPress={showPicker} style={S.content}>
      {show && _renderDateTimePicker()}
      <TextInput
        style={S.input}
        placeholder={isShowDate() ? "Which day?" : "Which time?"}
        editable={false}
        value={dateTime}
      />
      <Image
        style={S.iconTextInput}
        source={type === "date" ? iconCalendar : iconClock}
      />
    </TouchableOpacity>
  );
}
/*

export default function DateTimeInputAndroid({ type }) {
  const [datetime, setDateTime] = useState(new Date());
  const [mode, setMode] = useState(type);
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    console.log("pressed");
    setShow(true);
    setMode(currentMode);
  };

  setDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDateTime(currentDate);
    console.log("done", datetime);
  };

  return (
    <TouchableOpacity onPress={showMode}>
      <TextInput
        placeholder={type === "date" ? "Select date" : "Select Time"}
        style={styles.input}
        //with editable false, can't edit this component, only click
        editable={false}
        value={datetime}
      />
      <Image
        style={styles.iconTextInput}
        source={type === "date" ? iconCalendar : iconClock}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datetime}
          mode={mode}
          is24Hour={true}
          display={type === "date" ? "calendar" : "clock"}
          onChange={setDate}
        />
      )}
    </TouchableOpacity>
  );
}

*/

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EE6B26",
    marginVertical: 20,
  },

  input: {
    fontSize: 18,
  },
  iconTextInput: {
    position: "absolute",
    left: "95%",
    top: 0,
    width: 25,
    height: 25,
    resizeMode: "contain",
    backgroundColor: "white",
  },
});

export default styles;

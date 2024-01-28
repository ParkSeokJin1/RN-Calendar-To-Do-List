import { TextInput, TouchableOpacity, View } from "react-native";
import { ITEM_WIDTH, bottomSpace } from "./util";
import { AntDesign } from "@expo/vector-icons";

const AddTodoInput = ({
  value,
  onChangeText,
  placeholder,
  onPressAdd,
  onSubmitEditing,
  onFocus,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: ITEM_WIDTH,
        alignSelf: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1, padding: 5, color: "#595959" }}
        placeholder={placeholder}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
        onFocus={onFocus}
      />
      <TouchableOpacity onPress={onPressAdd} style={{ padding: 15 }}>
        <AntDesign name="plus" size={18} color="#595959" />
      </TouchableOpacity>
    </View>
  );
};

export default AddTodoInput;

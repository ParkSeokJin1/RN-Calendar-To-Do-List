import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable, // 키보드를 피해야할때 감싸준다.
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { bottomSpace, getCalendarColumns } from "./src/util";
import Margin from "./src/Margin";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCalendar } from "./src/hook/use-calendar";
import { useTodoList } from "./src/hook/use-todo-list";
import Calendar from "./src/Calendar";
import AddTodoInput from "./src/AddTodoinput";

const statusBarHeight = getStatusBarHeight(true);

export default function App() {
  const now = dayjs();
  const flatListRef = useRef(null);
  const {
    selectedDate,
    isDatePickerVisible,
    setSelectedDate,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  } = useCalendar(now);
  const {
    filteredTodoList,
    todoList,
    input,
    setInput,
    toggleTodo,
    removeTodo,
    addTodo,
    resetInput,
  } = useTodoList(selectedDate);

  const columns = getCalendarColumns(selectedDate);

  const onPressLeftArrow = subtract1Month;
  const onPressHeaderDate = showDatePicker;
  const onPressRightArrow = add1Month;
  const onPressDate = setSelectedDate;

  const ListHeaderComponent = () => {
    return (
      <View>
        <Calendar
          todoList={todoList}
          columns={columns}
          selectedDate={selectedDate}
          onPressLeftArrow={onPressLeftArrow}
          onPressHeaderDate={onPressHeaderDate}
          onPressRightArrow={onPressRightArrow}
          onPressDate={onPressDate}
        />
        <Margin height={15} />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 4 / 2,
            alignSelf: "center",
            backgroundColor: "#a3a3a3",
          }}
        />
        <Margin height={15} />
      </View>
    );
  };

  const renderItem = ({ item: todo }) => {
    const isSuccess = todo.isSuccess;
    const onPress = () => {
      toggleTodo(todo.id);
    };
    // onLongPress 꾹 눌렀을때 알람창이 뜨도록
    const onLongPress = () => {
      // 삭제 하기전에 알람창 띄우기
      Alert.alert("삭제하겠어요?", "", [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => removeTodo(todo.id),
        },
      ]);
    };
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flexDirection: "row",
          width: 220,
          alignSelf: "center",
          paddingHorizontal: 5,
          paddingVertical: 10,
          borderBottomWidth: 0.2,
          borderColor: "#a6a6a6",
        }}
      >
        <Text style={{ fontSize: 14, color: "#595959", flex: 1 }}>
          {todo.content}
        </Text>

        <Ionicons
          name="checkmark-outline"
          size={17}
          color={isSuccess ? "green" : "#bfbfbf"}
        />
      </Pressable>
    );
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 300);
  };

  const onPressAdd = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  // 키보드에서 submit 버튼(엔터를 눌렀을때) 실행되는 함수
  const onSubmitEditing = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onFocus = () => {
    scrollToEnd();
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <Image
        source={{
          // 출처: https://kr.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1189772.htm
          uri: "https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c",
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <>
          <FlatList
            data={filteredTodoList}
            contentContainerStyle={{ paddingTop: statusBarHeight + 30 }}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={renderItem}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
          />

          <AddTodoInput
            value={input}
            onChangeText={setInput}
            placeholder={`${dayjs(selectedDate).format("MM.D")}에 추가할 투두`}
            onPressAdd={onPressAdd}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
          />
        </>
      </KeyboardAvoidingView>

      <Margin height={bottomSpace} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultTodoList = [
  // {
  //   id: 1,
  //   content: "운동하기",
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 2,
  //   content: "공부하기",
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 3,
  //   content: "RN 강의 수강하기",
  //   date: dayjs(),
  //   isSuccess: true,
  // },
];

const TODO_LIST_KEY = "TODO_LIST_KEY";

export const useTodoList = (selectedDate) => {
  // 특정 날짜에 할일을 추가 하기
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const len = todoList.length; // 3
    const lastId = len === 0 ? 0 : todoList[len - 1].id;

    // 기존의 todo에서 하나를 더 푸시
    const newTodoList = [
      ...todoList,
      {
        id: lastId + 1,
        content: input,
        date: selectedDate,
        isSuccess: false,
      },
    ];
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList)); // 꼭 stringify 해서 문자열로 저장해야 함.
  };

  // todo 삭제하는 로직
  const removeTodo = (todoId) => {
    // id가 동일한걸 삭제해야 하므로 다른것만 필터링 해준다.
    const newTodoList = todoList.filter((todo) => todo.id !== todoId);
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList)); // 꼭 stringify 해서 문자열로 저장해야 함.
  };

  // todo 성공,실패 처리 하는 로직
  const toggleTodo = (todoId) => {
    // 투두리스트에 배열은 바뀌지 않는데 특정 success 유무만 바뀐다.
    const newTodoList = todoList.map((todo) => {
      if (todo.id !== todoId) return todo;
      return {
        ...todo,
        isSuccess: !todo.isSuccess,
      };
    });
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList)); // 꼭 stringify 해서 문자열로 저장해야 함.
  };

  const resetInput = () => setInput("");

  //최종적으로 필터된 투두리스트
  const filteredTodoList = todoList.filter((todo) => {
    const isSameDate = dayjs(todo.date).isSame(selectedDate, "date");
    return isSameDate;
  });

  const init = async () => {
    const result = await AsyncStorage.getItem(TODO_LIST_KEY);

    if (result) {
      // string화 된 데이터를 다시한번 파싱해줘야 한다.
      const newTodoList = JSON.parse(result);
      setTodoList(newTodoList);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return {
    filteredTodoList,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
    todoList,
  };
};

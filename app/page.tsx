"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          TODOリスト
        </h1>

        {/* 入力エリア */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            追加
          </button>
        </div>

        {/* TODOリスト */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              タスクがありません。新しいタスクを追加してください。
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>

        {/* 統計 */}
        {todos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>合計: {todos.length}個</span>
              <span>完了: {todos.filter((t) => t.completed).length}個</span>
              <span>未完了: {todos.filter((t) => !t.completed).length}個</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

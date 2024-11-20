import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState(""); // Current input value
  const [todos, setTodos] = useState([]); // List of todos
  const [showFinished, setShowFinished] = useState(true); // Toggle visibility of completed todos
  const [editId, setEditId] = useState(null); // ID of the todo being edited

  // Load todos from LocalStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to LocalStorage whenever `todos` state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Handle adding or updating a todo
  const handleAddOrUpdate = () => {
    if (todo.trim().length > 3) {
      if (editId) {
        // Update an existing todo
        const updatedTodos = todos.map((item) =>
          item.id === editId ? { ...item, todo: todo.trim() } : item
        );
        setTodos(updatedTodos);
        setEditId(null); // Clear edit mode
      } else {
        // Add a new todo
        const newTodo = { id: uuidv4(), todo: todo.trim(), isCompleted: false };
        setTodos([...todos, newTodo]);
      }
      setTodo(""); // Clear input after adding/updating
    }
  };

  // Handle editing a todo
  const handleEdit = (id) => {
    const todoToEdit = todos.find((item) => item.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.todo); // Populate input with existing value
      setEditId(id); // Set the edit mode with the ID
    }
  };

  // Handle deleting a todo
  const handleDelete = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  // Handle toggling the completion status of a todo
  const handleCheckbox = (id) => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  // Toggle visibility of completed todos
  const toggleFinished = () => {
    setShowFinished((prev) => !prev);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>

        {/* Add or Update Todo Section */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            {editId ? "Edit Todo" : "Add a Todo"}
          </h2>
          <div className="flex">
            <input
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
              type="text"
              placeholder="Enter your todo"
              className="w-full rounded-full px-5 py-1"
            />
            <button
              onClick={handleAddOrUpdate}
              disabled={todo.trim().length <= 3}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              {editId ? "Update" : "Save"}
            </button>
          </div>
          {todo.trim().length <= 3 && todo.length > 0 && (
            <p className="text-red-500 text-sm">
              Todo must be at least 4 characters long.
            </p>
          )}
        </div>

        {/* Toggle Finished Todos */}
        <div className="flex items-center">
          <input
            className="my-4"
            id="show"
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
          />
          <label className="mx-2" htmlFor="show">
            Show Finished
          </label>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>

        {/* Display Todos */}
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}
          {todos
            .filter((item) => showFinished || !item.isCompleted)
            .map((item) => (
              <div
                key={item.id}
                className="todo flex my-3 justify-between items-center"
              >
                <div className="flex gap-5 items-center">
                  <input
                    name={item.id}
                    onChange={() => handleCheckbox(item.id)}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div
                    className={`${
                      item.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.todo}
                  </div>
                </div>
                <div className="buttons flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
                    title="Edit Todo"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
                    title="Delete Todo"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;

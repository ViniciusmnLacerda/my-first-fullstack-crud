import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import './App.css';


function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState()
  async function getTodos() {
    const response = await axios.get('http://localhost:3333/todos');
    setTodos(response.data)
  }

  async function handleWithNewButton() {
    setInputVisibility(!inputVisibility);
  }

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
    
  }

  async function createTodo() {
    await axios.post('http://localhost:3333/todos', {name: inputValue})
    getTodos()
    setInputVisibility(!inputVisibility);
    setInputValue('');
  }

  async function deleteTodo(todo) {
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();
  }

  async function editTodo() {
    await axios.put('http://localhost:3333/todos', {
      id: selectedTodo.id,
      name: inputValue,
    });
    setInputVisibility(false);
    setSelectedTodo();
    setInputValue('');
    getTodos();
  }

  async function modifyStatusTodo(todo) {
    await axios.put('http://localhost:3333/todos',{
      id: todo.id,
      status: !todo.status,
    });
    getTodos();
  }

  const Todos = ({ todos }) => {
    return (
      <div>
        {todos.map((todo, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => modifyStatusTodo(todo)}
              >
                {todo.status ? "CONCLUIDA" : "NÃO CONCLUIDA"}
              </button>
              <p>{todo.name}</p>
              <button
                onClick={() => handleWithEditButtonClick(todo)}
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={ () => deleteTodo(todo) }
              >
                <AiOutlineDelete />
              </button>
            </div>
          );
        })}
      </div>
    )
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <header>
        <div>
          <h1>Dont bem lazzy</h1>
        </div>
        <Todos todos={todos}/>
        <input
          value={inputValue}
          style={{ display: inputVisibility ? "block" : "none" }}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <button
          onClick={ inputVisibility ? selectedTodo ? editTodo : createTodo : handleWithNewButton}
        >
         {inputVisibility ? "Confirm" : "+ New task"}
        </button>
      </header>
    </div>
  );
}

export default App;

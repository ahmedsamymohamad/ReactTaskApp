import { useState, useEffect, useContext } from "react";
import TaskModal from '../components/TaskModal';
import AuthContext from "../context/AuthContext";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [openTask, setOpenTask] = useState(false);
  const [action, setAction] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);  
  const { authTokens, logoutUser, user } = useContext(AuthContext);

  useEffect(() => {
    getTasks();
    console.log("user",user)
  }, []);

  const getTasks = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setTasks(data);
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const updateTask = async (id, updatedTask) => {
    let response = await fetch(`http://127.0.0.1:8000/api/task/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(updatedTask)
    });
    let data = await response.json();

    if (response.status === 200) {
      setTasks(tasks.map(task => (task.id === id ? data : task)));
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const handleClick = (action, taskId) => {
    setOpenTask(true);
    setAction(action);
    setSelectedTaskId(taskId);
  };

  const handleCheckboxClick = (taskId, completed) => {
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      updateTask(taskId, { ...updatedTask, completed });
    }
  };

  return (
    <>


      <ul role="list" className="divide-y divide-gray-100">
        <div className="flex flex-wrap justify-between p-3">
        <button
          onClick={() => handleClick("create")}
          type="button"
          className="inline-flex my-4 w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          New Task
        </button>
        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title"> Welcom {user.username} </h3>
        <button
          onClick={logoutUser}
          type="button"
          className="inline-flex my-4  w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
        >
          Logout
        </button>
        </div>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between gap-x-6 px-4 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{task.title}</p>
                <div className="flex items-center mb-4">
                  <input
                    id={`checkbox-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleCheckboxClick(task.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-${task.id}`}
                    className="ms-2 text-sm font-light text-gray-900 dark:text-gray-200"
                  >
                    Done
                  </label>
                </div>
              </div>
            </div>
            <div>
           <button
              onClick={() => handleClick("update", task.id)}
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            >
              Update
            </button>
            <button
              onClick={() => handleClick("delete", task.id)}
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Delete
            </button>
            </div>

          </li>
        ))}
      </ul>
      {openTask && (
        <TaskModal
          action={action}
          id={selectedTaskId}
          setOpenTask={setOpenTask}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
    </>
  );
}

export default Tasks;

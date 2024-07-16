import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

function TaskModal({ action, id, setOpenTask }) {
  const [task, setTask] = useState({ title: "", description: "", completed: false });
  const { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if (action === "update" && id) {
      getTask(id);
    }
  }, [action, id]);

  const getTask = async (id) => {
    let response = await fetch(`http://127.0.0.1:8000/api/task/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setTask(data);
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const deleteTask = async (id) => {
    let response = await fetch(`http://127.0.0.1:8000/api/task/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    });

    if (response.status === 204) { // No Content
      setOpenTask(false);
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const updateTask = async (id) => {
    let response = await fetch(`http://127.0.0.1:8000/api/task/${id}/`, {
      method: 'PUT', // use PUT instead of POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(task)
    });

    if (response.status === 200) {
      setOpenTask(false);
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const createTask = async (e) => {
    let response = await fetch(`http://127.0.0.1:8000/api/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify(task)
    });

    if (response.status === 201) { // use 201 instead of 200
      setOpenTask(false);
      
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  };

  const handleSubmit = (e) => {
    if (action === "delete") {
      deleteTask(id);
    } else if (action === "update") {
      updateTask(id);
    } else if (action === "create") {
      createTask(e);
    }
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <form onSubmit={handleSubmit}>
                {action === "delete" ? (
                  <>
                    <div className="mt-3 text-center mx-auto sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Are you sure you want to delete this task?</h3>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 text-center mx-auto sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{action === "update" ? "Update task" : "Create task"}</h3>
                    </div>
                    <div className="mt-2">
                      <input
                        placeholder="Title"
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                        className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-2">
                      <textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        id="description"
                        className="block p-2.5 px-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Write description here..."
                      ></textarea>
                    </div>
                  </>
                )}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpenTask(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;

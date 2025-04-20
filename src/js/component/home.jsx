import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo/users/dpatel";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [input, setInput] = useState("");


	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = () => {
		fetch(API_URL)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data.todos)) {
					setTasks(data.todos);
				}
			})	
			.catch((err) => console.error("Failed to load tasks:", err));
	};


	const addTask = (e) => {
		if (e.key === "Enter" && input.trim()) {
			const newTask = { label: input, is_done: false };

			fetch(`https://playground.4geeks.com/todo/todos/dpatel` ,{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTask),
			})
				.then((res) => res.json())
				.then(() => {
					setInput("");
					fetchTasks();
				})
				.catch((err) => console.error("Failed to add task:", err));
		}
	};


	const deleteTask = (taskId) => {
		fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
			method: "DELETE",
		})
			.then((res) => {
				if (res.ok) fetchTasks();
			})
			.catch((err) => console.error("Failed to delete task:", err));
	};
	
	
	const clearAllTasks = () => {
		fetch(API_URL, { method: "DELETE" })
			.then((res) => {
				if (!res.ok) throw new Error("Delete failed");
				return new Promise((resolve) => setTimeout(resolve, 1000));
			})
			.then(() => 
				fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
				})
			)
			.then((res) => {
				if (!res.ok) throw new Error("Recreate failed");
				return res.json();
			})
			.then(() => {
				setTasks([]);
			})
			.catch((err) => console.error("Reset error:", err));
	};


	return (
		<div className="container mt-5">
			<h1 className="text-center mb-4">To-Do List</h1>
			<div className="card shadow-sm">
				<div className="card-body">
					<input
						type="text"
						className="form-control mb-3"
						placeholder="what needs to be done?"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={addTask}
						autoFocus
					/>
					<ul className="list-group">
						{tasks. length === 0 ? (
							<li className="list-group-item text-center text-muted">
								No tasks, add one above.
							</li>
						) : (
							tasks.map((task) => (
								<li
									key={task.id}
									className="list-group-item d-flex justify-content-between align-items-center"
								>
									{task.label}
									<button
										className="btn btn-sm btn-danger"
										onClick={() => deleteTask(task.id)}
									>
										🗑
									</button>
								</li>
							))
						)}
					</ul>
					<div className="text-end mt-3">
						<span className="me-3">
							<strong>{tasks.length}</strong>{" "}
							{tasks.length === 1 ? "task" : "tasks"} remaining
						</span>
						<button className="btn btn-warning" onClick={clearAllTasks}>
							Clear All Tasks
						</button>
					</div>
				</div>
			</div>
		</div>
	)

}

export default Home;

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

}

export default Home;

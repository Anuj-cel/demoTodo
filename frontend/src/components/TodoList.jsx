import { useState, useEffect } from "react";
import { io } from "socket.io-client"
const socket = io("http://localhost:3000");
const TodoList = () => {

    const [l1, setNewl1] = useState("");
    const [taskList, setTaskList] = useState([]);
    useEffect(() => {
        const getList = async () => {
            let list = await fetch("http://localhost:3000/todos");
            list = await list.json();
            console.log("This is allTasks ", list)
            setTaskList(list);
        }
        getList();
        socket.on("task", (newTask) => {
            setTaskList(prev => [...prev, newTask]);
        });
        return () => {
            socket.off("task");
        }
    }, [])
    const sendTask = async () => {
        let newTask = {
            completed: "false",
            task: l1
        };
        console.log(newTask);
        try {
            let res = await fetch("http://localhost:3000/todos", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newTask)
            });
            let data = res.json();
            console.log("This is response ", data);
        } catch (err) {
            console.log("This is error from react ", err);
        }

    }
    return (
        <div>
            <h3><u>This is TodoList</u></h3>
            {
                taskList.map((data, ind) => <p>{ind + 1}: {data.task}  <input type="checkbox" /></p>)
            }
            <input type="text" name="listItem" onChange={(event) => setNewl1(event.target.value)} />
            <button onClick={sendTask}>Add</button>
        </div>
    )
}
export default TodoList;

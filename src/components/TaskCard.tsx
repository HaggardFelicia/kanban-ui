import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Id, Task } from "../types";

interface Props{
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id:Id, content:string)=>void;
}

function TaskCard({task, deleteTask, updateTask}:Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
const [editMode, setEditMode] = useState(false );

const toggleEditMode = () =>{
  setEditMode((prev)=>!prev);
  setMouseIsOver(false);
}

if(editMode){
  return (
    <div 
      className="taskContainer">
        <textarea 
          className="taskCardTextarea"
          value={task.content}
          autoFocus
          placeholder="Task Content Here..."
          onBlur={toggleEditMode}
          onKeyDown={e=>{
            if(e.key=== "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={e=> updateTask(task.id, e.target.value)}
        >
        </textarea>
    </div>
  )
}

  return (
    <div 
      className="taskContainer"
      onMouseEnter={()=>{
        setMouseIsOver(true);
      }}
      onMouseLeave={()=>{
        setMouseIsOver(false);
      }}
      onClick={toggleEditMode}
      >
        <p className="taskContent">
          {task.content}
        </p>
        {mouseIsOver && <button 
          className="deleteTaskBtn"
          onClick={()=>{
            deleteTask(task.id)
          }}
        >
            <DeleteIcon/>
        </button>}
        
    </div>
  )
}

export default TaskCard
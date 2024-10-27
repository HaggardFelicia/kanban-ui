import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Id, Task } from "../types";

interface Props{
    task: Task;
    deleteTask: (id: Id) => void;
}

function TaskCard({task, deleteTask}:Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  return (
    <div 
      className="taskContainer"
      onMouseEnter={()=>{
        setMouseIsOver(true);
      }}
      onMouseLeave={()=>{
        setMouseIsOver(false);
      }}
      >
        {task.content}
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
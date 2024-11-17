import { useMemo, useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id, Task } from '../types';
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities'
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

/**----------------------
 **      props
 *------------------------**/
interface Props {
    column: Column;
    deleteColumn: (id:Id)=>void; 
    updateColumn: (id: Id, title:string)=>void;

    createTask: (columnId:Id)=>void;
    deleteTask: (id:Id)=>void;
    updateTask: (id:Id, content:string)=>void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const {
        column, 
        deleteColumn, 
        updateColumn, 
        createTask, 
        tasks, 
        deleteTask, 
        updateTask} = props;

    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(()=>{
        return tasks.map(task=>task.id);
    },[tasks]);

    // making it draggable
    const {
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging}=useSortable({
        id:column.id,
        data:{
            type: 'column',
            column
        },
        disabled: editMode,
    });

    // style for drag effects
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // if is dragging set ref and style
    if(isDragging){
        return (
            <div 
                ref={setNodeRef}
                style={style}
                className="columns movingColumn"
            ></div>
        )
    }

  return (
    <div 
    ref={setNodeRef}
    style={style}
    className="columns">
        {/* column title */}
        <div 
            {...attributes}
            {...listeners}
            onClick={()=>{
                setEditMode(true);
            }}
            className="columnTitleContainer">
            {/* number of tasks */}
            <div className="numTaskContainer">0</div>
            {!editMode && column.title}
            {editMode && <input
                value={column.title}
                onChange={(e)=> updateColumn(column.id, e.target.value)}
                className="titleInput"
                autoFocus
                onBlur={()=>{
                    setEditMode(false);
                }}
                onKeyDown={(e)=>{
                    if(e.key !== "Enter") return;
                    setEditMode(false);
                }}
            />}
            <button 
            className="deleteColumnBtn"
            onClick={()=>{
                deleteColumn(column.id);
            }}><DeleteIcon/></button>
        </div>
        {/* column task container */}
        <div className="tasksContentContainer">
            <SortableContext items={tasksIds}>
            {tasks.map((task)=>(
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    deleteTask={deleteTask}
                    updateTask={updateTask}/>
            ))}
            </SortableContext>

        </div>
        {/* column footer */}
        <button 
            className="addTaskBtn"
            onClick={()=>{
                createTask(column.id);
            }}
        >
            <PlusIcon/>
            Add Task
        </button>
    </div>
  )
}

export default ColumnContainer;
import { useMemo, useState } from 'react';
import PlusIcon from '../icons/PlusIcon'
import '../index.css'
import { Column, Id, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';

function KanbanBoard() {
    /**----------------------
     **      state
     *------------------------**/
        // columns
        const [columns, setColumns]= useState<Column[]>([]);
        const [activeColumn, setActiveColumn] = useState<Column|null>(null);
        const [activeTask, setActiveTask] = useState<Task|null>(null);
        // tasks
        const [tasks, setTasks]= useState<Task[]>([]);
    /**----------------------
     **      memo
     *------------------------**/
        const columnsId = useMemo(()=> columns.map((col)=>col.id),[columns])
        // console.log(columns);

    // sensors (makes the delete button usable)
    const sensors= useSensors(
        useSensor(PointerSensor,{
            activationConstraint: {
                distance: 3, //3px
            }
        })
    )
    {console.log(tasks)}

  return (
    <div className='container'>
        <DndContext 
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
            <div className='m-auto flex gap-4'>
                {/* show colums */}
                <div className='columnContainer'>
                    <SortableContext items={columnsId}>
                        {columns.map((col)=>(
                            <div>
                                <ColumnContainer 
                                key={col.id}
                                column={col} 
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                // Showing tasks
                                tasks={tasks.filter((task)=>task.columnId === col.id)}
                                />
                            </div>
                        ))}
                    </SortableContext>
                </div>
                <button className='createNewColBtn' onClick={()=>{
                    createNewColumn();
                }}><PlusIcon/> Add Column</button>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                            createTask={createTask} 
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter((task)=>task.columnId === activeColumn.id)}
                            />
                    )}
                    {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>
                    }
                </DragOverlay>,
                document.body
           )}
        </DndContext>
    </div>
  )
  
    /**----------------------
    **      functions
    *------------------------**/
        // createNewColumn
        function createNewColumn(){
            // column to add
            const columnToAdd: Column ={
                id: generateId(),
                title: `Column ${columns.length + 1}`
            }
            // update state
            setColumns([...columns, columnToAdd]);
        }
        // generateId
        function generateId(){
            return Math.floor(Math.random()*100001)
        }
        // deleteColumn
        function deleteColumn(id:Id){
            // filter columns by id
            const filteredCols = columns.filter((col)=> col.id !==id);
            setColumns(filteredCols);

            const newTasks= tasks.filter((t)=>t.columnId!==id);
            setTasks(newTasks);
        }
        // updateColumn
        function updateColumn(id:Id, title: string){
            const newColumns = columns.map((col)=>{
                if (col.id !== id) return col;
                return {...col, title};
            })
            setColumns(newColumns);
        }
        // createTask
        function createTask(columnId:Id){
            const newTask: Task={
                id: generateId(),
                columnId,
                content: `Task ${tasks.length +1}`
            };

            setTasks([...tasks , newTask]);
        }
        // deleteTask
        function deleteTask(id:Id){
            const newTasks = tasks.filter((task)=> task.id !== id);
            setTasks(newTasks);

        }
        // updateTask
        function updateTask(id:Id, content:string){
            const newTasks = tasks.map((task)=>{
                if(task.id !== id) return task;
                return {...task, content};
            });
            setTasks(newTasks);
        }
        // onDragStart
        function onDragStart(event: DragStartEvent){
            console.log("Drag Start", event);
            if (event.active.data.current?.type === "Column"){
                setActiveColumn(event.active.data.current.Column);
                return;
            }
            if (event.active.data.current?.type === "Task"){
                setActiveTask(event.active.data.current.task);
                return;
            }
        }
        //onDragEnd
        function onDragEnd(event: DragEndEvent){
            setActiveColumn(null);
            setActiveTask(null);
            
            const {active, over} = event;
            if(!over) return; 

            const activeColumnId= active.id;
            const overColumnId=over.id;

            if(activeColumnId === overColumnId) return;

            // swap 
            setColumns(columns=>{
                const activeColumnIndex = columns.findIndex(col=>col.id===activeColumnId);
                const overColumnIndex= columns.findIndex((col)=>col.id===overColumnId)
                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            })
        }
        // onDragOver
        function onDragOver(event: DragOverEvent){
            const {active, over} =event;
            if (!over) return;

            const activeId= active.id;
            const overId=over.id;

            if(activeId === overId) return;

            const isActiveATask = active.data.current?.type ==="Task";
            const isOverATask = over.data.current?.type ==="Task";

            // drop a task over another task
            if(isActiveATask && isOverATask){
                setTasks((tasks)=>{
                    const activeIndex = tasks.findIndex((t)=>t.id ===activeId);
                    const overIndex = tasks.findIndex((t)=>t.id===overId);
        
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;

                    return arrayMove(tasks, activeIndex, overIndex);
                });
            }
            // drop a task over a column
            const isOVerAColumn = over.data.current?.type==="Column";

            if(isActiveATask && isOVerAColumn){
                setTasks((tasks)=>{
                    const activeIndex = tasks.findIndex((t)=>t.id ===activeId);
        
                    tasks[activeIndex].columnId = overId;

                    return arrayMove(tasks, activeIndex, activeIndex);
                });
            }
        }
}

export default KanbanBoard;
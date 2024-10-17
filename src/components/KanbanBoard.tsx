import { useMemo, useState } from 'react';
import PlusIcon from '../icons/PlusIcon'
import '../index.css'
import { Column, Id } from '../types';
import ColumnContainer from './columnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

function KanbanBoard() {
    /**----------------------
     **      state
     *------------------------**/
    const [columns, setColumns]= useState<Column[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column|null>(null);
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
  return (
    <div className='container'>
        <DndContext 
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}>
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
                                updateColumn={updateColumn}/>
                            </div>
                        ))}
                    </SortableContext>
                </div>
                <button className='button' onClick={()=>{
                    createNewColumn();
                }}><PlusIcon/> Add Column</button>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                        />
                    )}
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
        }
        // updateColumn
        function updateColumn(id:Id, title: string){
            const newColumns = columns.map((col)=>{
                if (col.id !== id) return col;
                return {...col, title};
            })
            setColumns(newColumns);
        }
        // onDragStart
        function onDragStart(event: DragStartEvent){
            console.log("Drag Start", event);
            if (event.active.data.current?.type === "Column"){
                setActiveColumn(event.active.data.current.Column);
                return;
            }
        }
        //onDragEnd
        function onDragEnd(event: DragEndEvent){
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
}

export default KanbanBoard;
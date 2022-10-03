import Tod from "./Tod"
import Divider from "@mui/material/Divider"
import { Draggable } from "react-beautiful-dnd"

export default function TodoContainer({
    todos,
    listFunctions,
    // ...props
}) {
    return (
        <>
            {todos.map((item, index) => (
                <Draggable
                    draggableId={item.uuid.toString()}
                    key={item.uuid.toString()}
                    index={index}
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <Tod
                                index={index}
                                item={item.todoText}
                                uuid={item.uuid}
                                isHidden={item.isHidden}
                                isComplete={item.isComplete}
                                listFunctions={listFunctions}
                            />
                            <Divider />
                        </div>
                    )}
                </Draggable>
            ))}
        </>
    )
}

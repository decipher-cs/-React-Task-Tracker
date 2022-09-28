import { useState, useEffect } from "react"
import TodCreator from "./TodCreator"
import TodoContainer from "./TodoContainer"
import { v4 as uuidv4 } from "uuid"
import UtilityBar from "./UtilityBar"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import {
    Container,
    Paper,
    Stack,
    Typography,
    Button,
} from "@mui/material/"
import LightModeIcon from "@mui/icons-material/LightMode"
import Brightness3Icon from "@mui/icons-material/Brightness3"

export default function TodoTable(props) {
    const [todos, setTodos] = useState([])
    const [tally, setTally] = useState({
        all: todos.length,
        active: 0,
        completed: 0,
    })

    useEffect(() => {
        setTodos(JSON.parse(localStorage.getItem("current-todos")))
    }, [])

    useEffect(() => {
        let tempObj = {
            all: todos.length,
            active: 0,
            completed: 0,
        }
        todos.forEach((item) => {
            if (item.isComplete) tempObj.completed++
            else tempObj.active++
        })
        setTally(tempObj)
        updateLocalStorage()
    }, [todos])

    let updateLocalStorage = () => {
        localStorage.setItem("current-todos", JSON.stringify(todos))
    }

    let removeTodo = (_, index) => {
        let newTodoList = todos.slice()
        newTodoList = newTodoList.filter((item) => item.uuid !== index)
        setTodos(newTodoList)
    }

    let appendTodo = (e, isChecked) => {
        let newTextValue = e.target.value.trim()
        if (e.key === "Enter" && newTextValue.length) {
            setTodos((prev) =>
                prev.concat([
                    {
                        uuid: uuidv4(),
                        todoText: newTextValue,
                        isHidden: false,
                        isComplete: isChecked,
                    },
                ])
            )
            e.target.value = ""
        }
    }

    let handleFilter = (filterType) => {
        let filteredList = todos.slice()
        filteredList.map((item) => {
            if (filterType.toLowerCase() === "all".toLowerCase()) {
                item.isHidden = false
            } else if (filterType.toLowerCase() === "completed".toLowerCase()) {
                item.isHidden = !item.isComplete
            } else {
                item.isHidden = item.isComplete
            }
            setTodos(filteredList)
        })
    }

    let clearAllCompleted = () => {
        let listCopy = todos.slice()
        listCopy = listCopy.filter((item) => item.isComplete !== true)
        setTodos(listCopy)
    }

    let toggleStrikeThroughBox = (_, index) => {
        let newTodoList = todos.slice()
        newTodoList[index].isComplete = !newTodoList[index].isComplete
        setTodos(newTodoList)
    }

    let changeTextValue = (index, newTextValue) => {
        let newTodoList = todos.slice()
        newTodoList[index].todoText = newTextValue
        setTodos(newTodoList)
    }

    let handleDrag = (e) => {
        if (!e.destination) return
        let reorderedList = todos.slice()
        let [tempObj] = reorderedList.splice(e.source.index, 1)
        reorderedList.splice(e.destination.index, 0, tempObj)
        setTodos(reorderedList)
    }

    return (
        <>
            <Container maxWidth="sm">
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h3" color="white">
                        TODO
                    </Typography>
                    <Button onClick={props.toggleDarkmode}>
                        {props.isDarkmode ? (
                            <Brightness3Icon />
                        ) : (
                            <LightModeIcon />
                        )}
                    </Button>
                </Stack>
                <TodCreator appendTodo={appendTodo} />
                <Paper sx={{ paddingInline: "20px" }}>
                    <DragDropContext onDragEnd={handleDrag}>
                        <Droppable droppableId="list-container">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <TodoContainer
                                        todos={todos}
                                        handleDrag={handleDrag}
                                        listFunctions={{
                                            removeTodo,
                                            toggleStrikeThroughBox,
                                            changeTextValue,
                                        }}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <UtilityBar
                        filterList={handleFilter}
                        clearAllCompleted={clearAllCompleted}
                        tally={tally}
                    />
                </Paper>
                <Typography variant="subtitle2" textAlign="center">
                    Drag and drop to reorder list
                </Typography>
            </Container>
        </>
    )
}

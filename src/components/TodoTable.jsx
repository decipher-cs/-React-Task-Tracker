import { useState, useEffect, useReducer } from "react"
import TodCreator from "./TodCreator"
import TodoContainer from "./TodoContainer"
import { v4 as uuidv4 } from "uuid"
import UtilityBar from "./UtilityBar"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import {
    Container,
    Paper,
    Stack,
    Pagination,
    Typography,
    Button,
    Snackbar,
    Alert,
} from "@mui/material/"
import LightModeIcon from "@mui/icons-material/LightMode"
import Brightness3Icon from "@mui/icons-material/Brightness3"

function reducer(state, action) {
    switch (action.type) {
        case "warning":
            return {
                showSnackbar: !state.showSnackbar,
                alertSeverity: "warning",
                alertMessage: action.payload.message,
            }
        case "info":
            return {
                showSnackbar: !state.showSnackbar,
                alertSeverity: "info",
                alertMessage: action.payload.message,
            }
        case "success":
            return {
                showSnackbar: !state.showSnackbar,
                alertSeverity: "success",
                alertMessage: action.payload.message,
            }
        default:
            throw new Error()
    }
}

export default function TodoTable(props) {
    // const SERVER_URL = "http://localhost:8080" // Testing
    const SERVER_URL = "https://doubtful-ox-button.cyclic.app/" // Production
    const [state, dispatch] = useReducer(reducer, {
        showSnackbar: false,
        alertSeverity: "info",
        alertMessage: "DISPLAYING WARNING DUMMY TEXT!",
    })
    const [loading, setLoading] = useState(true)
    const [todos, setTodos] = useState([]) // array of objects

    const [tally, setTally] = useState({
        all: todos.length,
        active: 0,
        completed: 0,
    })

    useEffect(() => {
        getEverythingFromServer().then((res) => {
            setTodos(res)
            setLoading(false)
        })
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

        let manageDispatcher = () => {
                // TODO : Give it a better name.
        }

    let synchTodosWithServer = async () => {
        //Todo
        return true
    }

    let getEverythingFromServer = async () => {
        try {
            let res = await fetch(`${SERVER_URL}/todos`)
            if (!res.ok) {
                console.log(
                    "Unable to get data on initial load.",
                    res.statusText,
                    res
                )

                dispatch({
                    type: "warning",
                    payload: {
                        message:
                            "Unable to connect to server. Using local storage for storing data.",
                    },
                })
                return []
            } else {
                dispatch({
                    type: "info",
                    payload: { message: "Connected to server." },
                })
                return await res.json()
            }
        } catch (error) {
            console.log("fetch failed", error)
            dispatch({
                type: "warning",
                payload: { message: "Unable to connect to server" },
            })
        }
    }

    let addItemToServer = async (itemObj) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(itemObj),
            })
            if (!res.ok) {
                console.log(
                    "Unable to add data to server.",
                    res.statusText,
                    res
                )
            }
        } catch (err) {
            console.log("POST fetch failed", err)
        }
    }

    let deleteItemFromServer = async (itemUuid) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos/${itemUuid}`, {
                method: "POST",
            })
            if (!res.ok) {
                console.log(
                    "Unable to delete data from server.",
                    res.statusText,
                    res
                )
            }
        } catch (err) {
            console.log(err)
        }
    }

    let deleteCompletedItemsFromServer = async () => {
        const response = await fetch(SERVER_URL + "/deleteCompleted", {
            method: "POST",
        })
        // Do error checking here. Was the response 200 or did it fail? todo
    }

    let editSingleItemInServer = async (newItemObj) => {
        console.log(newItemObj)
        console.log(newItemObj.uuid.toString())
        const response = await fetch(SERVER_URL + "/todos/updateTodo", {
            method: "POST",
            body: JSON.stringify(newItemObj),
            headers: {
                "Content-Type": "application/json",
            },
        })
        // Do error checking here. Was the response 200 or did it fail? todo
    }

    let getItemsFromLocalStorage = () =>
        JSON.parse(localStorage.getItem("current-todos"))

    let updateLocalStorage = () =>
        localStorage.setItem("current-todos", JSON.stringify(todos))

    let removeTodo = (_, uuidToRemove) => {
        let newTodoList = todos.slice()
        deleteItemFromServer(uuidToRemove).then(
            "item with uuid",
            uuidToRemove,
            "removed."
        )
        newTodoList = newTodoList.filter((item) => item.uuid !== uuidToRemove)
        setTodos(newTodoList)
    }

    let appendTodo = (e, isChecked) => {
        let newTextValue = e.target.value.trim()
        if (e.key === "Enter" && newTextValue.length) {
            let newObj = {
                uuid: uuidv4(),
                todoText: newTextValue,
                isHidden: false,
                isComplete: isChecked,
            }
            setTodos((prev) => prev.concat([newObj]))
            addItemToServer(newObj).then(() =>
                console.log("done adding to the server...")
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
        deleteCompletedItemsFromServer().then(() =>
            console.log("All completed items have been removed")
        )
        setTodos(listCopy)
    }

    let toggleStrikeThroughBox = (_, index) => {
        let newTodoList = todos.slice()
        newTodoList[index].isComplete = !newTodoList[index].isComplete
        editSingleItemInServer(newTodoList[index])
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
            <Container maxWidth="sm" sx={{ marginTop: "50px" }}>
                <Button
                    onClick={() => {
                        dispatch({
                            type: "warning",
                            payload: { message: "I am a message" },
                        })
                    }}
                >
                    {" "}
                    switch loading status
                </Button>
                <Snackbar open={state.showSnackbar}>
                    <Alert
                        severity={state.alertSeverity}
                        // ["error","info","success","warning"]
                    >
                        {state.alertMessage}
                    </Alert>
                </Snackbar>
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
                <Paper>
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
                                        loading={loading}
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
                <Typography
                    variant="subtitle2"
                    textAlign="center"
                    sx={{ marginTop: "40px" }}
                    color="#999999"
                >
                    Drag and drop to reorder list
                </Typography>
            </Container>
        </>
    )
}

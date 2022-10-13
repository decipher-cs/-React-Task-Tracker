import { useState, useEffect, useReducer } from 'react'
import TodCreator from './TodCreator'
import TodoContainer from './TodoContainer'
import { v4 as uuidv4 } from 'uuid'
import UtilityBar from './UtilityBar'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import LightModeIcon from '@mui/icons-material/LightMode'
import { Container, Paper, Stack, Pagination, Typography, Button, Snackbar, Alert } from '@mui/material/'
import Brightness3Icon from '@mui/icons-material/Brightness3'

function reducer(state, action) {
    switch (action.type) {
        case 'close':
            return { ...state, showSnackbar: false }
        case 'warning':
            return {
                showSnackbar: true,
                alertSeverity: 'warning',
                alertMessage: action.payload.message,
            }
        case 'info':
            return {
                showSnackbar: true,
                alertSeverity: 'info',
                alertMessage: action.payload.message,
            }
        case 'success':
            return {
                showSnackbar: true,
                alertSeverity: 'success',
                alertMessage: action.payload.message,
            }
        case 'error':
            return {
                showSnackbar: true,
                alertSeverity: 'error',
                alertMessage: action.payload.message,
            }
        default:
            throw new Error()
    }
}

export default function TodoTable(props) {
    // const SERVER_URL = 'http://localhost:8080' // Testing
    const SERVER_URL = 'https://doubtful-ox-button.cyclic.app/' // Production
    const [state, dispatch] = useReducer(reducer, {
        showSnackbar: false,
        alertSeverity: 'info',
        alertMessage: 'Everything Alright',
    })
    const [loading, setLoading] = useState(true)
    const [todos, setTodos] = useState([]) // array of objects
    const [tally, setTally] = useState({
        all: todos.length,
        active: 0,
        completed: 0,
    })
    const [paginationSize, setPaginationSize] = useState(10)
    const [currPage, setCurrPage] = useState(1)

    useEffect(() => {
        if (!document.cookie) {
            manageDispatcher('info', 'New user initiated.')
            document.cookie = `user_Id=${uuidv4()}`
        } else manageDispatcher('success', 'Welcome Back!')
        getEverythingFromServer()
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

    let manageDispatcher = (severityLevel, messageToDisplay) => {
        dispatch({
            type: severityLevel,
            payload: { message: messageToDisplay },
        })
    }

    let synchTodosWithServer = async () => {
        //Todo
        return true
    }

    let uponConnectionErrorWithServer = async (err) => {
        console.log('ENCOUNTERED ERROR WHILE CONNECTING TO SERVER :', err)
        manageDispatcher('warning', 'Unable to connect to the database.')
    }

    let getEverythingFromServer = async () => {
        try {
            let res = await fetch(`${SERVER_URL}/todos`, { credentials: 'include' })
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
                return []
            } else {
                manageDispatcher('success', 'Connected to the database.')
                let finalRes = await res.json()
                setTodos(finalRes)
                setLoading(false)
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
            setLoading(false) //TODO USE LOCAL STORAGE HERE
            return []
        }
    }

    let addItemToServer = async (itemObj) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(itemObj),
                credentials: 'include',
            })
            if (!res.ok) {
                manageDispatcher()
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
        }
    }

    let deleteItemFromServer = async (itemUuid) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos/${itemUuid}`, { method: 'POST', credentials: 'include' })
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
        }
    }

    let deleteCompletedItemsFromServer = async () => {
        try {
            const res = await fetch(SERVER_URL + '/todos/removeCompleted', { method: 'POST', credentials: 'include' })
            if (!res.ok) {
                manageDispatcher(
                    'warning',
                    'Unable to connect to server. Using local storage for storing data.',
                    res.statusText
                )
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
        }
    }

    let editSingleItemInServer = async (newItemObj) => {
        try {
            const res = await fetch(SERVER_URL + '/todos/updateTodo', {
                method: 'POST',
                body: JSON.stringify(newItemObj),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
        }
    }

    let getItemsFromLocalStorage = () => JSON.parse(localStorage.getItem('current-todos'))

    let updateLocalStorage = () => localStorage.setItem('current-todos', JSON.stringify(todos))

    let removeTodo = (_, uuidToRemove) => {
        let newTodoList = todos.slice()
        deleteItemFromServer(uuidToRemove).then('item with uuid', uuidToRemove, 'removed.')
        newTodoList = newTodoList.filter((item) => item.uuid !== uuidToRemove)
        setTodos(newTodoList)
    }

    let appendTodo = (e, isChecked) => {
        let newTextValue = e.target.value.trim()
        if (e.key === 'Enter' && newTextValue.length) {
            let newObj = {
                uuid: uuidv4(),
                todoText: newTextValue,
                isHidden: false,
                isComplete: isChecked,
            }
            setTodos((prev) => prev.concat([newObj]))
            addItemToServer(newObj)
            e.target.value = ''
        }
    }

    let handleFilter = (filterType) => {
        let filteredList = todos.slice()
        filteredList.map((item) => {
            if (filterType.toLowerCase() === 'all'.toLowerCase()) {
                item.isHidden = false
            } else if (filterType.toLowerCase() === 'completed'.toLowerCase()) {
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
        deleteCompletedItemsFromServer()
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
        editSingleItemInServer(newTodoList[index])
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
            <Container maxWidth='sm' sx={{ marginTop: '50px' }}>
                <Snackbar open={state.showSnackbar} autoHideDuration={6000} onClose={() => manageDispatcher('close')}>
                    <Alert severity={state.alertSeverity}>{state.alertMessage}</Alert>
                </Snackbar>
                <Stack direction='row' justifyContent='space-between'>
                    <Typography variant='h3' color='white'>
                        TODO
                    </Typography>
                    <Button onClick={props.toggleDarkmode}>
                        {props.isDarkmode ? <Brightness3Icon /> : <LightModeIcon />}
                    </Button>
                </Stack>
                <TodCreator appendTodo={appendTodo} />
                <Paper>
                    <DragDropContext onDragEnd={handleDrag}>
                        <Droppable droppableId='list-container'>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <TodoContainer
                                        todos={todos}
                                        handleDrag={handleDrag}
                                        loading={loading}
                                        currPage={currPage}
                                        paginationSize={paginationSize}
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
                        setCurrPage={setCurrPage}
                        paginationSize={paginationSize}
                    />
                </Paper>
                <Typography variant='subtitle2' textAlign='center' sx={{ marginTop: '40px' }} color='#999999'>
                    Drag and drop to reorder list
                </Typography>
            </Container>
        </>
    )
}

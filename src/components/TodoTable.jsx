import { useState, useEffect, useReducer, useRef } from 'react'
import TodCreator from './TodCreator'
import TodoContainer from './TodoContainer'
import { v4 as uuidv4 } from 'uuid'
import UtilityBar from './UtilityBar'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import LightModeIcon from '@mui/icons-material/LightMode'
import {
    Container,
    Paper,
    Stack,
    Typography,
    ButtonGroup,
    Button,
    Snackbar,
    Alert,
    Dialog,
    IconButton,
} from '@mui/material/'
import Brightness3Icon from '@mui/icons-material/Brightness3'
import CloseIcon from '@mui/icons-material/Close'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import GitHubIcon from '@mui/icons-material/GitHub'
import CloudSyncIcon from '@mui/icons-material/CloudSync'

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
    const SERVER_URL = 'https://doubtful-ox-button.cyclic.app' // Production
    const MAX_TRIES = 3

    const retryCountRef = useRef(1)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [userId, setUserId] = useState(localStorage.getItem('userId'))
    const [useRemoteStorage, setUseRemoteStorage] = useState(true)
    const [loading, setLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const [paginationSize, setPaginationSize] = useState(5)
    const [currPage, setCurrPage] = useState(1)
    const [tally, setTally] = useState({
        all: todos.length,
        active: 0,
        completed: 0,
    })

    const [state, dispatch] = useReducer(reducer, {
        showSnackbar: false,
        alertSeverity: 'info',
        alertMessage: 'Everything Alright',
    })

    useEffect(() => {
        let id
        if (!userId) {
            id = uuidv4()
            setUserId(id)
            getItemFromLocalStorage(('userId', id))
        }
        useRemoteStorage && getEverythingFromServer(userId || id)
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
        updateLocalStorage('current-todos', todos)
    }, [todos])

    let getItemFromLocalStorage = (itemToGet) => JSON.parse(localStorage.getItem(itemToGet))

    let updateLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))

    let manageDispatcher = (severityLevel, messageToDisplay) => {
        dispatch({
            type: severityLevel,
            payload: { message: messageToDisplay },
        })
    }

    let synchTodosWithServer = async () => todos.slice().forEach((item) => editSingleItemInServer(item))

    let retryConnectionAttempt = (failedFunction, data) => {
        if (retryCountRef.current > MAX_TRIES) {
            retryCountRef.current = 1
            return
        }
        ++retryCountRef.current
        setTimeout(() => {
            failedFunction(data)
        }, 1000 * 2 * retryCountRef.current)
    }

    let uponConnectionErrorWithServer = async (err) => {
        console.log('ENCOUNTERED ERROR WHILE CONNECTING TO SERVER :', err)
        manageDispatcher('warning', 'Unable to connect to the database.')
    }

    let getEverythingFromServer = async (userId) => {
        try {
            let res = await fetch(`${SERVER_URL}/todos/${userId}`)
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
                setTodos([])
            } else {
                manageDispatcher('success', 'Connected to the database.')
                setTodos(await res.json())
            }
        } catch (err) {
            retryConnectionAttempt(getEverythingFromServer, userId)
            uponConnectionErrorWithServer(err) //TODO USE LOCAL STORAGE HERE
            return []
        }
        setLoading(false)
    }

    let addItemToServer = async (itemObj) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ ...itemObj, userId }),
            })
            if (!res.ok) {
                manageDispatcher()
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
            retryConnectionAttempt(addItemToServer, itemObj)
        }
    }

    let deleteItemFromServer = async (itemUuid) => {
        try {
            const res = await fetch(`${SERVER_URL}/todos/${itemUuid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ userId }),
            })
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
            retryConnectionAttempt(deleteItemFromServer, itemUuid)
        }
    }

    let deleteCompletedItemsFromServer = async () => {
        try {
            const res = await fetch(SERVER_URL + '/todos/removeCompleted', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })
            if (!res.ok) {
                manageDispatcher(
                    'warning',
                    'Unable to connect to server. Using local storage for storing data.',
                    res.statusText
                )
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
            retryConnectionAttempt(deleteItemFromServer, '')
        }
    }

    let editSingleItemInServer = async (newItemObj) => {
        try {
            const res = await fetch(SERVER_URL + '/todos/updateTodo', {
                method: 'POST',
                body: JSON.stringify({ ...newItemObj, userId }),
                headers: { 'Content-Type': 'application/json' },
            })
            if (!res.ok) {
                manageDispatcher('warning', 'Unable to connect to server. Using local storage for storing data.')
            }
        } catch (err) {
            uponConnectionErrorWithServer(err)
            retryConnectionAttempt(editSingleItemInServer, newItemObj)
        }
    }

    let removeTodo = (_, uuidToRemove) => {
        let newTodoList = todos.slice()
        useRemoteStorage && deleteItemFromServer(uuidToRemove)
        newTodoList = newTodoList.filter((item) => item.uuid !== uuidToRemove)
        setTodos(newTodoList)
        updateLocalStorage('current-todos', newTodoList)
        if ((tally.all - 1) % paginationSize == 0 && currPage != 1) setCurrPage((prev) => prev - 1)
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
            useRemoteStorage && addItemToServer(newObj)
            updateLocalStorage('current-todos', todos.slice().concat([newObj]))
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
        })
        setTodos(filteredList)
        // useRemoteStorage && editSingleItemInServer([index]) //  There is a good chance we don't want to update the database upon filtering the list
        updateLocalStorage('current-todos', filteredList)
    }

    let clearAllCompleted = () => {
        let listCopy = todos.slice()
        listCopy = listCopy.filter((item) => item.isComplete !== true)
        useRemoteStorage && deleteCompletedItemsFromServer()
        setTodos(listCopy)
        updateLocalStorage('current-todos', listCopy)
    }

    let toggleStrikeThroughBox = (_, index) => {
        let newTodoList = todos.slice()
        newTodoList[index].isComplete = !newTodoList[index].isComplete
        useRemoteStorage && editSingleItemInServer(newTodoList[index])
        setTodos(newTodoList)
        updateLocalStorage('current-todos', newTodoList)
    }

    let changeTextValue = (index, newTextValue) => {
        let newTodoList = todos.slice()
        newTodoList[index].todoText = newTextValue
        setTodos(newTodoList)
        useRemoteStorage && editSingleItemInServer(newTodoList[index])
        updateLocalStorage('current-todos', newTodoList)
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
            <Dialog open={isDialogOpen}>
                <Button onClick={() => setIsDialogOpen(false)}>
                    <CloseIcon />
                </Button>
                <Typography p={1}> Settings </Typography>
            </Dialog>
            <Container maxWidth='sm' sx={{ marginTop: '50px' }} className={props.className} style={props.style}>
                <Snackbar open={state.showSnackbar} autoHideDuration={4000} onClose={() => manageDispatcher('close')}>
                    <Alert severity={state.alertSeverity}>{state.alertMessage}</Alert>
                </Snackbar>
                <Stack direction='row' justifyContent='space-between' px={1.4}>
                    <Typography variant='h3' color='white'>
                        TODO
                    </Typography>
                    <ButtonGroup variant='text'>
                        <Button onClick={synchTodosWithServer}>
                            <CloudSyncIcon sx={{ color: 'white' }} />
                        </Button>
                        <Button onClick={() => window.open('https://gitlab.com/Decipher-CS/react-todo-app')}>
                            <GitHubIcon sx={{ color: 'white' }} />
                        </Button>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <SettingsSuggestIcon sx={{ color: 'white' }} />
                        </Button>
                        <Button onClick={props.toggleDarkmode}>
                            {props.isDarkmode ? (
                                <Brightness3Icon sx={{ color: 'white' }} />
                            ) : (
                                <LightModeIcon sx={{ color: 'white' }} />
                            )}
                        </Button>
                    </ButtonGroup>
                </Stack>
                <TodCreator appendTodo={appendTodo} />
                <Paper sx={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}>
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
                </Paper>
                <UtilityBar
                    filterList={handleFilter}
                    clearAllCompleted={clearAllCompleted}
                    tally={tally}
                    currPage={currPage}
                    setCurrPage={setCurrPage}
                    paginationSize={paginationSize}
                />
                <Typography variant='subtitle2' textAlign='center' sx={{ marginTop: '40px' }} color='#999999'>
                    Drag and drop to reorder list
                </Typography>
            </Container>
        </>
    )
}

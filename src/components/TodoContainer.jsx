import TodoItem from './TodoItem'
import Divider from '@mui/material/Divider'
import { Draggable } from 'react-beautiful-dnd'
import Skeleton from '@mui/material/Skeleton'
import { Stack, Checkbox, Container, Switch, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function createSkeleton(index) {
    return (
        <div key={index}>
            <Stack px={2} py={0.5} direction='row' alignItems='center' gap='30px'>
                <Skeleton animation='wave'>
                    <Checkbox />
                </Skeleton>
                <Skeleton width='100%' animation='wave'>
                    <Container>
                        <Typography>Foobar</Typography>
                    </Container>
                </Skeleton>

                <Skeleton animation='wave'>
                    <Switch />
                </Skeleton>

                <Skeleton animation='wave'>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Skeleton>
            </Stack>
            <Divider />
        </div>
    )
}

function createTodoItem(item, listFunctions, index) {
    return (
        <Draggable draggableId={item.uuid.toString()} key={item.uuid.toString()} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TodoItem
                        index={index}
                        item={item.todoText}
                        uuid={item.uuid}
                        isHidden={item.isHidden}
                        isComplete={item.isComplete}
                        listFunctions={listFunctions}
                    />
                </div>
            )}
        </Draggable>
    )
}

export default function TodoContainer({
    todos,
    loading,
    listFunctions,
    currPage,
    paginationSize,
    // ...props
}) {
    return (
        <>
            {loading
                ? Array(4)
                      .fill()
                      .map((_, i) => createSkeleton(i))
                : todos
                      ?.filter((item) => !item.isHidden)
                      .map((item, index) => createTodoItem(item, listFunctions, index))
                      .slice((currPage - 1) * paginationSize, (currPage - 1) * paginationSize + paginationSize)}
        </>
    )
}

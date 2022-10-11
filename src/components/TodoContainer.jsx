import Tod from "./Tod"
import Divider from "@mui/material/Divider"
import { Draggable } from "react-beautiful-dnd"
import Skeleton from "@mui/material/Skeleton"
import {
    Stack,
    Checkbox,
    Container,
    Switch,
    IconButton,
    Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

export default function TodoContainer({
    todos,
    loading,
    listFunctions,
    // ...props
}) {
    return (
        <>
            {loading
                ? Array(3)
                      .fill()
                      .map((_, i) => (
                          <div key={i}>
                              <Stack
                                  px={2}
                                  py={0.5}
                                  direction="row"
                                  alignItems="center"
                                  gap="30px"
                              >
                                  <Skeleton animation="wave">
                                      <Checkbox />
                                  </Skeleton>
                                  <Skeleton width="100%" animation="wave">
                                      <Container>
                                          <Typography>Foobar</Typography>
                                      </Container>
                                  </Skeleton>

                                  <Skeleton animation="wave">
                                      <Switch />
                                  </Skeleton>

                                  <Skeleton animation="wave">
                                      <IconButton>
                                          <DeleteIcon />
                                      </IconButton>
                                  </Skeleton>
                              </Stack>
                              <Divider />
                          </div>
                      ))
                : todos.map((item, index) => (
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

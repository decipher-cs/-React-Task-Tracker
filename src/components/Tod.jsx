import {
    Checkbox,
    Input,
    Container,
    Typography,
    Stack,
    Switch,
    IconButton,
} from "@mui/material"

import { useState } from "react"

import ModeEditOutlineSharpIcon from "@mui/icons-material/ModeEditOutlineSharp"
import EditOffIcon from "@mui/icons-material/EditOff"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"

export default function Tod({
    item: textValue,
    index,
    uuid,
    isHidden,
    isComplete,
    listFunctions,
    // ...props
}) {
    const [tempValue, setTempValue] = useState(textValue)
    const [isDisabled, setDisabled] = useState(true)
    const [isInputInvalid, setInputInvalid] = useState(false)
    const makeBoxEditable = () => {
        if (isDisabled === false) {
            if (tempValue.length === 0) {
                console.log("String cannot be empty.") //  THROW ERROR ON INPUT BOX
                setInputInvalid(true)
                return
            }
            setInputInvalid(false)
            listFunctions.changeTextValue(index, tempValue)
            setDisabled(true)
            return
        }
        console.log("was true now set to false")
        setDisabled(false)
    }
    let handleChange = (e) => {
        setTempValue(e.target.value)
    }

    return (
        <>
            {isHidden || (
                <Stack
                    direction="row"
                    alignItems="center"
                    // justifyContent="spece-between"
                >
                    <Checkbox
                        checked={isComplete}
                        icon={<CheckCircleOutlinedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        onChange={(e) =>
                            listFunctions.toggleStrikeThroughBox(e, index)
                        }
                        sx={{ paddingLeft: "0px" }}
                    />
                    <Container>
                        {isDisabled ? (
                            <Typography
                                className={isComplete ? "mark-item" : ""}
                            >
                                {textValue}
                            </Typography>
                        ) : (
                            <Input
                                defaultValue={textValue}
                                placeholder="Item Cannot Be Empty"
                                error={isInputInvalid}
                                margin="none"
                                required
                                onChange={handleChange}
                            />
                        )}
                    </Container>
                    <Switch
                        icon={<EditOffIcon />}
                        checkedIcon={<ModeEditOutlineSharpIcon />}
                        onChange={makeBoxEditable}
                    />
                    <IconButton
                        sx={{ paddingRight: "0px" }}
                        onClick={(e) => listFunctions.removeTodo(e, uuid)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )}
        </>
    )
}

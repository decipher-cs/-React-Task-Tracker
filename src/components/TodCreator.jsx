import { TextField, Checkbox, Paper } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"
import { useState } from "react"

export default function TodCreator({ appendTodo }) {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <>
            <Paper
                sx={{
                    marginBlock: "30px",
                    paddingInline: "0.9em",
                    paddingBlock: "0.3em",
                }}
            >
                <Checkbox
                    icon={<CheckCircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <TextField
                    placeholder="Enter Item Here"
                    id="standard-basic"
                    variant="standard"
                    margin="none"
                    onKeyDown={(e) => appendTodo(e, isChecked)}
                />
            </Paper>
        </>
    )
}

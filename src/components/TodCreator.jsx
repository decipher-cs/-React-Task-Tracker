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
                    px: 2,
                    py: 0.5,
                }}
            >
                <Checkbox
                    icon={<CheckCircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <TextField
                    placeholder="Enter Item Here..."
                    size="small"
                    // fullWidth
                    // disableUnderline
                    variant="standard"
                    margin="dense"
                    onKeyDown={(e) => appendTodo(e, isChecked)}
                />
            </Paper>
        </>
    )
}

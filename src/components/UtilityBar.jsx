import {
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Select,
    MenuItem,
    Button,
} from "@mui/material/"
import { useState } from "react"
const UtilityBar = ({ filterList, clearAllCompleted, tally }) => {
    const [filterType, setFilterType] = useState("all")
    const [selectValue, setSelectValue] = useState(1)

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Select
                    onChange={(e) => setSelectValue(e.target.value)}
                    variant="standard"
                    value={selectValue}
                    disableUnderline
                >
                    <MenuItem value="1">{"Total items: " + tally.all}</MenuItem>
                    <MenuItem value="2">
                        {"Active items: " + tally.active}
                    </MenuItem>
                    <MenuItem value="3">
                        {"Completed items: " + tally.completed}
                    </MenuItem>
                </Select>
                <ToggleButtonGroup
                    size="small"
                    onChange={(e) => {
                        setFilterType(e.target.value)
                        filterList(e.target.value)
                    }}
                    value={filterType}
                    exclusive
                >
                    {["all", "active", "completed"].map((filterType) => (
                        <ToggleButton
                            key={filterType}
                            onClick={() => filterList}
                            value={filterType}
                            sx={{ border: "dotted red 0px" }}
                            disableRipple
                        >
                            {filterType}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <Button size="small" onClick={clearAllCompleted}>
                    clear all
                </Button>
            </Stack>
        </>
    )
}

export default UtilityBar

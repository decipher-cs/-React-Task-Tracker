import { useState } from 'react'
import { Checkbox, Input, Container, Stack, IconButton, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import AndroidSwitch from './AndroidSwitch'
import useMediaQuery from '@mui/material/useMediaQuery'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

export default function TodoItem({
    item: textValue,
    index,
    uuid,
    isHidden,
    isComplete,
    listFunctions,
    // ...props
}) {
    const isScreenSizeSmall = useMediaQuery('(max-width:430px)')

    const [tempValue, setTempValue] = useState(textValue)

    const [isDisabled, setDisabled] = useState(true)

    const [isInputInvalid, setInputInvalid] = useState(false)
        
    const makeBoxEditable = () => {
        if (isDisabled) {
            setDisabled(false)
            return
        }
        if (tempValue.length <= 0) {
            setInputInvalid(true)
            return
        }
        setInputInvalid(false)
        listFunctions.changeTextValue(index, tempValue)
        setDisabled(true)
        return
    }
    let handleChange = (e) => {
        setTempValue(e.target.value)
    }
    let handleVisibleTextValue = (textValue) => {
        let maxVisibleStrLen = isScreenSizeSmall ? 10 : 25
        return textValue.slice(0, maxVisibleStrLen) + (textValue.length > maxVisibleStrLen ? '....' : '')
    }

    return (
        <>
            {isHidden || (
                <Stack px={2} py={0.5} direction='row' alignItems='center'>
                    <Checkbox
                        checked={isComplete}
                        icon={<CheckCircleOutlinedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        onChange={(e) => listFunctions.toggleStrikeThroughBox(e, index)}
                    />
                    <Container>
                        {isDisabled ? (
                                <Typography className={isComplete ? 'mark-item' : ''} noWrap>
                                    {handleVisibleTextValue(textValue)}
                                </Typography>
                        ) : (
                            <Input
                                defaultValue={textValue}
                                placeholder='Item Cannot Be Empty'
                                error={isInputInvalid}
                                margin='none'
                                required
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        )}
                    </Container>
                    <AndroidSwitch onChange={(e) => makeBoxEditable(e)} checked={!isDisabled} />
                    <IconButton onClick={(e) => listFunctions.removeTodo(e, uuid)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )}
            {isHidden || <Divider />}
        </>
    )
}

import { Checkbox, Input, Container, Stack, Switch, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Divider from '@mui/material/Divider'

import { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16px' viewBox='0 0 24 24' width='16px' fill='${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}'%3E%3Ctitle%3Eic_edit_off_24px%3C/title%3E%3Cpath d='M0 0h24v24H0zm0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12.126 8.125l1.937-1.937 3.747 3.747-1.937 1.938zM20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L20.71 7a1 1 0 0 0 0-1.37zM2 5l6.63 6.63L3 17.25V21h3.75l5.63-5.62L18 21l2-2L4 3 2 5z'/%3E%3C/svg%3E%0A")`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15px' viewBox='0 0 24 24' width='16px' fill='${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main)
            )}'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E%0A")`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}))

export default function TodoItem({
    item: textValue,
    index,
    uuid,
    isHidden,
    isComplete,
    listFunctions,
    // ...props
}) {
    const isScreenSizeSmall = useMediaQuery('(max-width:390px)')
    const [tempValue, setTempValue] = useState(textValue)
    const [isDisabled, setDisabled] = useState(true)
    const [isInputInvalid, setInputInvalid] = useState(false)
    const makeBoxEditable = () => {
        if (isDisabled === false) {
            if (tempValue.length === 0) {
                console.log('String cannot be empty.') //  THROW ERROR ON INPUT BOX TODO
                setInputInvalid(true)
                return
            }
            setInputInvalid(false)
            listFunctions.changeTextValue(index, tempValue)
            setDisabled(true)
            return
        }
        setDisabled(false)
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
                            <Typography className={isComplete ? 'mark-item' : ''}>
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
                    <Android12Switch
                        // icon={<EditOffIcon />}
                        // checkedIcon={<ModeEditOutlineSharpIcon />}
                        onChange={makeBoxEditable}
                    />
                    <IconButton onClick={(e) => listFunctions.removeTodo(e, uuid)}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )}
            {isHidden || <Divider />}
        </>
    )
}


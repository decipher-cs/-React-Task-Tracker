import { Stack, ToggleButton, ToggleButtonGroup, Select, MenuItem, Button, Pagination } from '@mui/material/'
import { useState } from 'react'
const UtilityBar = ({ filterList, clearAllCompleted, tally, setCurrPage, paginationSize }) => {
    const [filterType, setFilterType] = useState('all')
    const [selectValue, setSelectValue] = useState(1)

    return (
        <>
            <Stack direction='row' justifyContent='space-between' px={2} py={1} flexWrap='wrap'>
                {tally.all == true && (
                    <Pagination
                        count={Math.ceil(tally.all / paginationSize)}
                        sx={{ marginInline: 'auto', marginBottom: '1.3em', marginTop: '0.4em' }}
                        size='medium'
                        defaultPage={1}
                        onChange={(_, pageNum) => setCurrPage(pageNum)}
                        variant='outlined'
                    />
                )}
                <div style={{ flexBasis: '100%', width: '0px' }}></div>
                <Select
                    onChange={(e) => setSelectValue(e.target.value)}
                    variant='standard'
                    value={selectValue}
                    disableUnderline
                >
                    <MenuItem value='1'>{'Total items: ' + tally.all}</MenuItem>
                    <MenuItem value='2'>{'Active items: ' + tally.active}</MenuItem>
                    <MenuItem value='3'>{'Completed items: ' + tally.completed}</MenuItem>
                </Select>
                <ToggleButtonGroup
                    size='small'
                    onChange={(e) => {
                        setFilterType(e.target.value)
                        filterList(e.target.value)
                    }}
                    value={filterType}
                    exclusive
                >
                    {['all', 'active', 'completed'].map((filterType) => (
                        <ToggleButton
                            key={filterType}
                            onClick={() => filterList}
                            value={filterType}
                            sx={{ border: 'dotted red 0px' }}
                            disableRipple
                        >
                            {filterType}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <Button size='small' onClick={clearAllCompleted}>
                    clear completed
                </Button>
            </Stack>
        </>
    )
}

export default UtilityBar

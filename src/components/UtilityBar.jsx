import { Stack, Paper, ToggleButton, ToggleButtonGroup, Select, MenuItem, Button, Pagination } from '@mui/material/'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

const UtilityBar = ({ filterList, clearAllCompleted, tally, currPage, setCurrPage, paginationSize }) => {
    const [filterType, setFilterType] = useState('all')

    const [selectValue, setSelectValue] = useState(1)

    const isScreenSizeBig = useMediaQuery('(min-width:900px)')

    const isScreenSizeSmall = useMediaQuery('(max-width:390px)')

    function paginationBar() {
        return (
            <>
                {tally[filterType] > paginationSize && (
                    <Pagination
                        count={Math.ceil(tally[filterType] / paginationSize)}
                        sx={{ marginInline: 'auto', marginBottom: '1.3em', marginTop: '0.4em' }}
                        size='medium'
                        defaultPage={1}
                        page={currPage}
                        onChange={(_, pageNum) => setCurrPage(pageNum)}
                    />
                )}
            </>
        )
    }
    function summaryBoard() {
        return (
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
        )
    }
    function filterBar() {
        return (
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
        )
    }

    return (
        <>
            <Paper sx={{ borderTopLeftRadius: '0px', borderTopRightRadius: '0px' }}>
                <Stack
                    direction='row'
                    justifyContent={isScreenSizeSmall ? 'center' : 'space-between'}
                    px={2}
                    py={1}
                    flexWrap='wrap'
                >
                    {paginationBar()}
                    <div style={{ flexBasis: '100%', width: '0px' }}></div>
                    {summaryBoard()}
                    {isScreenSizeBig && filterBar()}
                    <Button size='small' onClick={clearAllCompleted} >
                        clear completed
                    </Button>
                </Stack>
            </Paper>
            {isScreenSizeBig || (
                <Paper sx={{ mt: 2.8 }}>
                    <Stack direction='row' px={2} py={1} flexWrap='wrap' justifyContent='center'>
                        {filterBar()}
                    </Stack>
                </Paper>
            )}
        </>
    )
}
export default UtilityBar

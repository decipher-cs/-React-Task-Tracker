import TodoTable from './components/TodoTable'
import './styles/resets.css'
import './styles/global.css'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import bgDesktopDark from './assets/bg-desktop-dark.jpg'
import bgMobileDark from './assets/bg-mobile-dark.jpg'

import bgDesktopLight from './assets/bg-desktop-light.jpg'
import bgMobileLight from './assets/bg-mobile-light.jpg'
import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'

import { grey } from '@mui/material/colors/'

const commonTheme = {
    typography: {
        fontFamily: ['Josefin Sans', 'sans-serif'].join(','),
    },
    palette: {},
}
const darkTheme = createTheme({
    ...commonTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: grey[50],
        },
    },
})
const lightTheme = createTheme({
    ...commonTheme,
    palette: {
        mode: 'light',
        primary: {
            main: grey[800],
        },
    },
})

function App() {
    const isSizeDesktop = useMediaQuery('(min-width:390px)')
    const [isDarkmode, setDarkMode] = useState(true)
    const Wallpaper = ({ bg }) => <img src={bg} className='bg-img-main' style={{ minWidth: '100vw' }} />

    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') === 'true') // Is "theme" === true set isDarkmode to true
    }, [])

    useEffect(() => {
        localStorage.setItem('theme', isDarkmode)
    }, [isDarkmode])
    return (
        <>
            <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
                <CssBaseline>
                    <div
                        className='todo-body-container'
                        style={{
                            backgroundImage: `url(${
                                isSizeDesktop
                                    ? isDarkmode
                                        ? bgDesktopDark
                                        : bgDesktopLight
                                    : isDarkmode
                                    ? bgDesktopDark
                                    : bgDesktopLight
                            })`,
                        }}
                    >
                        <TodoTable
                            className='todo-body'
                            toggleDarkmode={() => setDarkMode((prev) => !prev)}
                            isDarkmode={isDarkmode}
                        />
                    </div>
                </CssBaseline>
            </ThemeProvider>
        </>
    )
}
export default App

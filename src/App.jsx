import TodoTable from "./components/TodoTable"
import "./styles/resets.css"
import "./styles/global.css"
import useMediaQuery from "@mui/material/useMediaQuery"
import { ThemeProvider, createTheme } from "@mui/material/styles"

import bgDesktopDark from "./assets/bg-desktop-dark.jpg"
import bgMobileDark from "./assets/bg-mobile-dark.jpg"

import bgDesktopLight from "./assets/bg-desktop-light.jpg"
import bgMobileLight from "./assets/bg-mobile-light.jpg"
import { useEffect, useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
})
const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
})

function App() {
    const isSizeDesktop = useMediaQuery("(min-width:350px)")
    const [isDarkmode, setDarkMode] = useState(true)
    const Wallpaper = ({ bg }) => <img src={bg} className="bg-img-main" />

    useEffect(() => {
        setDarkMode(localStorage.getItem("theme") === "true") // Is "theme" === true set isDarkmode to true
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", isDarkmode)
    }, [isDarkmode])
    return (
        <>
            <ThemeProvider theme={isDarkmode ? darkTheme : lightTheme}>
                <CssBaseline>
                    <div className="bg-img-main-container">
                        {isSizeDesktop ? (
                            <Wallpaper
                                bg={isDarkmode ? bgDesktopDark : bgDesktopLight}
                            />
                        ) : (
                            <Wallpaper
                                bg={isDarkmode ? bgMobileDark : bgMobileLight}
                            />
                        )}
                    </div>

                    <TodoTable
                        toggleDarkmode={() => setDarkMode((prev) => !prev)}
                        isDarkmode={isDarkmode}
                    />
                </CssBaseline>
            </ThemeProvider>
        </>
    )
}
export default App

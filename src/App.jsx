import TodoTable from "./components/TodoTable"
import "./styles/resets.css"
import "./styles/global.css"
import bgDesktopDark from "./assets/bg-desktop-dark.jpg"
import bgDesktopLight from "./assets/bg-desktop-light.jpg"
import bgMobileDark from "./assets/bg-mobile-dark.jpg"
import bgMobileLight from "./assets/bg-mobile-light.jpg"
function App() {
    return (
        <>
            <div className="bg-img-main-container">
                <img src={bgDesktopDark} className="bg-img-main" />
            </div>

            <TodoTable />
        </>
    )
}
export default App

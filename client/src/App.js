import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

// import { UserDetails } from "./components/UserDetails";
import { Homepage } from "./components/Homepage";
import { NotFound } from "./components/NotFound";

function App() {
	return (
		<Router>
			<div className="routes-body">
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/notfound" element={<NotFound />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;

import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
// import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export const Homepage = () => {
	return (
		<div>
			<nav className="fixed top-0 w-full h-20 flex justify-evenly bg-gradient-to-r from-blue-600 via-indigo-400 to-sky-300 drop-shadow-md text-white">
				<Link to="/home">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700 hover:cursor-pointer active:bg-indigo-500">
						<IoHomeOutline />
					</button>
				</Link>

				<Link to="/signup">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700  hover:cursor-pointer active:bg-indigo-500">
						Sign Up
					</button>
				</Link>
				<Link to="/login">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700  hover:cursor-pointer active:bg-indigo-500">Log In</button>
				</Link>
			</nav>
			<main className="h-screen">
				<div className="px-12 pt-28">
					<div className="flex justify-center mt-4 mb-4 font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl">
						Welcome to Wheel of Fortune!
					</div>
					<div className="flex justify-center mt-16 p-8 bg-gray-200 bg-opacity-30 rounded-lg">
						<div className="w-[50%]">
							Excepteur velit incididunt sunt pariatur adipisicing ea enim eu ea Lorem exercitation fugiat consectetur culpa. Ea non eiusmod est
							ullamco. Lorem irure dolor mollit fugiat dolore deserunt. Deserunt magna labore Lorem commodo qui consectetur quis proident tempor
							deserunt id dolor. Veniam sit ex dolor et ut dolore pariatur reprehenderit labore velit incididunt. Nisi id ea pariatur dolore nulla
							nulla irure duis eiusmod exercitation sit. Minim ex aliqua aute nostrud sunt velit laborum ut eu id esse aliqua. Id do amet occaecat
							excepteur aliqua. Sit veniam labore cillum ea.
						</div>
					</div>
				</div>
			</main>
			<footer className="h-32 flex justify-center py-5 bg-indigo-800 text-white">
				<div className="flex flex-row">
					<a href="/" className="facebook px-2 hover:text-gray-200 hover:cursor-pointer">
						{/* <FaFacebook size={20} /> */}
					</a>
					<a href="/" className="github px-2 hover:text-gray-200 hover:cursor-pointer">
						{/* <FaInstagram size={20} /> */}
					</a>
					<a href="/" className="github px-2 hover:text-gray-200 hover:cursor-pointer">
						{/* <FaLinkedin size={20} /> */}
					</a>
				</div>
			</footer>
		</div>
	);
};

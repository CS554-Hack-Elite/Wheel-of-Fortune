import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaFacebook, FaInstagram, FaInstagramSquare, FaLinkedin, FaLinkedinIn } from "react-icons/fa";

export const Homepage = () => {
	return (
		<div>
			<nav className="h-20 flex justify-evenly bg-indigo-950 text-white">
				<a href="/">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700 hover:cursor-pointer active:bg-indigo-500">
						<IoHomeOutline />
					</button>
				</a>
				<a href="/">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700  hover:cursor-pointer active:bg-indigo-500">
						Sign Up
					</button>
				</a>
				<a href="/">
					<button className="h-full w-fit px-4 transition duration-200 hover:bg-indigo-700  hover:cursor-pointer active:bg-indigo-500">Log In</button>
				</a>
			</nav>
			<main className="h-screen">
				<div>
					<div className="flex justify-center mt-4 mb-4 font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl">
						Welcome to Wheel of Fortune!
					</div>

					<div>
						Excepteur velit incididunt sunt pariatur adipisicing ea enim eu ea Lorem exercitation fugiat consectetur culpa. Ea non eiusmod est
						ullamco. Lorem irure dolor mollit fugiat dolore deserunt.
					</div>
					<div>
						Deserunt magna labore Lorem commodo qui consectetur quis proident tempor deserunt id dolor. Veniam sit ex dolor et ut dolore pariatur
						reprehenderit labore velit incididunt. Nisi id ea pariatur dolore nulla nulla irure duis eiusmod exercitation sit. Minim ex aliqua aute
						nostrud sunt velit laborum ut eu id esse aliqua. Id do amet occaecat excepteur aliqua. Sit veniam labore cillum ea.
					</div>
				</div>
			</main>
			<footer className="h-32 flex justify-center py-5 bg-indigo-950 text-white mt-4">
				<div className="flex flex-row">
					<div className="facebook px-2 hover:text-gray-200 hover:cursor-pointer">
						<FaFacebook size={20} />
					</div>
					<div className="github px-2 hover:text-gray-200 hover:cursor-pointer">
						<FaInstagram size={20} />
					</div>
					<div className="github px-2 hover:text-gray-200 hover:cursor-pointer">
						<FaLinkedin size={20} />
					</div>
				</div>
			</footer>
		</div>
	);
};

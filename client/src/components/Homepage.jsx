import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Homepage = () => {
	return (
		<div>
			<nav className="z-10 fixed top-0 w-full h-20 flex justify-normal bg-gradient-to-r from-blue-800 to-indigo-600 drop-shadow-md text-white">
				<div className="flex-1">
					<Link to="/home">
						<button className="h-full w-24 ml-16 transition duration-200 hover:bg-indigo-800 hover:cursor-pointer active:bg-indigo-500">
							<span className="hidden">Home</span>
							<IoHomeOutline className="w-full" size={25} />
						</button>
					</Link>
				</div>
				<div className="text-lg">
					<Link to="/signup" className="px-2">
						<button className="h-full w-24 px-4 transition duration-200 hover:bg-indigo-800  hover:cursor-pointer active:bg-indigo-500">
							Sign Up
						</button>
					</Link>
					<Link to="/login" className="pl-2 pr-8">
						<button className="h-full w-24 px-4 transition duration-200 hover:bg-indigo-800  hover:cursor-pointer active:bg-indigo-500">
							Log In
						</button>
					</Link>
				</div>
			</nav>
			<main className="h-screen">
				<div className="px-12 pt-28">
					<div className="flex justify-center mt-4 mb-4 font-semibold text-2xl xl:text-5xl lg:text-4xl md:text-3xl">Welcome to Wheel of Fortune!</div>
					<div className="lg:w-1/2 md:w-2/3 sm:h-3/4 w-full flex justify-center mt-16 p-8 bg-gray-200 bg-opacity-30 rounded-lg">
						<div className="text-lg">
							Wheel of Fortune - your one-stop-shop for earning rewards and winning coupons for your favorite brands! Our website is designed to make
							it easy and fun for customers to earn points and win exciting prizes. To get started, simply upload your receipts from participating
							brands to earn points. The more points you accumulate, the more chances you have to spin our wheel of fortune and win coupons for
							different brands. Our wheel is constantly updated with new and exciting offers, so there's always something new to win. With Wheel of
							Fortune, you'll never miss out on a chance to earn rewards and save money on your favorite products. Whether you're a frequent shopper
							or just looking for a way to earn some extra savings, our website is the perfect solution. Join the thousands of customers who have
							already earned rewards and won coupons through Wheel of Fortune. Sign up today and start spinning for your chance to win!
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

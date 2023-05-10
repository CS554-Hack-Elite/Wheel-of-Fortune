# Wheel-of-Fortune

Nowadays, almost all big consumer based companies implement a points collection and redeeming system for their customers. It is a great way to increase loyalty in their customer base. However, most small to midsize companies either lack the infrastructure or the resources to implement such a system.

We wanted to develop a centralized system for companies such that their customers can upload their bills to the website and a member of the partner company can verify and add points to their account. Users of the website can accumulate points over time and use those points to spin the “Wheel of Fortune”. The wheel would contain reward coupons created by the partner businesses and can have a limited number of winners. Once a customer wins a reward coupon, it will show up in their user dashboard. They can view it to see any Terms and Conditions that apply for that coupon. They can then show up at any of the partner companies’ locations and redeem them according to their terms of service.

## Course Technologies Used

- **Redis**
- **Firebase Authentication**
- **React**

## External Technologies Used

- **AWS**
- **ImageMagick**

## Environment Setup

- NodeJs: Install NodeJs from [here](https://nodejs.org/en).
- Redis: Install Redis from [here](https://redis.io/docs/getting-started/) and follow instructions on page to enable and start the redis server.
- ImageMagick: Install ImageMagick from [here](https://imagemagick.org/script/download.php)
- Our MongoDB database is hosted on the cloud in MongoDB Atlas and hence no prior setup is required.

## Environment Variables

Make sure both .env files (in the root directory as well as client directory) have values for all the keys.

## Start the Application

- Go to the root directory and run "`npm run install-all`". This will install all required npm packages in the server as well as client directory.
- Running "`npm start`" will trigger concurrently that will start both the server and the client.
- Navigate to `http://localhost:3000/` in your browser to access the application.

## The app is also hosted publicly on aws at

http://ec2-23-20-215-123.compute-1.amazonaws.com:3000/

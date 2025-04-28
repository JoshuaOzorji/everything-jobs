import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import logoImage from "@/public/mtn-new-logo.jpg";
import { jobSeekerLinks, legalLinks, quickLinks } from "@/lib/data";
import { FaLinkedin } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = (data) => {
		console.log(data);
	};

	const currentYear = new Date().getFullYear();

	return (
		<footer className='mt-12 text-white bg-[#0a2461] font-openSans'>
			{/* Main Footer Content */}
			<div className='w-[96%] mx-auto py-12 px-2 md:px-4 text-sm'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
					{/* Company Info & Logo */}
					<div className='lg:col-span-2'>
						<Link
							href='/'
							className='inline-block mb-6'>
							<Image
								src={logoImage}
								alt='JobSearch Logo'
								width={150}
								height={50}
								className='h-auto'
								priority
							/>
						</Link>
						<p className='mb-4 text-gray-400'>
							Find your dream job with
							our comprehensive job
							search platform. Connect
							with top employers
							across industries.
						</p>
						<div className='flex space-x-4'>
							<a
								href='#'
								className='text-gray-400 transition hover:text-white'>
								<span className='sr-only'>
									Facebook
								</span>
								<BsFacebook className='w-5 h-5' />
							</a>
							<a
								href='#'
								className='text-gray-400 transition hover:text-white'>
								<span className='sr-only'>
									Twitter
								</span>
								<RiTwitterXFill className='w-5 h-5' />
							</a>
							<a
								href='#'
								className='text-gray-400 transition hover:text-white'>
								<span className='sr-only'>
									LinkedIn
								</span>
								<FaLinkedin className='w-5 h-5' />
							</a>
						</div>
					</div>

					{/* CONTENTS */}
					{/* Quick Links */}
					<div>
						<h3 className='footer-h2'>
							Find Jobs
						</h3>

						<ul className='space-y-2'>
							{quickLinks.map(
								(
									link,
									index,
								) => (
									<li
										key={`quick-${index}`}>
										<Link
											href={
												link.href
											}
											className='text-gray-400 transition hover:text-white'>
											{
												link.label
											}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>

					{/* For Job Seekers */}
					<div>
						<h3 className='footer-h2'>
							For Job Seekers
						</h3>
						<ul className='space-y-2'>
							{/* Map through job seeker links */}
							{jobSeekerLinks.map(
								(
									link,
									index,
								) => (
									<li
										key={`seeker-${index}`}>
										<Link
											href={
												link.href
											}
											className='text-gray-400 transition hover:text-white'>
											{
												link.label
											}
										</Link>
									</li>
								),
							)}
						</ul>
					</div>

					{/* Newsletter Signup */}
					<div>
						<h3 className='footer-h2'>
							Stay Updated
						</h3>
						<p className='mb-4 text-gray-400'>
							Subscribe to our
							newsletter for the
							latest job opportunities
							and career insights.
						</p>
						<form
							onSubmit={handleSubmit(
								onSubmit,
							)}
							className='space-y-3'>
							<div>
								<label
									htmlFor='email'
									className='sr-only'>
									Email
									address
								</label>
								<input
									id='email'
									type='email'
									placeholder='Your email address'
									className='w-full px-4 py-2 text-white border border-gray-700 rounded bg-slate-200 focus:outline-none'
									{...register(
										"email",
										{
											required: "Email is required",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email address",
											},
										},
									)}
								/>
								{errors.email && (
									<p className='mt-1 text-sm text-red-400'>
										{
											errors
												.email
												.message
										}
									</p>
								)}
							</div>
							<button
								type='submit'
								className='w-full px-4 py-2 font-medium text-white transition bg-blue-600 rounded hover:bg-blue-700'>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Bottom Footer - Copyright & Legal */}
			<div className='py-3 text-xs bg-gray-950 md:px-2'>
				<div className='w-[96%] mx-auto'>
					<div className='flex flex-col items-center justify-between md:flex-row'>
						<p className='text-gray-400 '>
							© {currentYear} Your
							Job Search Company. All
							rights reserved.
						</p>
						<div className='flex mt-2 space-x-6 md:mt-0'>
							{legalLinks.map(
								(
									link,
									index,
								) => (
									<Link
										key={`legal-${index}`}
										href={
											link.href
										}
										className='text-gray-400 transition hover:text-white'>
										{
											link.label
										}
									</Link>
								),
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

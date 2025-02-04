"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userSchema } from "@/validations/userValidator";

export default function SignUpPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// State for tracking validation errors
	const [errors, setErrors] = useState<{
		firstName?: string;
		lastName?: string;
		username?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
		general?: string;
	}>({});

	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear previous errors
		setErrors({});

		// Client-side validation
		try {
			userSchema.parse({
				firstName,
				lastName,
				username,
				email,
				password,
				confirmPassword,
			});
		} catch (validationError) {
			if (validationError instanceof Error) {
				const zodError = validationError as any;
				const errorMap: any = {};

				zodError.errors.forEach((err: any) => {
					errorMap[err.path[0]] = err.message;
				});

				setErrors(errorMap);
				return;
			}
		}

		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify({
					firstName,
					lastName,
					username,
					email,
					password,
				}),
				headers: { "Content-Type": "application/json" },
			});

			const responseData = await res.json();

			if (res.ok) {
				router.push("/auth/sign-in");
			} else {
				setErrors({
					general:
						responseData.error ||
						"Sign up failed",
				});
			}
		} catch (error) {
			setErrors({
				general: "Network error. Please try again.",
			});
		}
	};

	return (
		<form onSubmit={handleSignUp}>
			<div>
				<input
					type='text'
					placeholder='First Name'
					value={firstName}
					onChange={(e) =>
						setFirstName(e.target.value)
					}
					required
				/>
				{errors.firstName && <p>{errors.firstName}</p>}
			</div>

			<div>
				<input
					type='text'
					placeholder='Last Name'
					value={lastName}
					onChange={(e) =>
						setLastName(e.target.value)
					}
					required
				/>
				{errors.lastName && <p>{errors.lastName}</p>}
			</div>

			<div>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e) =>
						setUsername(e.target.value)
					}
					required
				/>
				{errors.username && <p>{errors.username}</p>}
			</div>

			<div>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) =>
						setEmail(e.target.value)
					}
					required
				/>
				{errors.email && <p>{errors.email}</p>}
			</div>

			<div>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) =>
						setPassword(e.target.value)
					}
					required
				/>
				{errors.password && <p>{errors.password}</p>}
			</div>

			<div>
				<input
					type='password'
					placeholder='Confirm Password'
					value={confirmPassword}
					onChange={(e) =>
						setConfirmPassword(
							e.target.value,
						)
					}
					required
				/>
				{errors.confirmPassword && (
					<p>{errors.confirmPassword}</p>
				)}
			</div>

			{errors.general && <p>{errors.general}</p>}

			<button type='submit'>Sign Up</button>
		</form>
	);
}

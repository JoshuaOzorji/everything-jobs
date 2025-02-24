"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/validations/signInValidator";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		general?: string;
	}>({});

	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		try {
			signInSchema.parse({ email, password });

			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (!res?.error) {
				router.push("/dashboard");
			} else {
				setErrors({
					general: "Invalid email or password",
				});
			}
		} catch (validationError) {
			if (validationError instanceof Error) {
				const zodError = validationError as any;
				const errorMap: any = {};

				zodError.errors.forEach((err: any) => {
					errorMap[err.path[0]] = err.message;
				});

				setErrors(errorMap);
			}
		}
	};

	return (
		<form onSubmit={handleSignIn}>
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

			{errors.general && <p>{errors.general}</p>}

			<button type='submit'>Sign In</button>
		</form>
	);
}

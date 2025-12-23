import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	children: ReactNode;
}

export function Button({
	variant = "primary",
	size = "md",
	className = "",
	children,
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	const variantStyles = {
		primary:
			"bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 shadow-sm border-pink-400",
		secondary: "bg-pink-100 text-pink-700 hover:bg-pink-200 active:bg-pink-300 border-pink-200",
		outline:
			"border-2 border-pink-500 text-pink-600 hover:bg-pink-50 active:bg-pink-100 bg-transparent",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}

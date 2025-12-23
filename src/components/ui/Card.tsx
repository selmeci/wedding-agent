import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: "default" | "gradient";
}

export function Card({
	children,
	variant = "default",
	className = "",
	...props
}: CardProps) {
	const baseStyles = "rounded-xl shadow-lg p-6";

	const variantStyles = {
		default: "bg-white border border-gray-200",
		gradient: "bg-gradient-pink text-white",
	};

	return (
		<div
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	children,
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`mb-4 ${className}`} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({
	children,
	className = "",
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3 className={`text-2xl font-bold ${className}`} {...props}>
			{children}
		</h3>
	);
}

export function CardContent({
	children,
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
}

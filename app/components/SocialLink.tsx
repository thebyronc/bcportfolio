import React from "react";

type IconComponentProps = {
	className?: string;
};

type SocialLinkProps = {
	href: string;
	label: string;
	icon: React.ComponentType<IconComponentProps>;
	size?: "sm" | "md" | "lg";
	className?: string;
	newTab?: boolean;
};

const SocialLink: React.FC<SocialLinkProps> = ({
	href,
	label,
	icon: Icon,
	size = "md",
	className = "",
	newTab = true,
}) => {
	const iconSizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
	const baseClasses =
		"p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-zinc-100 transition-all duration-200 border border-transparent hover:border-zinc-600";

	const rel = newTab ? "noopener noreferrer" : undefined;
	const target = newTab ? "_blank" : undefined;

	return (
		<a href={href} target={target} rel={rel} className={`${baseClasses} ${className}`.trim()} aria-label={label}>
			<Icon className={iconSizeClass} />
		</a>
	);
};

export default SocialLink;



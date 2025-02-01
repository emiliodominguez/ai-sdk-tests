import { className } from "@/utilities/helpers";

import styles from "./button.module.scss";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	circular?: boolean;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
}

/**
 * A button component
 */
export function Button({ circular, icon, iconPosition, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			{...className(props.className, styles["btn"], styles[`icon-${iconPosition ?? "left"}`], {
				[styles["circular"]]: !!circular,
			})}
		>
			<span className={styles["icon"]}>{icon}</span>
			{props.children}
		</button>
	);
}

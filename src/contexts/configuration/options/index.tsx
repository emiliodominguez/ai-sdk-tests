import { useRef, useState } from "react";
import type { CoreSystemMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui";

import type { LLMConfiguration } from "../types";
import { predefinedSystemRoles } from "../system-roles";
import styles from "./options.module.scss";

interface OptionProps extends LLMConfiguration {
	updateConfiguration: (config: Partial<LLMConfiguration>) => void;
}

export function Options(props: OptionProps) {
	const [open, setOpen] = useState<boolean>(true);
	const systemRoleTextAreaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<>
			<AnimatePresence>
				{open && (
					<motion.div
						className={styles["overlay"]}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ ease: "easeOut", duration: 0.1 }}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{open && (
					<motion.div
						className={[styles["options"], open ? styles["open"] : ""].join(" ")}
						initial={{ opacity: 0, x: "-100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "-100%" }}
						transition={{ ease: "easeOut", duration: 0.25 }}
					>
						<h2>Options</h2>

						<label>
							<span>Predefined role</span>

							<select
								onChange={(e) => {
									if (systemRoleTextAreaRef.current?.value) {
										const confirmed = confirm("Are you sure you want to overwrite the system role message?");

										if (!confirmed) return;
									}

									props.updateConfiguration({
										systemRole: predefinedSystemRoles.find((role) => role.id === e.currentTarget.value)?.message
									});
								}}
							>
								<option value="">None</option>

								{predefinedSystemRoles.map((role) => (
									<option key={role.id} value={role.id}>
										{role.label}
									</option>
								))}
							</select>
						</label>

						<label>
							<span>System role</span>

							<textarea
								ref={systemRoleTextAreaRef}
								placeholder="Custom system role message..."
								defaultValue={props.systemRole?.content.trim()}
								onChange={(e) => props.updateConfiguration({ systemRole: getSystemRoleMessage(e.currentTarget.value) })}
							/>
						</label>
					</motion.div>
				)}
			</AnimatePresence>

			<Button className={styles["toggle"]} onClick={() => setOpen(!open)} circular>
				{open ? "Close" : "Open"}
			</Button>
		</>
	);
}

/**
 * Gets the system role message
 * @param systemRole The system role
 * @returns The system role message
 */
function getSystemRoleMessage(systemRole?: string): CoreSystemMessage | undefined {
	if (!systemRole) return;

	return {
		role: "system",
		content: systemRole
	};
}

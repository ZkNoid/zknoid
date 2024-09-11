import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function RulesAccordion({
  title,
  rules,
  defaultOpen = false,
}: {
  title: string;
  rules: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  return (
    <div
      className={
        "border-t border-t-left-accent py-[0.833vw] last:border-b last:border-b-left-accent"
      }
    >
      <div
        className={
          "flex cursor-pointer flex-row items-center justify-between font-museo text-[1.042vw] text-left-accent hover:opacity-80"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>

        <motion.svg
          width="22"
          height="12"
          viewBox="0 0 22 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className={"w-[1.146vw] h-[0.625vw]"}
        >
          <path
            d="M1 11L11 1L21 11"
            stroke="#D2FF00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
      <AnimatePresence initial={false} mode={"wait"}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className={
              "text-[0.833vw] flex items-center justify-start overflow-hidden pt-[0.417vw] font-plexsans"
            }
          >
            <div>{rules}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

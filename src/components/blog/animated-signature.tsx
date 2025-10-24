import clsx from "clsx";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export const AnimatedSignature = ({ className }: { className?: string }) => {
  const ref = useRef(null);
  const isVisible = useInView(ref);

  const draw = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: {
          delay: 0.2,
          type: "spring",
          duration: 4,
          bounce: 0.05,
          ease: "easeInOut",
        },
        opacity: { duration: 2 },
      },
    },
  };

  return (
    <motion.div ref={ref} className={clsx("h-[221px]", className)}>
      <motion.svg
        width="308.25"
        height="221.25"
        viewBox="0 0 411 295"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate={isVisible ? "visible" : "initial"}
      >
        <title>Zach Knickerbocker</title>
        <motion.path
          variants={draw}
          d="M38.77,117.35s9.24-35.77,31.11-43.15,53.82,10.92-31.11,100.5c0,0,40.75-44.51,55.61-54.34s55.82-45.33,6.39,43.97c-62.15,112.28-52.43,89.3-52.43,89.3,0,0-22.3,36.32-13.06-3.55s16.28-71.68,64.4-99.94c0,0,16.56-11.59,15.39-.96s-3.61,19.01,6.24,7.51,22.42-32.86,22.42-32.86c0,0,9.55-19.01,6.92-1.95,0,0-1.36,5.46,4.68,1.07s9.75-11.99,7.9,1.07c0,0,18.91-4.87,34.71-4.97,0,0,59.57-51.28,64.35-58.69s-46.11,40.85-46.11,40.85c0,0-19.97,16.92-26.22,39.71s-16.86,65.08.9,1.99c8.87-31.49,32.34-95.96,38.31-110.94s-5.83,10.34-14.98,36.58c-9.15,26.24-10.87,39.04-10.87,39.04,8.04,11.72,64.06,101.85,19.22,30.94-12.94-20.47-11.43-25.28-3.35-22.36s10.35,6.9,18.94-2.58c11.16-12.31,10.25-32.71,7.07-1.17,0,0-.4,6.11,5.83-4.83s.98,2.72,5.04,2.45,1.33-6.22,9.68-2.45c0,0,3.28,1.64,6.63-2.26s3.85,2.03,13.97.49,31.39-20.02,41.66-53.12-13.86-21.36-24.95,9.95-27.07,79.09-12.07,92.62,29.23-62.25-5.77-45.96,6.82,6.89,23.17-4.42,21.41-9.29,21.41-9.29c0,0,42.69,2.45,58.61-16.14,0,0-9.52,7.99-9.52,15.33"
          stroke="currentColor"
          fill="#fff"
          strokeWidth="5"
          strokeMiterlimit="10"
        />
      </motion.svg>
    </motion.div>
  );
};

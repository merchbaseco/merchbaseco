import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import * as React from "react";

type CursorContextType = {
  cursorPos: { x: number; y: number };
  active: boolean;
  cursorRef: React.RefObject<HTMLDivElement | null>;
  pressed: boolean;
};

const [LocalCursorProvider, useCursor] = getStrictContext<CursorContextType>("CursorContext");

type CursorProviderProps = {
  children: React.ReactNode;
  global?: boolean;
};

function CursorProvider({ children }: CursorProviderProps) {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [active, setActive] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const cursorRef = React.useRef<HTMLDivElement>(null);
  const isCursorHiddenRef = React.useRef(false);

  React.useEffect(() => {
    const id = "__cursor_none_style__";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .animate-ui-cursor-none, .animate-ui-cursor-none * { cursor: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  React.useEffect(() => {
    const handlePointerDown = () => {
      setPressed(true);
    };

    const handlePointerUp = () => {
      setPressed(false);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
      setActive(true);

      if (!isCursorHiddenRef.current) {
        document.documentElement.classList.add("animate-ui-cursor-none");
        isCursorHiddenRef.current = true;
      }
    };

    const handlePointerOut = (event: PointerEvent | MouseEvent) => {
      if (event instanceof PointerEvent && event.relatedTarget === null) {
        setActive(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") setActive(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("mouseout", handlePointerOut, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("mouseout", handlePointerOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (isCursorHiddenRef.current) {
        document.documentElement.classList.remove("animate-ui-cursor-none");
      }
    };
  }, []);

  return (
    <LocalCursorProvider value={{ cursorPos, active, cursorRef, pressed }}>
      {children}
    </LocalCursorProvider>
  );
}

type CursorProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(function Cursor(
  { style, ...props },
  forwardedRef,
) {
  const { cursorPos, active, cursorRef, pressed } = useCursor();

  React.useEffect(() => {
    const root = document.documentElement;

    if (active) {
      root.classList.add("animate-ui-cursor-none");
    } else {
      root.classList.remove("animate-ui-cursor-none");
    }

    return () => {
      root.classList.remove("animate-ui-cursor-none");
    };
  }, [active]);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      cursorRef.current = node ?? null;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef, cursorRef],
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={setRef}
          data-slot="cursor"
          data-active={active}
          aria-hidden="true"
          style={{
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 9999,
            position: "fixed",
            top: cursorPos.y,
            left: cursorPos.x,
            ...style,
          }}
          transformTemplate={(_, generatedTransform) =>
            `translate(-50%,-50%) perspective(600px) ${generatedTransform}`
          }
          initial={{ scale: 0, opacity: 0, rotateX: -3, rotateY: 0 }}
          animate={{
            scale: pressed ? 0.94 : 1.02,
            opacity: 1,
            rotateX: pressed ? 9 : -3,
            rotateY: pressed ? -3 : 0,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 14 }}
          {...props}
        />
      )}
    </AnimatePresence>
  );
});

function getStrictContext<T>(name?: string): readonly [
  ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => React.JSX.Element,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined);

  const Provider = ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => <Context.Provider value={value}>{children}</Context.Provider>;

  const useSafeContext = () => {
    const ctx = React.useContext(Context);
    if (ctx === undefined) {
      throw new Error(`useContext must be used within ${name ?? "a Provider"}`);
    }
    return ctx;
  };

  return [Provider, useSafeContext] as const;
}

export {
  CursorProvider,
  Cursor,
  useCursor,
  type CursorProviderProps,
  type CursorProps,
  type CursorContextType,
};

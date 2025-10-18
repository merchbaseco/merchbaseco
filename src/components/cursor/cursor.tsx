import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import * as React from "react";

type CursorContextType = {
  cursorPos: { x: number; y: number };
  active: boolean;
  cursorRef: React.RefObject<HTMLDivElement | null>;
};

const [LocalCursorProvider, useCursor] = getStrictContext<CursorContextType>("CursorContext");

type CursorProviderProps = {
  children: React.ReactNode;
  global?: boolean;
};

function CursorProvider({ children }: CursorProviderProps) {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [active, setActive] = React.useState(false);

  const cursorRef = React.useRef<HTMLDivElement>(null);

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
    const handlePointerMove = (event: PointerEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
      setActive(true);
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
    };
  }, []);

  return (
    <LocalCursorProvider value={{ cursorPos, active, cursorRef }}>
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
  const { cursorPos, active, cursorRef } = useCursor();

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
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
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

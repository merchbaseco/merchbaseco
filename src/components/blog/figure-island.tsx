import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type ComponentModule = {
  default: ComponentType<Record<string, unknown>>;
};

const figureModules = import.meta.glob<ComponentModule>("./figures/**/*.tsx");

type BlogFigureIslandProps = {
  name: string;
  figureProps?: Record<string, unknown>;
  className?: string;
};

function resolveModuleLoader(name: string): (() => Promise<ComponentModule>) | undefined {
  return Object.entries(figureModules).find(([path]) => {
    const normalizedPath = path.replace(/\\/g, "/");
    const baseName = normalizedPath
      .split("/")
      .pop()
      ?.replace(/\.(jsx|tsx|js|ts)$/, "");

    return baseName === name;
  })?.[1];
}

export default function BlogFigureIsland({ name, figureProps, className }: BlogFigureIslandProps) {
  const [Component, setComponent] = useState<ComponentType<Record<string, unknown>>>();

  const loader = useMemo(() => resolveModuleLoader(name), [name]);

  useEffect(() => {
    let isMounted = true;

    if (!loader) {
      setComponent(undefined);
      return () => {
        isMounted = false;
      };
    }

    loader()
      .then((module) => {
        if (!isMounted) {
          return;
        }
        setComponent(() => module.default);
      })
      .catch(() => {
        if (isMounted) {
          setComponent(undefined);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loader]);

  if (!Component) {
    return <div className={className} data-figure-fallback="missing" />;
  }

  const componentProps: Record<string, unknown> = { ...(figureProps ?? {}) };

  if (className) {
    const existingClassName = componentProps.className;
    if (typeof existingClassName === "string") {
      componentProps.className = cn(existingClassName, className);
    } else {
      componentProps.className = className;
    }
  }

  return <Component key={name} {...componentProps} />;
}

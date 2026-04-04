"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "dark" | "light" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, asChild = false, variant = "dark", size = "lg", ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLButtonElement | null>(null);
    const [isListening, setIsListening] = React.useState(false);
    const [circles, setCircles] = React.useState<
      Array<{ id: number; x: number; y: number; color: string; fadeState: "in" | "out" | null }>
    >([]);
    const lastAddedRef = React.useRef(0);

    const circleStart = variant === "light" ? "#803d3b" : "#e4c59e";
    const circleEnd = variant === "light" ? "#5c3432" : "#af8260";

    const createCircle = React.useCallback(
      (x: number, y: number) => {
        const buttonWidth = internalRef.current?.offsetWidth ?? 0;
        const xPos = buttonWidth ? x / buttonWidth : 0.5;
        const color = `linear-gradient(to right, ${circleStart} ${xPos * 100}%, ${circleEnd} ${xPos * 100}%)`;
        setCircles((prev) => [...prev, { id: Date.now(), x, y, color, fadeState: null }]);
      },
      [circleStart, circleEnd],
    );

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLElement>) => {
        if (!isListening) return;
        const currentTime = Date.now();
        if (currentTime - lastAddedRef.current > 100) {
          lastAddedRef.current = currentTime;
          const rect = event.currentTarget.getBoundingClientRect();
          createCircle(event.clientX - rect.left, event.clientY - rect.top);
        }
      },
      [isListening, createCircle],
    );

    const handlePointerEnter = React.useCallback(() => setIsListening(true), []);
    const handlePointerLeave = React.useCallback(() => setIsListening(false), []);

    React.useEffect(() => {
      for (const circle of circles) {
        if (!circle.fadeState) {
          setTimeout(
            () => setCircles((prev) => prev.map((c) => (c.id === circle.id ? { ...c, fadeState: "in" } : c))),
            0,
          );
          setTimeout(
            () => setCircles((prev) => prev.map((c) => (c.id === circle.id ? { ...c, fadeState: "out" } : c))),
            1000,
          );
          setTimeout(
            () => setCircles((prev) => prev.filter((c) => c.id !== circle.id)),
            2200,
          );
        }
      }
    }, [circles]);

    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        internalRef.current = node;
        if (!forwardedRef) return;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [forwardedRef],
    );

    const sizeClass =
      size === "sm" ? "px-4 py-1.5 text-sm" : size === "md" ? "px-6 py-2.5 text-base" : "px-8 py-3 text-base";

    const variantClass =
      variant === "light"
        ? "bg-[rgba(228,197,158,0.18)] text-[#322c2b] backdrop-blur-sm before:shadow-[inset_0_0_0_1px_rgba(128,61,59,0.3),inset_0_0_16px_0_rgba(128,61,59,0.06),inset_0_-3px_12px_0_rgba(128,61,59,0.1),0_1px_3px_0_rgba(0,0,0,0.12),0_4px_12px_0_rgba(0,0,0,0.10)]"
        : variant === "ghost"
          ? "bg-transparent text-[#e4c59e]/80 before:shadow-[inset_0_0_0_1px_rgba(228,197,158,0.2),0_1px_3px_0_rgba(0,0,0,0.2)]"
          : "bg-[rgba(50,44,43,0.5)] text-[#e4c59e] backdrop-blur-lg before:shadow-[inset_0_0_0_1px_rgba(228,197,158,0.25),inset_0_0_16px_0_rgba(228,197,158,0.08),inset_0_-3px_12px_0_rgba(228,197,158,0.12),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.45)]";

    const buttonClass = cn(
      "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap cursor-pointer rounded-3xl font-medium leading-6",
      sizeClass,
      variantClass,
      "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[inherit] before:content-['']",
      "before:mix-blend-multiply before:transition-transform before:duration-300",
      "active:before:scale-[0.975]",
      className,
    );

    const circleElements = circles.map(({ id, x, y, color, fadeState }) => (
      <div
        key={id}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 size-3 rounded-full blur-lg",
          "z-[-1] transition-opacity duration-300",
          fadeState === "in" && "opacity-75",
          fadeState === "out" && "opacity-0 duration-[1.2s]",
          !fadeState && "opacity-0",
        )}
        style={{ left: x, top: y, background: color }}
      />
    ));

    if (asChild) {
      // biome-ignore lint/suspicious/noExplicitAny: cloneElement requires Any to merge props into a generic child element type
      const child = React.Children.only(children) as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(buttonClass, child.props.className),
        onPointerMove: handlePointerMove,
        onPointerEnter: handlePointerEnter,
        onPointerLeave: handlePointerLeave,
        ref: setRef,
        children: (
          <>
            {circleElements}
            {child.props.children}
          </>
        ),
      });
    }

    return (
      <button
        ref={setRef}
        type="button"
        className={buttonClass}
        onPointerMove={handlePointerMove as React.PointerEventHandler<HTMLButtonElement>}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        {circleElements}
        {children}
      </button>
    );
  },
);

HoverButton.displayName = "HoverButton";

export { HoverButton };

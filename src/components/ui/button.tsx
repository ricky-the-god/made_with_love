"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:z-[1] before:mix-blend-multiply before:transition-transform before:duration-300 active:before:scale-[0.975]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 before:shadow-[inset_0_0_0_1px_rgba(228,197,158,0.22),inset_0_-2px_8px_0_rgba(228,197,158,0.1),0_1px_3px_0_rgba(0,0,0,0.3),0_3px_10px_0_rgba(0,0,0,0.2)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_1px_2px_0_rgba(0,0,0,0.25)]",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 before:shadow-[inset_0_0_0_1px_rgba(175,130,96,0.12),0_1px_2px_0_rgba(0,0,0,0.06)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 before:shadow-[inset_0_0_0_1px_rgba(175,130,96,0.15),0_1px_2px_0_rgba(0,0,0,0.06)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 before:shadow-none",
        link: "text-primary underline-offset-4 hover:underline before:hidden",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type CircleData = {
  id: number
  x: number
  y: number
  color: string
  fadeState: "in" | "out" | null
}

function useCircleTrail(disabled: boolean) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [isListening, setIsListening] = React.useState(false)
  const [circles, setCircles] = React.useState<CircleData[]>([])
  const lastAddedRef = React.useRef(0)

  const createCircle = React.useCallback((x: number, y: number) => {
    const w = ref.current?.offsetWidth ?? 0
    const xPos = w ? x / w : 0.5
    const color = `linear-gradient(to right, #e4c59e ${xPos * 100}%, #af8260 ${xPos * 100}%)`
    setCircles((prev) => [...prev, { id: Date.now(), x, y, color, fadeState: null }])
  }, [])

  const handlers = React.useMemo(
    () => ({
      onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
        if (!isListening) return
        const now = Date.now()
        if (now - lastAddedRef.current > 100) {
          lastAddedRef.current = now
          const rect = e.currentTarget.getBoundingClientRect()
          createCircle(e.clientX - rect.left, e.clientY - rect.top)
        }
      },
      onPointerEnter: () => setIsListening(true),
      onPointerLeave: () => setIsListening(false),
    }),
    [isListening, createCircle],
  )

  React.useEffect(() => {
    for (const circle of circles) {
      if (!circle.fadeState) {
        setTimeout(
          () => setCircles((prev) => prev.map((c) => (c.id === circle.id ? { ...c, fadeState: "in" } : c))),
          0,
        )
        setTimeout(
          () => setCircles((prev) => prev.map((c) => (c.id === circle.id ? { ...c, fadeState: "out" } : c))),
          1000,
        )
        setTimeout(
          () => setCircles((prev) => prev.filter((c) => c.id !== circle.id)),
          2200,
        )
      }
    }
  }, [circles])

  return { ref, circles: disabled ? [] : circles, handlers: disabled ? {} : handlers }
}

function CircleTrail({ circles }: { circles: CircleData[] }) {
  return (
    <>
      {circles.map(({ id, x, y, color, fadeState }) => (
        <span
          key={id}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute z-[-1] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg transition-opacity duration-300",
            fadeState === "in" && "opacity-75",
            fadeState === "out" && "opacity-0 duration-[1.2s]",
            !fadeState && "opacity-0",
          )}
          style={{ left: x, top: y, background: color }}
        />
      ))}
    </>
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const isLink = variant === "link"
  const { ref, circles, handlers } = useCircleTrail(!!disabled || isLink)
  const buttonClass = cn(buttonVariants({ variant, size, className }))

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      ref.current = node
    },
    [ref],
  )

  if (asChild) {
    const elementChild = React.Children.toArray(children).find((child) => React.isValidElement(child)) as
      | React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement>; href?: string }>
      | undefined

    if (elementChild) {
      return React.cloneElement(elementChild, {
        ...handlers,
        ref: setRef,
        "data-slot": "button",
        "data-variant": variant ?? "default",
        "data-size": size ?? "default",
        className: cn(buttonClass, elementChild.props.className),
        children: (
          <>
            <CircleTrail circles={circles} />
            {elementChild.props.children}
          </>
        ),
      } as React.HTMLAttributes<HTMLElement>)
    }
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      className={buttonClass}
      {...(handlers as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...props}
    >
      <CircleTrail circles={circles} />
      {children}
    </button>
  )
}

export { Button, buttonVariants }

"use client"

import { ToggleGroup } from "@base-ui/react"
import { useDrag } from "@use-gesture/react"
import { type UIEvent, useEffect, useState } from "react"
import { CarouselCategoryScrollIndicator } from "@/components/carousel-category/carousel-category-scroll-indicator"
import { CarouselCategoryToggle } from "@/components/carousel-category/carousel-category-toggle"
import { categories } from "@/components/carousel-category/categories"

type CategoryValue = (typeof categories)[number]["value"]

type CarouselCategoryProps = {
  onCategoryChange?: (category: string) => void
}

export function CarouselCategory(props: CarouselCategoryProps) {
  const { onCategoryChange } = props
  const [carousel, setCarousel] = useState<HTMLDivElement | null>(null)
  const [scrollX, setScrollX] = useState(0)
  const [scrollXMax, setScrollXMax] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue>(categories[0].value)

  const bind = useDrag(
    ({ memo, movement: [mx] }) => {
      if (!carousel) return

      if (!memo) {
        memo = carousel.scrollLeft
      }

      carousel.scrollLeft = memo - mx

      return memo
    },
    {
      axis: "x",
      filterTaps: true,
      pointer: {
        keys: false,
      },
    },
  )

  function onScroll(event: UIEvent<HTMLDivElement>) {
    setScrollX(event.currentTarget.scrollLeft)
  }

  function onValueChange(value: CategoryValue[]) {
    if (value.length > 0) {
      setSelectedCategory(value[0])
      onCategoryChange?.(value[0])
    }
  }

  // Recalculate the max scroll distance whenever the carousel resizes
  useEffect(() => {
    if (!carousel) return

    const observer = new ResizeObserver(() => {
      setScrollXMax(carousel.scrollWidth - carousel.clientWidth)
    })

    observer.observe(carousel)

    return () => {
      observer.disconnect()
    }
  }, [carousel])

  return (
    <div className="relative overflow-hidden">
      {/* Scrollable */}
      <div
        className="scrollbar-hidden touch-pan-x overflow-x-auto"
        onScroll={onScroll}
        ref={setCarousel}
        {...bind()}
      >
        <ToggleGroup
          className="flex gap-x-12 py-12"
          onValueChange={onValueChange}
          value={[selectedCategory]}
        >
          {categories.map((category) => (
            <CarouselCategoryToggle
              data-is-selected={selectedCategory === category.value}
              key={category.value}
              value={category.value}
            >
              {category.label}
            </CarouselCategoryToggle>
          ))}
        </ToggleGroup>
      </div>

      {/* Scroll indicators */}
      <CarouselCategoryScrollIndicator isHidden={scrollX < 1} variant="start" />
      <CarouselCategoryScrollIndicator isHidden={scrollXMax - scrollX < 1} variant="end" />
    </div>
  )
}

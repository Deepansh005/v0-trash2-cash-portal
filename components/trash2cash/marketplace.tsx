"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { WasteItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

export default function Marketplace({
  items,
  onBuy,
}: {
  items: WasteItem[]
  onBuy: (item: WasteItem) => void
}) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No items match your filters.</p>
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn("group overflow-hidden rounded-xl transition-all zoom-on-hover hover:shadow-lg")}
        >
          <CardContent className="p-0">
            <div className="relative">
              {item.images && item.images.length > 0 ? (
                <div className="relative">
                  <Carousel className="relative">
                    <CarouselContent className="aspect-[4/3]">
                      {item.images.map((src, idx) => (
                        <CarouselItem key={`${item.id}_${idx}`} className="relative">
                          <img
                            src={src || "/placeholder.svg?height=300&width=400&query=recycled%20material"}
                            alt={`${item.type} preview ${idx + 1}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-2 bg-background/80 backdrop-blur-sm" />
                    <CarouselNext className="-right-2 bg-background/80 backdrop-blur-sm" />
                  </Carousel>
                </div>
              ) : (
                <div className="aspect-[4/3] relative">
                  <img
                    src={`/placeholder.jpg?height=300&width=400&query=${encodeURIComponent(
                      `waste ${item.type} material`,
                    )}`}
                    alt={`${item.type} image`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/70 to-transparent backdrop-blur-sm">
                  <div className="pointer-events-auto flex items-center gap-2">
                    <Button size="sm" className="btn-ripple">
                      Buy
                    </Button>
                    <Button size="sm" variant="secondary" className="btn-ripple">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{item.type}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <Badge>+{item.credits} T2C</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Qty: </span>
                  {item.quantity}
                </div>
                <div>
                  <span className="text-muted-foreground">Owner: </span>
                  {item.owner}
                </div>
                <div>
                  <span className="text-muted-foreground">Loc: </span>
                  {item.location}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Credits:</span>{" "}
              <span className="font-medium">{item.credits}</span>
            </div>
            <Button onClick={() => onBuy(item)} disabled={item.status !== "Available"} className="rounded-lg">
              {item.status === "Available" ? "Buy / Request Trade" : "Unavailable"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { WasteItem } from "@/lib/mock-data"

const QUALITY_MULTIPLIER: Record<string, number> = {
  A: 1.2,
  B: 1.0,
  C: 0.8,
}

export default function ListingForm({ onCreate }: { onCreate: (item: WasteItem, earnedCredits: number) => void }) {
  const [type, setType] = useState("Plastic")
  const [quantity, setQuantity] = useState<number>(10)
  const [quality, setQuality] = useState<"A" | "B" | "C">("B")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("Local")
  const [status, setStatus] = useState<WasteItem["status"]>("Available")
  const [images, setImages] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const credits = useMemo(
    () => Math.max(1, Math.round(quantity * (QUALITY_MULTIPLIER[quality] ?? 1))),
    [quantity, quality],
  )

  function handleImages(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files)
    arr.forEach((f) => {
      const url = URL.createObjectURL(f)
      setImages((prev) => [...prev, url])
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 3) {
      setStep((s) => (s + 1) as 2 | 3)
      return
    }
    const item: WasteItem = {
      id: "tmp",
      type,
      quantity,
      owner: "You",
      location,
      credits,
      description: description || "User provided listing.",
      status,
      images,
    }
    onCreate(item, credits)
    setType("Plastic")
    setQuantity(10)
    setQuality("B")
    setDescription("")
    setLocation("Local")
    setStatus("Available")
    setImages([])
    setStep(1)
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <ol className="flex items-center gap-3 text-sm">
        <li className={`px-2 py-1 rounded-md ${step >= 1 ? "bg-accent" : "bg-muted"}`}>Step 1</li>
        <li className={`px-2 py-1 rounded-md ${step >= 2 ? "bg-accent" : "bg-muted"}`}>Step 2</li>
        <li className={`px-2 py-1 rounded-md ${step >= 3 ? "bg-accent" : "bg-muted"}`}>Step 3</li>
      </ol>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label>Waste Type</Label>
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Plastic</option>
                  <option>Metal</option>
                  <option>Glass</option>
                  <option>Paper</option>
                  <option>Organic</option>
                  <option>Electronics</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value || 0))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Quality/Grade</Label>
                  <select
                    className="h-9 rounded-md border bg-background px-2"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as "A" | "B" | "C")}
                  >
                    <option value="A">A (High)</option>
                    <option value="B">B (Medium)</option>
                    <option value="C">C (Low)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  placeholder="Any details about the material, contamination, sorting, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label>Location</Label>
                  <select
                    className="h-9 rounded-md border bg-background px-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option>Local</option>
                    <option>Regional</option>
                    <option>International</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label>Status</Label>
                  <select
                    className="h-9 rounded-md border bg-background px-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as WasteItem["status"])}
                  >
                    <option>Available</option>
                    <option>In-Process</option>
                    <option>Sold</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label>Images</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImages(e.target.files)}
                />
                <div className="flex items-center gap-2">
                  <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                    Upload Images
                  </Button>
                  <span className="text-xs text-muted-foreground">{images.length} selected</span>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {images.map((src, i) => (
                      <img
                        key={i}
                        src={src || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-full object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Estimated Credits: </span>
          <span className="font-medium">{credits}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => Math.max(1, (s - 1) as 1 | 2))}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button type="submit" className="rounded-lg btn-ripple">
            {step < 3 ? "Next" : "Create Listing"}
          </Button>
        </div>
      </div>
    </form>
  )
}

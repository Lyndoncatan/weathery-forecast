"use client"

import { useState } from "react"
import Link from "next/link"
import { Compass, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col gap-6 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Weathery</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link
              href="#"
              className="text-base font-medium text-primary hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Alerts
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}


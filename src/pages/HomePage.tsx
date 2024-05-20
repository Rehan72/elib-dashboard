// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import {  Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react"
// import { Link } from "react-router-dom"


function HomePage() {
  return (
    <>
    <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">DashBoard</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no Book
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button className="mt-4">Add Books</Button>
            </div>
          </div>
          </>
  )
}

export default HomePage
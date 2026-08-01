"use client"

import { useServices } from "@/hooks/use-services"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddServiceModal } from "./_components/addServiceModal"

export default function AdminDashboardPage() {
  // Fetching data using the React Query hook we discussed earlier
  const { data: services, isLoading, isError } = useServices()

  if (isLoading) {
    return <div className="p-8 text-center font-mono">Loading services...</div>
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500 font-mono">Failed to load data from backend.</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Service Management</h1>
        <AddServiceModal />
      </div>

      {/* Data Table Section */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!services || services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No services found. Click &quot;Add New Service&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              services.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {service.description}
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell className="text-right">
                    {/* We will implement Edit/Delete logic here later */}
                    <button className="text-sm text-red-500 hover:underline">Delete</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
"use client"

import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminUsers, useBanUser, useUnbanUser } from "@/features/admin/hooks"
import { cn } from "@/lib/utils"
import { AlertCircle, Ban } from "lucide-react"
import { motion } from "motion/react"

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useAdminUsers()
  const { mutate: ban, isPending: isBanning } = useBanUser()
  const { mutate: unban, isPending: isUnbanning } = useUnbanUser()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">People</h1>
        <p className="mt-1 text-muted-foreground">
          Manage customers and technicians.
        </p>
      </div>

      {isLoading && (
        <>
          <TableSkeleton rows={5} cols={5} />
        </>
      )}
      {isError && (
        <div className="flex h-40 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> Failed to load users.
        </div>
      )}
      {!isLoading && !isError && (!users || users.length === 0) && (
        <p className="py-16 text-center text-muted-foreground">
          No users found.
        </p>
      )}

      {!isLoading && !isError && users && users.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        user.status === "BANNED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600"
                      )}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={
                        user.status === "BANNED" ? "outline" : "destructive"
                      }
                      size="sm"
                      disabled={isBanning || isUnbanning}
                      onClick={() =>
                        user.status === "BANNED" ? unban(user.id) : ban(user.id)
                      }
                    >
                      <Ban />
                      {user.status === "BANNED" ? "Unban" : "Ban"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  )
}

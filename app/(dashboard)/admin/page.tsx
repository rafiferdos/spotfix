"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  useAdminBookings,
  useAdminCategories,
  useAdminUsers,
  useBanUser,
  useCreateCategory,
} from "@/features/admin/hooks"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  Ban,
  Calendar,
  FolderKanban,
  ShieldCheck,
  Users,
} from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

type Tab = "users" | "bookings" | "categories"
const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "categories", label: "Categories", icon: FolderKanban },
]

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("users")

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-6xl p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, bookings, and service categories.
        </p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-full bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition",
              tab === id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTab />}
      {tab === "bookings" && <BookingsTab />}
      {tab === "categories" && <CategoriesTab />}
    </motion.div>
  )
}

function UsersTab() {
  const { data: users, isLoading, isError } = useAdminUsers()
  const { mutate: ban, isPending } = useBanUser()

  if (isLoading) return <CenteredSpinner />
  if (isError) return <CenteredError message="Failed to load users." />
  if (!users || users.length === 0)
    return <EmptyState message="No users found." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border bg-card"
    >
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
                  variant="destructive"
                  size="sm"
                  disabled={user.status === "BANNED" || isPending}
                  onClick={() => ban(user.id)}
                >
                  <Ban />
                  {user.status === "BANNED" ? "Banned" : "Ban"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}

function BookingsTab() {
  const { data: bookings, isLoading, isError } = useAdminBookings()

  if (isLoading) return <CenteredSpinner />
  if (isError) return <CenteredError message="Failed to load bookings." />
  if (!bookings || bookings.length === 0)
    return <EmptyState message="No bookings yet." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-mono text-xs">
                {b.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                  {b.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(b.scheduleDate).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(b.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}

function CategoriesTab() {
  const { data: categories, isLoading, isError } = useAdminCategories()
  const { mutate: create, isPending } = useCreateCategory()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) return
    create(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setOpen(false)
          setName("")
          setDescription("")
        },
      }
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>New Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || isPending}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <CenteredSpinner />
      ) : isError ? (
        <CenteredError message="Failed to load categories." />
      ) : !categories || categories.length === 0 ? (
        <EmptyState message="No categories yet." />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="font-medium">{cat.name}</h3>
              </div>
              {cat.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function CenteredSpinner() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Spinner />
    </div>
  )
}
function CenteredError({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center gap-2 text-destructive">
      <AlertCircle className="h-5 w-5" />
      {message}
    </div>
  )
}
function EmptyState({ message }: { message: string }) {
  return <p className="py-16 text-center text-muted-foreground">{message}</p>
}

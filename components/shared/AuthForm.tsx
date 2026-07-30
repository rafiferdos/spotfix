"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form"

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>
  label: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface DynamicFormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: (values: T) => void
  fields: FormFieldConfig<T>[]
  submitText?: string
}

export function AuthForm<T extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitText = "Submit",
}: DynamicFormProps<T>) {
  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((config) => (
        <Controller
          key={config.name as string}
          name={config.name}
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {config.label}
              </label>

              <Input
                {...field}
                id={field.name}
                type={config.type || "text"}
                placeholder={config.placeholder}
                aria-invalid={fieldState.invalid}
                className={fieldState.invalid ? "border-red-500" : ""}
              />

              {fieldState.invalid && (
                <p className="text-sm text-red-500">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />
      ))}

      <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : submitText}
      </Button>
    </form>
  )
}

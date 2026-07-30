"use client";

import { Controller, FieldValues, UseFormReturn, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 1. Added fieldType and options to handle FixItNow role selections
export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  fieldType?: "input" | "select"; 
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  options?: { label: string; value: string }[]; 
  action?: React.ReactNode;
};

interface DynamicFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  fields: FormFieldConfig<T>[];
  children?: React.ReactNode;
}

export function AuthForm<T extends FieldValues>({
  form,
  onSubmit,
  fields,
  children,
}: DynamicFormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        {fields.map((config) => (
          <Controller
            key={config.name as string}
            name={config.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>{config.label}</Label>
                  {config.action && config.action}
                </div>
                
                {/* 2. Dynamically switch between Select and Input */}
                {config.fieldType === "select" ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger 
                      id={field.name} 
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder={config.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    {...field}
                    id={field.name}
                    type={config.type || "text"}
                    placeholder={config.placeholder}
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? "border-red-500" : ""}
                  />
                )}
                
                {fieldState.invalid && (
                  <p className="text-sm font-medium text-red-500">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
        ))}
      </div>
      
      {/* 3. Mounts your shadcn CardFooter securely at the bottom */}
      <div className="mt-6">
        {children}
      </div>
    </form>
  );
}
import { InvoiceForm } from "@/components/invoice-form"

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-16">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Commission Order Form
        </p>
      </div>
      <InvoiceForm />
    </main>
  )
}

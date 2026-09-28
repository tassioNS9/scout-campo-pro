import { ArrowLeft, Shield } from "lucide-react";

import { listTimes } from "@/app/actions/list-times";
import { Button } from "@/components/ui/button";

import AddTimeButton from "./components/AddTimeButton";
import FilterComponent from "./components/FilterComponent";
import ListTimes from "./components/ListTimes";

export default async function TimesPage() {
  const times = await listTimes();

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(160deg,var(--scout-bg)_0%,var(--scout-bg-alt)_100%)]">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button className="border-scout-border bg-scout-card text-scout-muted flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2">
              <ArrowLeft size={16} />
              <span className="text-sm">Voltar</span>
            </Button>

            <div className="flex items-center gap-2">
              <div className="border-scout-green-border bg-scout-green-dim shrink-0 rounded-lg border p-2">
                <Shield size={18} className="text-scout-green" />
              </div>

              <div>
                <h1 className="text-scout-text text-[clamp(1rem,4vw,1.4rem)] leading-tight">
                  Gerenciamento de Times
                </h1>
                <p className="text-scout-muted text-[0.78rem]">
                  Cadastre e organize seus times
                </p>
              </div>
            </div>
          </div>

          <AddTimeButton />
        </div>

        {/* Filters */}
        <FilterComponent times={times} />

        {times && times.length > 0 ? (
          <ListTimes times={times} />
        ) : (
          <AddTimeButton />
        )}
      </div>
    </div>
  );
}

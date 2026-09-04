"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export function PrintBar() {
  return (
    <div className="no-print mx-auto mb-6 flex w-[210mm] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 rounded-lg border border-black/10 bg-white px-4 py-3 shadow-sm">
      <Link
        href="/"
        className="flex items-center gap-2 text-[13px] text-black/60 transition hover:text-black"
      >
        <ArrowLeft className="size-4" />
        Back to the site
      </Link>

      <div className="flex items-center gap-3">
        <p className="hidden text-[12px] text-black/50 sm:block">
          Print &rarr; &ldquo;Save as PDF&rdquo; for a clean two-page CV.
        </p>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-[13px] font-medium text-white transition hover:bg-black/80"
        >
          <Printer className="size-4" />
          Save as PDF
        </button>
      </div>
    </div>
  );
}

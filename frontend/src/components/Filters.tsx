import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { LeadFilters, LeadSort, LeadSource, LeadStatus } from "../types";

interface FiltersProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
}

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];
const sorts: { label: string; value: LeadSort }[] = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
];

interface FilterSelectOption<T extends string> {
  label: string;
  value: T | "";
}

interface FilterSelectProps<T extends string> {
  value: T | "";
  options: FilterSelectOption<T>[];
  onChange: (value: T | "") => void;
}

const FilterSelect = <T extends string>({
  value,
  options,
  onChange,
}: FilterSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-full border border-[#d7e4dc] bg-[#f8faf8] px-4 py-2 text-left text-sm text-slate-800 outline-none transition hover:border-[#bfd8cb] hover:bg-white focus:border-[#8fb8a5] focus:bg-white focus:ring-2 focus:ring-[#acd0c0]/35"
      >
        <span className="truncate">{selectedOption.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="listbox"
          className="absolute left-0 top-full z-30 mt-2 max-h-64 min-w-full overflow-hidden rounded-xl border border-[#d7e4dc] bg-white p-1 shadow-xl shadow-slate-900/10"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value || option.label}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-[#eef7f2] font-semibold text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export const Filters = ({ filters, onChange }: FiltersProps) => {
  const [search, setSearch] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    if ((filters.search ?? "") !== debouncedSearch) {
      onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  const updateFilter = <K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K] | ""
  ): void => {
    onChange({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  return (
    <section className="rounded-[18px] border border-[#d7e4dc] bg-white px-4 py-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_160px_140px_auto]">
        <input
          type="search"
          spellCheck={false}
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email..."
          className="w-full rounded-full border border-[#d7e4dc] bg-[#f8faf8] px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-[#8fb8a5] focus:bg-white focus:ring-2 focus:ring-[#acd0c0]/35"
        />
      <FilterSelect<LeadStatus>
        value={filters.status ?? ""}
        onChange={(value) => updateFilter("status", value)}
        options={[
          { label: "All Status", value: "" },
          ...statuses.map((status) => ({ label: status, value: status })),
        ]}
      />
      <FilterSelect<LeadSource>
        value={filters.source ?? ""}
        onChange={(value) => updateFilter("source", value)}
        options={[
          { label: "All Sources", value: "" },
          ...sources.map((source) => ({ label: source, value: source })),
        ]}
      />
      <FilterSelect<LeadSort>
        value={filters.sort ?? "latest"}
        onChange={(value) => updateFilter("sort", value || "latest")}
        options={sorts}
      />
      <button
        type="button"
        onClick={() => {
          setSearch("");
          onChange({ sort: "latest", page: 1 });
        }}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
      >
        Clear Filters
      </button>
      </div>
    </section>
  );
};

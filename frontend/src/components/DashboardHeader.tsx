// Dashboard header.
import { ReactElement } from "react";
import { User } from "../types";

interface IDashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const DashboardHeader = ({
  user,
  onLogout,
}: IDashboardHeaderProps): ReactElement => {
  return (
    <header className="border-b border-[#d7e4dc] bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#acd0c0] shadow-sm ring-1 ring-[#8fb8a5]/40">
            <span className="h-4 w-4 rounded bg-emerald-400" />
          </div>
          <div>
            <h1 className="font-serif text-xl italic tracking-tight text-slate-700">
              Smart Leads
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sales workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

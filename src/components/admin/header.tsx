export function Header() {
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Hoş geldiniz, <span className="font-semibold text-slate-800 dark:text-white">Admin</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}

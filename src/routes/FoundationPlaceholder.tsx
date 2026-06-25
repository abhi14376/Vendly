interface FoundationPlaceholderProps {
  title: string;
}

export function FoundationPlaceholder({ title }: FoundationPlaceholderProps) {
  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-10">
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <p className="text-sm font-medium uppercase text-primary-600 dark:text-primary-300">
          Foundation route
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          This route is wired for navigation and layout validation. Feature pages will be built in a later phase.
        </p>
      </section>
    </div>
  );
}

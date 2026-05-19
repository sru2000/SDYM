import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { searchRecords } from "../../data/appData.js";

function Highlight({ text, query }) {
  if (!query) return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-emerald-100 px-0.5 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

function SearchBox() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return searchRecords
      .filter((record) =>
        `${record.type} ${record.label} ${record.detail}`
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="relative hidden w-full max-w-xl md:block">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 140)}
        className="h-12 w-full rounded-2xl border border-emerald-100 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-950"
        placeholder="Search regions, crops, farmers, alerts..."
      />

      {focused && query && (
        <div className="absolute left-0 right-0 top-14 z-40 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/15 dark:border-emerald-900/60 dark:bg-slate-950">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={`${result.type}-${result.label}`}
                className="w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-950/50"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                    {result.type}
                  </span>
                  <p className="text-sm font-bold text-slate-950 dark:text-white">
                    <Highlight text={result.label} query={query} />
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <Highlight text={result.detail} query={query} />
                </p>
              </button>
            ))
          ) : (
            <p className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400">
              No matching regions, farmers, alerts, or crops found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;

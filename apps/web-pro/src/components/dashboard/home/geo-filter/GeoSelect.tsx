"use client";

export default function GeoSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: any) {
  return (
    <select
      disabled={disabled}
      className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-cyan-500 transition-all disabled:opacity-20 flex-1 min-w-[140px] cursor-pointer hover:border-slate-700"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
}

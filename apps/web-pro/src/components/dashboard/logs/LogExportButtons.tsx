"use client";

export default function LogExportButtons({ logs }: { logs: any[] }) {
  const exportLogs = (format: "json" | "md" | "txt") => {
    let content = "";
    let mimeType = "text/plain";
    const fileName = `blackbox_export_${new Date().getTime()}.${format}`;

    if (format === "json") {
      content = JSON.stringify(logs, null, 2);
      mimeType = "application/json";
    } else if (format === "md") {
      content = `# 📓 Reporte de Caja Negra - ${new Date().toLocaleString()}\n\n`;
      content += "| Fecha | Nivel | Módulo | Mensaje |\n|---|---|---|---|\n";
      logs.forEach((l) => {
        content += `| ${new Date(l.created_at).toLocaleString()} | ${l.level} | ${l.module} | ${l.message} |\n`;
      });
    } else {
      logs.forEach((l) => {
        content += `[${new Date(l.created_at).toLocaleString()}] [${l.level}] [${l.module}] ${l.message}\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex gap-2">
      {["json", "md", "txt"].map((fmt) => (
        <button
          key={fmt}
          onClick={() => exportLogs(fmt as any)}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-700/50"
        >
          .{fmt}
        </button>
      ))}
    </div>
  );
}

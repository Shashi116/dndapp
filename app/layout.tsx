export const metadata = {
  title: "D&D VTT",
  description: "Virtual Tabletop for D&D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Minimal inline fallbacks + Tailwind CDN fallback for dev */}
        <style>{`:root{--background:#000;--foreground:#e5e7eb}body{background:var(--background);color:var(--foreground);font-family:Arial,Helvetica,sans-serif}
        .text-slate-300{color:#cbd5e1}.text-purple-300{color:#d6bcfa}.text-cyan-300{color:#7dd3fc}.text-amber-400{color:#f6c63e}
        .text-2xl{font-size:1.5rem}.text-5xl{font-size:3rem}.font-black{font-weight:900}.text-transparent{color:transparent}
        .bg-slate-800\/50{background-color:rgba(30,41,59,0.5)}
        .from-amber-400{--tw-gradient-from:#f6c63e;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(246,198,62,0))}
        .from-purple-600{--tw-gradient-from:#7c3aed;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(124,58,237,0))}
        .from-cyan-600{--tw-gradient-from:#0891b2;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,rgba(8,145,178,0))}
        .to-amber-600{--tw-gradient-to:#d97706}.to-purple-700{--tw-gradient-to:#6d28d9}.to-cyan-700{--tw-gradient-to:#0ea5a4}
        `}</style>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

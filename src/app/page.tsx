import Link from 'next/link';

const Icons = {
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
  ),
  Crown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 18 14-4.4a2 2 0 0 0 1.2-2.5 2 2 0 0 0-.1-.6l-2.4-9a2 2 0 0 0-3.3-1.1L10 6l-2.5-4a2 2 0 0 0-3.8.7L2 14.3a2 2 0 0 0 1.6 2.6l1.4.2Z" /><path d="M5 18h14v3H5z" /></svg>
  ),
  Package: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22v-9" /></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  )
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        { }
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Financiero</h1>
            <p className="text-gray-500 mt-1">Vista general de rendimiento, clientes e inventario.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
              Última act: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        { }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          { }
          <Link href="/reports/4" className="col-span-1 md:col-span-2 lg:col-span-1 block group">
            <div className="h-full bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icons.Activity />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Icons.Activity />
                </div>
                <h3 className="font-semibold text-gray-800">Resumen de Órdenes</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500">Ingresos Totales (Completed)</p>
                    <p className="text-2xl font-bold text-gray-900">$45,231.00</p>
                  </div>
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">SUM(amount)</span>
                </div>
                { }
                <div className="flex gap-2 mt-2">
                  <div className="h-2 w-3/4 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-1/4 bg-gray-200 rounded-full"></div>
                </div>  
                <p className="text-xs text-gray-400 mt-1">75% Completadas vs Pendientes</p>
              </div>
            </div>
          </Link>

          { }
          <Link href="/reports/1" className="col-span-1 md:col-span-1 lg:col-span-1 block group">
            <div className="h-full bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(147,51,234,0.1)] border border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Icons.Crown />
                  </div>
                  <h3 className="font-semibold text-gray-800">Clientes VIP</h3>
                </div>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">High Value</span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Usuarios con compras totales &gt;
              </p>

              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="text-xs font-mono text-gray-400">HAVING SUM &gt; 1000</div>
                <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
                  <Icons.ArrowRight />
                </div>
              </div>
            </div>
          </Link>

          { }
          <Link href="/reports/2" className="col-span-1 md:col-span-1 lg:col-span-1 block group">
            <div className="h-full bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Icons.Chart />
                </div>
                <h3 className="font-semibold text-gray-800">Ventas x Categoría</h3>
              </div>

              { }
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-gray-500">Electrónica</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[80%]"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-gray-500">Hogar</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[50%]"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-gray-500">Ropa</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-300 w-[30%]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <span className="text-xs font-mono text-gray-400">JOIN + GROUP BY</span>
              </div>
            </div>
          </Link>

          { }
          <Link href="/reports/5" className="col-span-1 md:col-span-2 block group">
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icons.Users />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Top Usuarios</h3>
                    <p className="text-gray-400 text-sm">Ranking global de usuarios por gasto total</p>
                  </div>
                </div>
                <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  TOP 10
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 relative z-10">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">#1 Top Buyer</div>
                  <div className="font-medium">Juan Pérez</div>
                  <div className="text-emerald-400 text-sm font-bold">$3,420</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">#2 Contender</div>
                  <div className="font-medium">Maria G.</div>
                  <div className="text-emerald-400 text-sm font-bold">$2,850</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 text-sm hover:bg-white/10 transition">
                  Ver Tabla Completa →
                </div>
              </div>
            </div>
          </Link>

          { }
          <Link href="/reports/3" className="col-span-1 block group">
            <div className="h-full bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(245,158,11,0.1)] border border-gray-100 hover:border-amber-200 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Icons.Package />
                </div>
                <h3 className="font-semibold text-gray-800">Top Productos</h3>
              </div>

              <div className="flex justify-between items-end mb-2">
                <p className="text-4xl font-bold text-gray-900">842</p>
                <span className="text-xs text-green-600 font-medium mb-2">▲ 12% vs mes anterior</span>
              </div>
              <p className="text-sm text-gray-500">Unidades vendidas del producto estrella.</p>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">ORDER BY DESC</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
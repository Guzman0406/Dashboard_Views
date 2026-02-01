import Link from 'next/link';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BarChartIcon = () => (
  <svg viewBox="0 0 100 60" className="w-full h-16 opacity-80" preserveAspectRatio="none">
    <rect x="10" y="20" width="15" height="40" fill="#10b981" rx="2" />
    <rect x="35" y="35" width="15" height="25" fill="#34d399" rx="2" />
    <rect x="60" y="10" width="15" height="50" fill="#6ee7b7" rx="2" />
    <line x1="0" y1="60" x2="100" y2="60" stroke="#525252" strokeWidth="2" />
  </svg>
);

const PieChartIcon = () => (
  <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto opacity-80">
    <circle cx="30" cy="30" r="25" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="100 100" strokeDashoffset="40" transform="rotate(-90 30 30)" />
    <circle cx="30" cy="30" r="25" fill="none" stroke="#b91c1c" strokeWidth="8" strokeDasharray="40 100" strokeDashoffset="0" transform="rotate(-90 30 30)" />
  </svg>
);

const LineChartIcon = () => (
  <svg viewBox="0 0 100 50" className="w-full h-16 opacity-80" preserveAspectRatio="none">
    <polyline points="0,50 20,40 40,45 60,25 80,30 100,10" fill="none" stroke="#f59e0b" strokeWidth="3" />
    <circle cx="20" cy="40" r="2" fill="#f59e0b" />
    <circle cx="60" cy="25" r="2" fill="#f59e0b" />
    <circle cx="100" cy="10" r="2" fill="#f59e0b" />
    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
    </linearGradient>
    <polygon points="0,50 20,40 40,45 60,25 80,30 100,10 100,50 0,50" fill="url(#grad)" />
  </svg>
);

const AreaChartIcon = () => (
  <svg viewBox="0 0 100 60" className="w-full h-16 opacity-80" preserveAspectRatio="none">
    <path d="M0,60 L0,40 Q25,20 50,40 T100,30 L100,60 Z" fill="#a855f7" fillOpacity="0.4" />
    <path d="M0,40 Q25,20 50,40 T100,30" fill="none" stroke="#a855f7" strokeWidth="2" />
  </svg>
);

export default async function Home() {
  const client = await pool.connect();

  const resOrders = await client.query(`
    SELECT COALESCE(SUM(Ingresos_totales), 0) as total 
    FROM v_resumen_ordenes_por_estado 
    WHERE Estado_orden = 'completed'
  `);
  const totalProcessed = parseFloat(resOrders.rows[0]?.total || '0');

  const resTopBuyer = await client.query(`
    SELECT nombre_usuario, total_gastado 
    FROM v_ranking_usuarios_por_gasto 
    ORDER BY total_gastado DESC 
    LIMIT 1
  `);
  const topBuyer = resTopBuyer.rows[0] || { nombre_usuario: 'N/A', total_gastado: 0 };

  const resActiveUsers = await client.query(`SELECT COUNT(*) as count FROM users`);
  const activeUsers = resActiveUsers.rows[0]?.count || 0;

  client.release();

  return (
    <main className="min-h-screen bg-black text-gray-300 p-8 font-sans selection:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-neutral-800 pb-6 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard Financiero</h1>
            <p className="text-gray-500">Monitor de ventas, inventario y clientes VIP.</p>
          </div>
          <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-medium text-gray-500 shadow-sm mt-4 md:mt-0">
            Última act: {new Date().toLocaleString()}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Link href="/reports/2" className="group block">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-600 transition-colors duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-white group-hover:text-emerald-500 transition-colors">
                    Ventas por Categoría
                  </h2>
                  <span className="text-[10px] font-mono text-gray-600 border border-neutral-700 px-2 py-1 rounded bg-black">SUM, GROUP BY</span>
                </div>
                <div className="mb-6 mt-4">
                  <BarChartIcon />
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Resumen de ingresos totales agrupados por familia de productos.
              </p>
            </div>
          </Link>

          <Link href="/reports/1" className="group block">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-purple-600 transition-colors duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-white group-hover:text-purple-500 transition-colors">
                    Clientes VIP
                  </h2>
                  <span className="text-[10px] font-mono text-gray-600 border border-neutral-700 px-2 py-1 rounded bg-black">HAVING, CASE</span>
                </div>
                <div className="mb-6 mt-4 flex justify-center">
                  <AreaChartIcon />
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Identificación de mejores clientes basado en volumen de compra.
              </p>
            </div>
          </Link>

          <Link href="/reports/3" className="group block">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-600 transition-colors duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-white group-hover:text-amber-500 transition-colors">
                    Top Productos
                  </h2>
                  <span className="text-[10px] font-mono text-gray-600 border border-neutral-700 px-2 py-1 rounded bg-black">ORDER BY</span>
                </div>
                <div className="mb-6 mt-4">
                  <LineChartIcon />
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Análisis de stock vs ventas potenciales.
              </p>
            </div>
          </Link>

          <Link href="/reports/4" className="group block md:col-span-2 lg:col-span-1">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-blue-600 transition-colors duration-300 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-white group-hover:text-blue-500 transition-colors">
                    Resumen de Órdenes
                  </h2>
                  <span className="text-[10px] font-mono text-gray-600 border border-neutral-700 px-2 py-1 rounded bg-black">COUNT</span>
                </div>
                <div className="space-y-4 mb-6 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                    <div className="h-1.5 bg-neutral-800 flex-1 rounded overflow-hidden">
                      <div className="h-full bg-blue-600 w-3/4 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                    <div className="h-1.5 bg-neutral-800 flex-1 rounded overflow-hidden">
                      <div className="h-full bg-blue-900 w-1/2 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mt-2">
                      ${totalProcessed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-600">Total Processed</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ranking de transacciones recientes por usuario.
              </p>
            </div>
          </Link>

          <Link href="/reports/5" className="group block md:col-span-2">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-red-600 transition-colors duration-300 flex flex-row items-center gap-8 shadow-lg">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors">
                    Top Usuarios (Market Share)
                  </h2>
                  <span className="text-[10px] font-mono text-gray-600 border border-neutral-700 px-2 py-1 rounded bg-black">LIMIT / OFFSET</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Participación de mercado global por categoría y usuarios destacados.
                </p>
                <div className="flex gap-4 mt-4">
                  <div className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
                    <div className="text-xs text-gray-500">Top Buyer</div>
                    <div className="text-emerald-400 font-bold">
                      ${Number(topBuyer.total_gastado).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{topBuyer.nombre_usuario}</div>
                  </div>
                  <div className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
                    <div className="text-xs text-gray-500">Active Users</div>
                    <div className="text-white font-bold">{activeUsers}</div>
                  </div>
                </div>
              </div>
              <div className="shrink-0 hidden sm:block">
                <PieChartIcon />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
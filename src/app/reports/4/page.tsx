import { pool } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Report4Page() {
    const query = `SELECT * FROM v_resumen_ordenes_por_estado`;

    const client = await pool.connect();
    const res = await client.query(query);
    const rows = res.rows;
    client.release();

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-white mb-6 inline-block transition-colors">← Volver al Dashboard</Link>

                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Salud de las Órdenes</h1>
                <p className="text-gray-500 mb-8 pb-6 border-b border-neutral-800">Comparativa financiera por estado de la transacción.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rows.map((row, idx) => {
                        const isCompleted = row.estado_orden === 'completed';
                        const containerClass = isCompleted
                            ? 'bg-neutral-900 border-emerald-900/50 hover:border-emerald-700/50 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.1)]'
                            : 'bg-neutral-900 border-red-900/50 hover:border-red-700/50 shadow-[0_4px_20px_-10px_rgba(239,68,68,0.1)]';

                        const badgeClass = isCompleted
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            : 'bg-red-950 text-red-400 border border-red-900';

                        const textClass = isCompleted ? 'text-emerald-400' : 'text-red-400';
                        const title = isCompleted ? 'Ingresos Efectivos' : 'Pérdidas / Reembolsos';

                        return (
                            <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 ${containerClass}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className={`font-bold text-lg capitalize mb-1 ${textClass}`}>{row.estado_orden}</h2>
                                        <p className="text-sm text-gray-500">{title}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                                        {row.total_ordenes} Órdenes
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-4xl font-bold text-white tracking-tight">
                                        ${Number(row.ingresos_totales).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">Suma total de montos</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
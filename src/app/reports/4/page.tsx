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
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">← Volver al Dashboard</Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Salud de las Órdenes</h1>
                <p className="text-gray-600 mb-8">Comparativa financiera por estado de la transacción.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rows.map((row, idx) => {
                        const isCompleted = row.estado_orden === 'completed';
                        const colorClass = isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
                        const textClass = isCompleted ? 'text-emerald-700' : 'text-red-700';
                        const title = isCompleted ? 'Ingresos Efectivos' : 'Pérdidas / Reembolsos';

                        return (
                            <div key={idx} className={`p-6 rounded-2xl border ${colorClass} shadow-sm`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className={`font-bold text-lg capitalize ${textClass}`}>{row.estado_orden}</h2>
                                        <p className="text-sm text-gray-500">{title}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white ${textClass} shadow-sm`}>
                                        {row.total_ordenes} Órdenes
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-3xl font-bold text-gray-900">
                                        ${Number(row.ingresos_totales).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">Suma total de montos</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
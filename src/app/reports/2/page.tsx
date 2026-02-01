import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const FilterSchema = z.object({
    min: z.coerce.number().min(0).default(0),
});

export default async function Report2Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const parsed = FilterSchema.safeParse(params);
    const minRevenue = parsed.success ? parsed.data.min : 0;


    const query = `
    SELECT * FROM v_sales_by_category 
    WHERE Ganancias >= $1
    ORDER BY Ganancias DESC
  `;

    const client = await pool.connect();
    const res = await client.query(query, [minRevenue]);
    const categories = res.rows;
    client.release();


    const maxRevenue = Math.max(...categories.map(c => Number(c.ganancias)), 0);
    const totalRevenue = categories.reduce((acc, curr) => acc + Number(curr.ganancias), 0);
    const topCategory = categories[0]?.nombre_categoria || 'N/A';

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link href="/" className="text-sm text-gray-500 hover:text-white mb-6 inline-block transition-colors">
                    ← Volver al Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Ventas por Categoría</h1>
                        <p className="text-gray-500 mt-2">
                            Desglose de ingresos generado por cada categoría de productos.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ingreso Total</p>
                            <p className="text-2xl font-bold text-white">
                                ${totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-sm border-l-4 border-l-emerald-500">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Categoría Top</p>
                            <p className="text-2xl font-bold text-emerald-400">{topCategory}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 mb-6">
                    <form className="flex items-end gap-4">
                        <div className="flex-1 max-w-xs">
                            <label htmlFor="min" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                                Ingreso Mínimo ($)
                            </label>
                            <input
                                type="number"
                                name="min"
                                id="min"
                                placeholder="Ej: 1000"
                                defaultValue={minRevenue}
                                className="block w-full rounded-md bg-black border-neutral-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2.5 border placeholder-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-white text-black px-4 py-2.5 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                        >
                            Filtrar
                        </button>
                        {minRevenue > 0 && (
                            <Link href="/reports/2" className="text-sm text-red-400 hover:text-red-300 mb-2 transition-colors">
                                Limpiar
                            </Link>
                        )}
                    </form>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Distribución de Ingresos</h2>

                    <div className="space-y-6">
                        {categories.map((cat, idx) => {

                            const percentage = maxRevenue > 0 ? (Number(cat.ganancias) / maxRevenue) * 100 : 0;

                            return (
                                <div key={idx} className="group">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-300">{cat.nombre_categoria}</span>
                                        <span className="text-gray-400 font-mono">
                                            ${Number(cat.ganancias).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-black rounded-full h-2 overflow-hidden border border-neutral-800">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {categories.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No hay categorías que cumplan el criterio.</p>
                        )}
                    </div>
                </div>

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-800">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Órdenes Totales
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticket Promedio
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ingresos
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                            {categories.map((cat, idx) => (
                                <tr key={idx} className="hover:bg-neutral-800/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {cat.nombre_categoria}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                                        {cat.total_ordenes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right font-mono">
                                        ${Number(cat.ticket_promedio).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 text-right font-bold font-mono">
                                        ${Number(cat.ganancias).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

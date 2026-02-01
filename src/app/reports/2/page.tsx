import { pool } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Report2Page() {

    const query = `
    SELECT * FROM v_sales_by_category 
    ORDER BY Ganancias DESC
  `;

    const client = await pool.connect();
    const res = await client.query(query);
    const categories = res.rows;
    client.release();


    const maxRevenue = Math.max(...categories.map(c => Number(c.ganancias)));
    const totalRevenue = categories.reduce((acc, curr) => acc + Number(curr.ganancias), 0);
    const topCategory = categories[0]?.nombre_categoria || 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                { }
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">
                    ← Volver al Dashboard
                </Link>

                { }
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Ventas por Categoría</h1>
                        <p className="text-gray-600 mt-2">
                            Desglose de ingresos generado por cada familia de productos.
                        </p>
                    </div>

                    { }
                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold">Ingreso Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
                            <p className="text-xs text-gray-500 uppercase font-bold">Categoría Top</p>
                            <p className="text-2xl font-bold text-emerald-600">{topCategory}</p>
                        </div>
                    </div>
                </div>

                { }
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Distribución de Ingresos</h2>

                    <div className="space-y-5">
                        {categories.map((cat, idx) => {

                            const percentage = (Number(cat.ganancias) / maxRevenue) * 100;

                            return (
                                <div key={idx} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{cat.nombre_categoria}</span>
                                        <span className="text-gray-500 font-mono">
                                            ${Number(cat.ganancias).toLocaleString()}
                                        </span>
                                    </div>
                                    { }
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        { }
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-emerald-400"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-right text-gray-400">
                        Visualización generada con CSS nativo (Performance-first)
                    </div>
                </div>

                { }
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Órdenes Totales
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ingresos
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((cat, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cat.nombre_categoria}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {cat.total_ordenes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
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
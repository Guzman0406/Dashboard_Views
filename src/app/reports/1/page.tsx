import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const FilterSchema = z.object({
    min: z.coerce.number().min(0).default(0),
});

export default async function Report1Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

    const params = await searchParams;
    const parsed = FilterSchema.safeParse(params);
    const minSpent = parsed.success ? parsed.data.min : 0;

    const query = `
    SELECT * FROM v_vip_customers 
    WHERE total_spent >= $1 
    ORDER BY total_spent DESC
  `;

    const client = await pool.connect();
    const res = await client.query(query, [minSpent]);
    const customers = res.rows;
    client.release();

    const totalVip = customers.filter((c) => c.status === 'VIP').length;
    const totalRevenueShown = customers.reduce((acc, curr) => acc + Number(curr.total_spent), 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">
                    ← Volver al Dashboard
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Clientes VIP</h1>
                        <p className="text-gray-600 mt-2">
                            Listado de clientes clasificados por volumen de compra total.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold">Total VIPs</p>
                            <p className="text-2xl font-bold text-purple-600">{totalVip}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold">Ingresos Totales</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ${totalRevenueShown.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <form className="flex items-end gap-4">
                        <div>
                            <label htmlFor="min" className="block text-sm font-medium text-gray-700 mb-1">
                                Gasto Mínimo ($)
                            </label>
                            <input
                                type="number"
                                name="min"
                                id="min"
                                placeholder="Ej: 500"
                                defaultValue={minSpent}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                        >
                            Filtrar Resultados
                        </button>

                        {minSpent > 0 && (
                            <Link href="/reports/1" className="text-sm text-red-500 hover:underline mb-2">
                                Limpiar filtro
                            </Link>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estatus
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Gastado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.length > 0 ? (
                                customers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${customer.status === 'VIP'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                                            ${Number(customer.total_spent).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                        No se encontraron clientes con ese gasto.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
                        <span>Fuente: v_vip_customers</span>
                        <span>{customers.length} registros</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
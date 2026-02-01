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
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link href="/" className="text-sm text-gray-500 hover:text-white mb-6 inline-block transition-colors">
                    ← Volver al Dashboard
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Clientes VIP</h1>
                        <p className="text-gray-500 mt-2">
                            Listado de clientes clasificados por volumen de compra total.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total VIPs</p>
                            <p className="text-2xl font-bold text-purple-400">{totalVip}</p>
                        </div>
                        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ingresos Totales</p>
                            <p className="text-2xl font-bold text-emerald-400">
                                ${totalRevenueShown.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 mb-6">
                    <form className="flex items-end gap-4">
                        <div className="flex-1 max-w-xs">
                            <label htmlFor="min" className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                                Gasto Mínimo ($)
                            </label>
                            <input
                                type="number"
                                name="min"
                                id="min"
                                placeholder="Ej: 500"
                                defaultValue={minSpent}
                                className="block w-full rounded-md bg-black border-neutral-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border placeholder-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-white text-black px-4 py-2.5 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                        >
                            Filtrar Resultados
                        </button>

                        {minSpent > 0 && (
                            <Link href="/reports/1" className="text-sm text-red-400 hover:text-red-300 mb-2 transition-colors">
                                Limpiar filtro
                            </Link>
                        )}
                    </form>
                </div>

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-800">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estatus
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Gastado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                            {customers.length > 0 ? (
                                customers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-neutral-800/50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${customer.status === 'VIP'
                                                        ? 'bg-purple-900/30 text-purple-300 border-purple-800/50'
                                                        : 'bg-neutral-800 text-gray-400 border-neutral-700'
                                                    }`}
                                            >
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right font-mono">
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
                    <div className="bg-black/20 px-6 py-3 border-t border-neutral-800 text-xs text-gray-600 flex justify-between">
                        <span>Fuente: v_vip_customers</span>
                        <span>{customers.length} registros</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
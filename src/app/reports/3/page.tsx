import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PageSchema = z.object({
    page: z.coerce.number().min(1).default(1),
});

export default async function Report3Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const parsed = PageSchema.safeParse(params);
    const currentPage = parsed.success ? parsed.data.page : 1;
    const pageSize = 5; 
    const offset = (currentPage - 1) * pageSize;

    const query = `
    SELECT * FROM v_productos_mas_vendidos 
    ORDER BY veces_vendido DESC
    LIMIT $1 OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) as total FROM v_productos_mas_vendidos`;

    const client = await pool.connect();
    const res = await client.query(query, [pageSize, offset]);
    const countRes = await client.query(countQuery);
    const products = res.rows;
    const totalProducts = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalProducts / pageSize);
    client.release();

    const topProduct = products.length > 0 && currentPage === 1 ? products[0] : null;

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link href="/" className="text-sm text-gray-500 hover:text-white mb-6 inline-block transition-colors">
                    ← Volver al Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Top Productos</h1>
                        <p className="text-gray-500 mt-2">
                            Los artículos con mayor ventas (Paginado).
                        </p>
                    </div>
                </div>

                {topProduct && (
                    <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-8 text-white shadow-[0_0_30px_-5px_rgba(245,158,11,0.1)] mb-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-amber-500/10 w-64 h-64 rounded-full blur-3xl group-hover:bg-amber-500/20 transition duration-1000"></div>
                        <div className="relative z-10">
                            <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2">Producto Estrella</p>
                            <h2 className="text-4xl font-extrabold mb-6 text-white">{topProduct.nombre_producto}</h2>
                            <div className="flex gap-10">
                                <div>
                                    <p className="text-4xl font-bold text-amber-500">{topProduct.veces_vendido}</p>
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Órdenes</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-amber-500">{topProduct.total_cantidad_vendida}</p>
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">Unidades Totales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-lg">
                    <table className="min-w-full divide-y divide-neutral-800">
                        <thead className="bg-neutral-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Veces Vendido</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades</th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                            {products.map((p, idx) => {
                                const rank = offset + idx + 1;
                                return (
                                    <tr key={idx} className="hover:bg-neutral-800/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">#{rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.nombre_producto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right">{p.veces_vendido}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-400 text-right font-bold">{p.total_cantidad_vendida}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="bg-black/40 px-6 py-4 border-t border-neutral-800 flex justify-between items-center">
                        {currentPage > 1 ? (
                            <Link
                                href={`/reports/3?page=${currentPage - 1}`}
                                className="px-4 py-2 border border-neutral-700 rounded-md text-sm font-medium text-gray-300 bg-neutral-900 hover:bg-neutral-800 transition"
                            >
                                Anterior
                            </Link>
                        ) : <div className="w-20"></div>}

                        <span className="text-sm text-gray-600 font-mono">Página {currentPage} de {totalPages}</span>

                        {currentPage < totalPages ? (
                            <Link
                                href={`/reports/3?page=${currentPage + 1}`}
                                className="px-4 py-2 border border-neutral-700 rounded-md text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 transition"
                            >
                                Siguiente
                            </Link>
                        ) : <div className="w-20"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

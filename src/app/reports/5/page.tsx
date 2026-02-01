import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PageSchema = z.object({
    page: z.coerce.number().min(1).default(1),
});

export default async function Report5Page({
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
    SELECT * FROM v_ranking_usuarios_por_gasto 
    ORDER BY total_gastado DESC 
    LIMIT $1 OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) as total FROM v_ranking_usuarios_por_gasto`;

    const client = await pool.connect();
    const res = await client.query(query, [pageSize, offset]);
    const countRes = await client.query(countQuery);
    const users = res.rows;
    const totalUsers = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalUsers / pageSize);
    client.release();

    return (
        <div className="min-h-screen bg-black text-gray-300 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-white mb-6 inline-block transition-colors">← Volver al Dashboard</Link>

                <div className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Ranking de Usuarios</h1>
                        <p className="text-gray-500 mt-2">Nuestros mejores usuarios.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Página <span className="text-white font-bold">{currentPage}</span> de {totalPages}</p>
                        <p className="text-xs text-gray-600">Total: {totalUsers} usuarios</p>
                    </div>
                </div>

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-lg">
                    <table className="min-w-full divide-y divide-neutral-800">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">#</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Usuario</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                            {users.map((user, idx) => {
                                const globalRank = offset + idx + 1;
                                return (
                                    <tr key={idx} className="hover:bg-neutral-800/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-sm">
                                            #{globalRank}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                                            {user.nombre_usuario}
                                            {globalRank === 1 && <span className="ml-2 text-lg">👑</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-400 font-mono">
                                            ${Number(user.total_gastado).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="bg-black/40 px-6 py-4 border-t border-neutral-800 flex justify-between items-center">
                        {currentPage > 1 ? (
                            <Link
                                href={`/reports/5?page=${currentPage - 1}`}
                                className="px-4 py-2 border border-neutral-700 rounded-md text-sm font-medium text-gray-300 bg-neutral-900 hover:bg-neutral-800 transition"
                            >
                                Anterior
                            </Link>
                        ) : <div className="w-20"></div>}

                        <span className="text-sm text-gray-600 font-mono">Página {currentPage}</span>

                        {currentPage < totalPages ? (
                            <Link
                                href={`/reports/5?page=${currentPage + 1}`}
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
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
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">← Volver al Dashboard</Link>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Ranking de Usuarios</h1>
                        <p className="text-gray-600 mt-2">Nuestros mejores usuarios.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Página {currentPage} de {totalPages}</p>
                        <p className="text-xs text-gray-400">Total: {totalUsers} usuarios</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user, idx) => {
                                const globalRank = offset + idx + 1;
                                return (
                                    <tr key={idx} className="hover:bg-blue-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">
                                            #{globalRank}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {user.nombre_usuario}
                                            {globalRank === 1 && <span className="ml-2 text-lg">👑</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600">
                                            ${Number(user.total_gastado).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        {currentPage > 1 ? (
                            <Link
                                href={`/reports/5?page=${currentPage - 1}`}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Anterior
                            </Link>
                        ) : <div className="w-20"></div>}

                        <span className="text-sm text-gray-500 font-mono">Página {currentPage}</span>

                        {currentPage < totalPages ? (
                            <Link
                                href={`/reports/5?page=${currentPage + 1}`}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
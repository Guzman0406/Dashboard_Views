import { pool } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Report3Page() {

    const query = `
    SELECT * FROM v_productos_mas_vendidos 
    ORDER BY veces_vendido DESC
    LIMIT 10
  `;

    const client = await pool.connect();
    const res = await client.query(query);
    const products = res.rows;
    client.release();

    const topProduct = products[0];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block">
                    ← Volver al Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Top Productos</h1>
                        <p className="text-gray-600 mt-2">
                            Los artículos con mayor ventas.
                        </p>
                    </div>
                </div>

                { }
                {topProduct && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-white/20 w-32 h-32 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <p className="text-amber-100 font-bold uppercase tracking-widest text-xs mb-2">Producto Estrella</p>
                            <h2 className="text-4xl font-extrabold mb-4">{topProduct.nombre_producto}</h2>
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-3xl font-bold">{topProduct.veces_vendido}</p>
                                    <p className="text-sm text-amber-100">Órdenes</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{topProduct.total_cantidad_vendida}</p>
                                    <p className="text-sm text-amber-100">Unidades Totales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                { }
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Veces Vendido</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((p, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{idx + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nombre_producto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{p.veces_vendido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">{p.total_cantidad_vendida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
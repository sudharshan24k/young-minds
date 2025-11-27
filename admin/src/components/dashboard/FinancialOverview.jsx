import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const FinancialOverview = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinancials();
    }, []);

    const fetchFinancials = async () => {
        try {
            // Fetch invoices with enrollment details to get activity type
            const { data: invoices, error } = await supabase
                .from('invoices')
                .select(`
                    amount,
                    enrollments (
                        activity_type
                    )
                `);

            if (error) throw error;

            // Process data
            let total = 0;
            const breakdown = {};

            invoices.forEach(inv => {
                const amount = Number(inv.amount) || 0;
                total += amount;

                const type = inv.enrollments?.activity_type || 'Unknown';
                if (!breakdown[type]) breakdown[type] = 0;
                breakdown[type] += amount;
            });

            setTotalRevenue(total);
            setRevenueData(Object.entries(breakdown).map(([type, amount]) => ({ type, amount })));
        } catch (error) {
            console.error('Error fetching financials:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl"></div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Financial Overview</h3>
                    <p className="text-sm text-slate-500">Revenue breakdown by activity</p>
                </div>
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <DollarSign size={20} />
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
                <h2 className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</h2>
            </div>

            <div className="space-y-4">
                {revenueData.length > 0 ? (
                    revenueData.map((item) => (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'express' ? 'bg-purple-100 text-purple-600' :
                                        item.type === 'challenge' ? 'bg-blue-100 text-blue-600' :
                                            'bg-orange-100 text-orange-600'
                                    }`}>
                                    <CreditCard size={16} />
                                </div>
                                <span className="font-medium text-slate-700 capitalize">
                                    {item.type.replace('_', ' ')}
                                </span>
                            </div>
                            <span className="font-bold text-slate-900">{formatCurrency(item.amount)}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">No financial data available</div>
                )}
            </div>
        </div>
    );
};

export default FinancialOverview;

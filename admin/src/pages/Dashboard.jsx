import React from 'react';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import RegistrationOverview from '../components/dashboard/RegistrationOverview';
import PendingSubmissions from '../components/dashboard/PendingSubmissions';
import PendingActions from '../components/dashboard/PendingActions';

const Dashboard = () => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1 text-lg">Welcome back, Admin. Here's your financial and operational summary.</p>
            </div>

            <PendingActions />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="h-full hover:transform hover:scale-[1.01] transition-transform duration-300">
                    <FinancialOverview />
                </div>
                <div className="h-full hover:transform hover:scale-[1.01] transition-transform duration-300">
                    <RegistrationOverview />
                </div>
            </div>

            <div className="mb-8 hover:transform hover:scale-[1.01] transition-transform duration-300">
                <PendingSubmissions />
            </div>
        </div>
    );
};

export default Dashboard;

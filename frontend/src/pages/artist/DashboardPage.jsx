// frontend/src/pages/artist/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const DashboardPage = () => {
 const { user } = useAuth();

 return (
   <div className="min-h-screen bg-gray-100">
     <Navbar />
     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
       {/* Welcome Section */}
       <div className="md:flex md:items-center md:justify-between mb-8">
         <div className="flex-1 min-w-0">
           <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
             Welcome back, {user?.fullName || 'Artist'}!
           </h2>
         </div>
         <div className="mt-4 flex md:mt-0 md:ml-4">
           <Link
             to="/portfolio"
             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
           >
             View Portfolio
           </Link>
         </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
         {/* Active Commissions Card */}
         <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
           <div className="p-6">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                 <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div className="ml-5">
                 <p className="text-sm font-medium text-gray-500">Active Commissions</p>
                 <h3 className="mt-1 text-xl font-semibold text-gray-900">0</h3>
               </div>
             </div>
           </div>
         </div>

         {/* Total Earnings Card */}
         <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
           <div className="p-6">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                 <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div className="ml-5">
                 <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                 <h3 className="mt-1 text-xl font-semibold text-gray-900">$0.00</h3>
               </div>
             </div>
           </div>
         </div>

         {/* Completion Rate Card */}
         <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
           <div className="p-6">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                 <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <div className="ml-5">
                 <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                 <h3 className="mt-1 text-xl font-semibold text-gray-900">100%</h3>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Recent Commissions Section */}
       <div className="mt-8">
         <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Commissions</h3>
         <div className="bg-white shadow-lg rounded-lg">
           <div className="p-6">
             <div className="text-center text-gray-500">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
               </svg>
               <h3 className="mt-2 text-sm font-medium text-gray-900">No commissions yet</h3>
               <p className="mt-1 text-sm text-gray-500">Start by setting up your portfolio.</p>
               <div className="mt-6">
                 <Link to="/portfolio" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                   Set Up Portfolio
                   <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </Link>
               </div>
             </div>
           </div>
         </div>
       </div>
     </main>
   </div>
 );
};

export default DashboardPage;
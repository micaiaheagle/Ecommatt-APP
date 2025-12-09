import React, { useState } from 'react';

const HelpCentre: React.FC = () => {
    const faqs = [
        { q: "How do I reset my password?", a: "Go to Settings > Users. If you are an admin, you can reset passwords for other staff. If you are locked out, contact the Farm Manager." },
        { q: "The app isn't syncing while offline.", a: "The app caches data locally. Once you reconnect to Wi-Fi or Data, pull down on the dashboard to force a sync. Ensure 'Offline Mode' is enabled in Settings." },
        { q: "How to edit a pig's birth date?", a: "Navigate to the Pig Profile, click the 'Edit' pencil icon in the top right corner, update the DOB field, and click Save." },
        { q: "Where can I see the profit report?", a: "Go to the Finance module. Use the 'Profit Calculator' for estimates or 'Batch Profitability' for realized gains on sold batches." }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">How can we help you?</h3>
                <p className="text-gray-600 mt-2">Search for answers or browse frequently asked questions.</p>
                <div className="mt-6 relative max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search for help..."
                        className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:border-green-300 transition cursor-pointer text-center">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h4 className="font-bold text-gray-900">User Guides</h4>
                    <p className="text-sm text-gray-500 mt-2">Step-by-step tutorials for every feature.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-300 transition cursor-pointer text-center">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h4 className="font-bold text-gray-900">Contact Support</h4>
                    <p className="text-sm text-gray-500 mt-2">support@ecomatt.co.zw<br />+263 71 123 4567</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <h4 className="bg-gray-50 px-6 py-4 font-bold border-b text-gray-800">Frequently Asked Questions</h4>
                <div className="divide-y">
                    {faqs.map((item, index) => (
                        <div key={index} className="px-6 py-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left flex justify-between items-center focus:outline-none"
                            >
                                <span className="font-medium text-gray-800">{item.q}</span>
                                <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {openIndex === index && (
                                <p className="mt-2 text-gray-600 text-sm leading-relaxed animate-fadeIn">{item.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCentre;

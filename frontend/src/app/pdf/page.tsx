'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Loader2, Printer } from 'lucide-react';

function PdfViewer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pdfUrl = searchParams.get('url') || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const title = searchParams.get('title') || 'Course Document';

    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50 rounded-[36px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 max-w-6xl mx-auto animate-in fade-in pb-0 mb-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200 z-20 shadow-sm relative">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 group px-4 py-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Go Back</span>
                </button>

                <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm">
                        <FileText className="w-5 h-5 text-rose-500" />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all hover:scale-105 active:scale-95"
                        title="Print PDF"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                        title="Download PDF"
                    >
                        <Download className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 relative bg-slate-200/50 overflow-hidden rounded-b-[36px]">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 border border-slate-200 animate-bounce">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Preparing Document</h2>
                        <p className="text-slate-500 font-medium">Please wait while we load the PDF securely.</p>
                    </div>
                )}

                <iframe
                    src={pdfUrl}
                    className={`w-full h-full border-none transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    title="PDF Secure Viewer"
                />
            </div>
        </div>
    );
}

export default function PdfViewerPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Loading Document...</h2>
            </div>
        }>
            <PdfViewer />
        </Suspense>
    );
}

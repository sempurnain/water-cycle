import React, { Component } from 'react';
import { RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Terjadi gangguan pada tampilan aplikasi.',
    };
  }

  render() {
    if (this.state.hasError) {
      let friendly = 'Maaf, terjadi gangguan saat memuat halaman ini.';
      try {
        const parsed = JSON.parse(this.state.message);
        if (parsed && parsed.operationType) {
          friendly = `Akses data (${parsed.operationType}) memerlukan autentikasi guru yang valid atau mode DEMO.`;
        }
      } catch {
        if (this.state.message) {
          friendly = this.state.message;
        }
      }

      return (
        <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-[#24394D]/12 p-8 shadow-sm text-center">
            <h1 className="font-display text-2xl font-extrabold text-[#24394D] mb-3">
              Ada Sedikit Gangguan
            </h1>
            <p className="text-sm text-[#24394D]/80 leading-relaxed mb-6">{friendly}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1677B8] text-white font-display font-bold text-sm hover:bg-[#126298] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

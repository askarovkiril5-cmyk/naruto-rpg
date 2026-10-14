import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL REACT RENDER ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleClearCacheAndReload = () => {
    try {
      localStorage.removeItem('naruto_character_profile');
      localStorage.removeItem('naruto_chat_messages');
      localStorage.removeItem('naruto_selected_jutsu');
      localStorage.removeItem('naruto_room_status');
      localStorage.removeItem('naruto_round_number');
      localStorage.removeItem('naruto_arsenal_locked');
      localStorage.removeItem('naruto_eye_active');
    } catch (e) {}
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-100 select-none">
          <div className="max-w-lg w-full bg-zinc-900 border border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ошибка интерфейса арены
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-4">
              Произошла непредвиденная ошибка в браузере. Вы можете перезагрузить страницу или очистить повреждённый кэш сессии.
            </p>

            <div className="w-full bg-black/80 border border-red-900/40 rounded-xl p-3 mb-6 text-left overflow-auto max-h-40">
              <p className="text-xs font-mono text-red-300 break-words font-semibold">
                {this.state.error?.toString() || 'Неизвестная ошибка рендеринга'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Перезагрузить</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Сбросить кэш и войти</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

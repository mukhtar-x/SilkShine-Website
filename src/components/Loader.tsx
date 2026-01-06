
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50 transition-all duration-500">
            <div className="text-4xl font-bold relative overflow-hidden">
                <span className="text-white/20 tracking-widest uppercase">SilkShine</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/80 to-transparent w-full h-full -translate-x-full animate-shimmer"></div>
            </div>
        </div>
    );
};

export default Loader;

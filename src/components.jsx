import React from 'react';

export const Button = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled = false, title = '' }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md flex items-center justify-center text-sm";
    const variants = {
        primary: 'bg-[#002458] text-white hover:bg-[#001c46] focus:ring-[#002458]',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:focus:ring-slate-500',
        danger: 'bg-[#c62727] text-white hover:bg-[#a52020] focus:ring-[#c62727]',
        action: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        green: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`} type={type} disabled={disabled} title={title}>
            {children}
        </button>
    );
};

export const Input = ({ label, type, value, onChange, min, name }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>
        <input type={type} value={value} onChange={onChange} min={min} name={name} className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#002458] focus:border-[#002458] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:placeholder-slate-500" />
    </div>
);

export const Select = ({ label, value, onChange, children, name }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>
        <select value={value} onChange={onChange} name={name} className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#002458] focus:border-[#002458] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300">
            {children}
        </select>
    </div>
);

export const Card = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-slate-900 dark:border dark:border-slate-700 rounded-lg shadow p-6 ${className}`}>
        {title && <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">{title}</h2>}
        {children}
    </div>
);

export const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <p className="mb-4 dark:text-slate-300">{message}</p>
            <Button onClick={onClose} variant="primary">Close</Button>
        </div>
    </div>
);
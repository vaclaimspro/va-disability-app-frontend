import React, { useState } from 'react';
import { Trash2Icon } from '../icons';
import { Button } from '../components';
import { DataStore } from '@aws-amplify/datastore'; // Import DataStore
import { UserProfile } from '../models/index.js'; // Import UserProfile model
import { Todo as DataStoreTodo } from '../models/index.js'; // Import DataStore Todo model if separate

export default function CalendarAndTasksPage({ userData, setUserData }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formState, setFormState] = useState({ id: null, title: '', date: '', time: '', location: '', condition: '', notes: '' });
    const [newTodoText, setNewTodoText] = useState('');
    const [newTodoDate, setNewTodoDate] = useState('');

    // --- AMPLIFY MODIFICATION: Destructure with default values ---
    const { appointments = [], claimPackage = [], todos = [] } = userData || {};

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setFormState({ id: appointment.id, title: appointment.title, date: appointment.date, time: appointment.time, location: appointment.location, condition: appointment.condition, notes: appointment.notes });
        } else {
            setFormState({ id: null, title: '', date: new Date().toISOString().slice(0, 10), time: '', location: '', condition: '', notes: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    // --- AMPLIFY MODIFICATION: Save Appointments to DataStore ---
    const handleSaveAppointment = async (e) => {
        e.preventDefault();
        try {
            let updatedAppointments;
            if (formState.id) {
                updatedAppointments = appointments.map(app => app.id === formState.id ? formState : app);
            } else {
                updatedAppointments = [...appointments, { ...formState, id: Date.now() }];
            }
            
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.appointments = updatedAppointments; // Assume appointments is AWSJSON
            }));
            handleCloseModal();
        } catch (error) {
            console.error("Error saving appointment:", error);
            // Handle error, show toast, etc.
        }
    };
    
    // --- AMPLIFY MODIFICATION: Delete Appointment from DataStore ---
    const handleDeleteAppointment = async (id) => {
        try {
            const updatedAppointments = appointments.filter(app => app.id !== id);
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.appointments = updatedAppointments;
            }));
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting appointment:", error);
            // Handle error
        }
    };

    // --- AMPLIFY MODIFICATION: Add Todo to DataStore ---
    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodoText.trim()) return;
        const newTodo = { id: Date.now(), text: newTodoText.trim(), completed: false, dueDate: newTodoDate || null };
        try {
            // Option A: If Todo is a direct field on UserProfile (AWSJSON or object list)
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.todos = [...(updated.todos || []), newTodo]; // Assume todos is AWSJSON
            }));
            setNewTodoText('');
            setNewTodoDate('');
        } catch (error) {
            console.error("Error adding todo:", error);
            // Handle error
        }
    };

    // --- AMPLIFY MODIFICATION: Toggle Todo completion in DataStore ---
    const handleToggleTodo = async (id) => {
        try {
            const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.todos = updatedTodos;
            }));
        } catch (error) {
            console.error("Error toggling todo:", error);
            // Handle error
        }
    };

    // --- AMPLIFY MODIFICATION: Delete Todo from DataStore ---
    const handleDeleteTodo = async (id) => {
        try {
            const updatedTodos = todos.filter(todo => todo.id !== id);
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.todos = updatedTodos;
            }));
        } catch (error) {
            console.error("Error deleting todo:", error);
            // Handle error
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="border dark:border-slate-700 p-2 h-28"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = (appointments || []).filter(app => app.date === dateStr); // Add null check
            const dayTodos = (todos || []).filter(todo => todo.dueDate === dateStr); // Add null check
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            days.push(
                <div key={day} className={`border dark:border-slate-700 p-2 h-28 flex flex-col ${isToday ? 'bg-red-50 dark:bg-red-900/30' : 'bg-white dark:bg-slate-900'}`}>
                    <span className={`font-bold ${isToday ? 'text-red-600 dark:text-red-300' : 'text-gray-800 dark:text-slate-100'}`}>{day}</span>
                    <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1">
                        {dayAppointments.map(app => (
                            <div key={app.id} onClick={() => setSelectedAppointment(app)} className="bg-[#002458] text-white rounded p-1 cursor-pointer truncate">
                                {app.title}
                            </div>
                        ))}
                        {dayTodos.map(todo => (
                            <div key={todo.id} className={`bg-green-600 text-white rounded p-1 cursor-pointer truncate ${todo.completed ? 'opacity-60 line-through' : ''}`}>
                                {todo.text}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const sortedAppointments = [...(appointments || [])].sort((a, b) => new Date(a.date) - new Date(b.date)); // Add null check
    const sortedTodos = [...(todos || [])].sort((a, b) => (a.completed - b.completed) || (a.dueDate && b.dueDate ? new Date(a.dueDate) - new Date(b.dueDate) : a.dueDate ? -1 : 1)); // Add null check

    return (
        <div className="font-sans space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar & Tasks</h1>
                <Button onClick={() => handleOpenModal()} variant="primary">
                    Add Appointment
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="font-bold p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-300">{'<'}</button>
                    <h2 className="text-xl font-bold dark:text-slate-100">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={handleNextMonth} className="font-bold p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-300">{'>'}</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-600 dark:text-slate-400 mb-2 text-sm">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sortedAppointments.length > 0 ? (
                            sortedAppointments.map(app => (
                                <div key={app.id} onClick={() => handleOpenModal(app)} className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold dark:text-slate-200">{app.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">{new Date(app.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {app.time || 'N/A'}</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-500">{app.condition ? `For: ${app.condition}` : ''}</p>
                                    </div>
                                    <div className="flex gap-2"><button onClick={() => handleOpenModal(app)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Edit</button></div>
                                </div>
                            ))
                        ) : <p className="text-gray-500 dark:text-slate-400">You have no upcoming appointments.</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">To-Do List</h2>
                    <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                        <input type="text" value={newTodoText} onChange={e => setNewTodoText(e.target.value)} placeholder="New task..." className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"/>
                        <input type="date" value={newTodoDate} onChange={e => setNewTodoDate(e.target.value)} className="p-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"/>
                        <button type="submit" className="bg-green-600 text-white font-semibold px-4 rounded-lg hover:bg-green-700">+</button>
                    </form>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {sortedTodos.map(todo => (
                            <div key={todo.id} className="flex items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-md">
                                <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 mr-3"/>
                                <div className="flex-grow">
                                    <p className={`text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-200'}`}>{todo.text}</p>
                                    {todo.dueDate && <p className="text-xs text-gray-500 dark:text-slate-400">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
                                </div>
                                <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-lg">
                        <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formState.id ? 'Edit Appointment' : 'Add New Appointment'}</h2>
                            <input type="text" name="title" value={formState.title} onChange={handleFormChange} placeholder="Appointment Title" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" name="date" value={formState.date} onChange={handleFormChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" required />
                                <input type="time" name="time" value={formState.time} onChange={handleFormChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" />
                            </div>
                            <input type="text" name="location" value={formState.location} onChange={handleFormChange} placeholder="Location (e.g., VA Medical Center)" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" />
                            <select name="condition" value={formState.condition} onChange={handleFormChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                <option value="">Link to a condition (optional)</option>
                                {(claimPackage || []).map(c => <option key={c.name} value={c.name}>{c.name}</option>)} {/* Add null check */}
                            </select>
                            <textarea name="notes" value={formState.notes} onChange={handleFormChange} placeholder="Notes..." className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" rows="3"></textarea>
                            <div className="flex justify-between pt-2">
                                <div>
                                {formState.id && <Button type="button" onClick={() => handleDeleteAppointment(formState.id)} variant="danger">Delete</Button>}
                                </div>
                                <div className="flex space-x-2">
                                <Button type="button" onClick={handleCloseModal} variant="secondary">Cancel</Button>
                                <Button type="submit" variant="primary">Save</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
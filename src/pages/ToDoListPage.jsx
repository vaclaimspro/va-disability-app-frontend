import React, { useState } from 'react';
import { Trash2Icon, PlusCircleIcon } from '../icons.jsx';
import { Button, Input } from '../components.jsx';

export default function ToDoListPage({ userData, setUserData }) {
    const { todos, claimPackage } = userData;
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const newTodo = {
            id: Date.now(),
            task: newTask,
            completed: false,
            dueDate: dueDate || null,
        };
        setUserData(prev => ({
            ...prev,
            todos: [...prev.todos, newTodo]
        }));
        setNewTask('');
        setDueDate('');
    };

    const handleToggleComplete = (id) => {
        setUserData(prev => ({
            ...prev,
            todos: prev.todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        }));
    };

    const handleDeleteTask = (id) => {
        setUserData(prev => ({
            ...prev,
            todos: prev.todos.filter(todo => todo.id !== id)
        }));
    };
    
    const incompleteTasks = todos.filter(t => !t.completed);
    const completedTasks = todos.filter(t => t.completed);

    return (
        <div className="font-sans space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">To-Do List</h1>
                <p className="mt-1 text-slate-600">Manage your tasks to stay on top of your claims process.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow">
                        <Input 
                            label="New Task"
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            name="new-task"
                            placeholder="e.g., Schedule appointment with Dr. Smith"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <Input 
                            label="Due Date (Optional)"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            name="due-date"
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full md:w-auto">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Add Task
                    </Button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Active Tasks ({incompleteTasks.length})</h2>
                <div className="space-y-3">
                    {incompleteTasks.length > 0 ? (
                        incompleteTasks.map(todo => (
                            <div key={todo.id} className="flex items-center p-3 bg-slate-50 rounded-md border">
                                <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 mr-4" />
                                <div className="flex-grow">
                                    <p className="font-medium text-slate-800">{todo.task}</p>
                                    {todo.dueDate && <p className="text-xs text-slate-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
                                </div>
                                <button onClick={() => handleDeleteTask(todo.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">No active tasks. Well done!</p>
                    )}
                </div>
            </div>

            {completedTasks.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Completed Tasks ({completedTasks.length})</h2>
                    <div className="space-y-3">
                        {completedTasks.map(todo => (
                            <div key={todo.id} className="flex items-center p-3 bg-green-50 rounded-md border border-green-200">
                                <input type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo.id)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 mr-4" />
                                <div className="flex-grow">
                                    <p className="font-medium text-slate-500 line-through">{todo.task}</p>
                                    {todo.dueDate && <p className="text-xs text-slate-400 line-through">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
                                </div>
                                <button onClick={() => handleDeleteTask(todo.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2Icon className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
```
***
### **3. `src/pages/AppointmentPage.jsx` (Updated)**

This file is updated to display your to-do list alongside the calendar.


```javascript
import React, { useState } from 'react';
import { Trash2Icon } from '../icons.jsx';

export default function AppointmentPage({ userData, setUserData }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formState, setFormState] = useState({
        id: null, title: '', date: '', time: '', location: '', condition: '', notes: ''
    });

    const { appointments, claimPackage, todos } = userData;

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setFormState({ ...appointment });
        } else {
            setFormState({ id: null, title: '', date: new Date().toISOString().slice(0, 10), time: '', location: '', condition: '', notes: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAppointment = (e) => {
        e.preventDefault();
        if (formState.id) {
            setUserData(prev => ({ ...prev, appointments: prev.appointments.map(app => app.id === formState.id ? formState : app) }));
        } else {
            setUserData(prev => ({ ...prev, appointments: [...prev.appointments, { ...formState, id: Date.now() }] }));
        }
        handleCloseModal();
    };
    
    const handleDeleteAppointment = (id) => {
        setUserData(prev => ({ ...prev, appointments: prev.appointments.filter(app => app.id !== id) }));
        handleCloseModal();
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) { days.push(<div key={`empty-${i}`} className="border p-2 h-28"></div>); }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = appointments.filter(app => app.date === dateStr);
            const dayTodos = todos.filter(todo => todo.dueDate === dateStr && !todo.completed);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            days.push(
                <div key={day} className={`border p-2 h-32 flex flex-col ${isToday ? 'bg-red-50' : ''}`}>
                    <span className={`font-bold ${isToday ? 'text-red-600' : ''}`}>{day}</span>
                    <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1">
                        {dayAppointments.map(app => (<div key={app.id} className="bg-[#002458] text-white rounded p-1 cursor-pointer truncate">{app.title}</div>))}
                        {dayTodos.map(todo => (<div key={todo.id} className="bg-yellow-200 text-yellow-800 rounded p-1 cursor-pointer truncate">{todo.task}</div>))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="font-sans grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Appointments & Tasks</h1>
                    <button onClick={() => handleOpenModal()} className="bg-[#c62727] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#a52020] transition-colors">Add Appointment</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="font-bold">{'<'}</button>
                        <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={handleNextMonth} className="font-bold">{'>'}</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-600 mb-2">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </div>
            </div>
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Upcoming Tasks</h2>
                <div className="space-y-3">
                    {todos.filter(t => !t.completed).length > 0 ? (
                        todos.filter(t => !t.completed).map(todo => (
                            <div key={todo.id} className="p-3 border rounded-lg">
                                <p className="font-semibold">{todo.task}</p>
                                {todo.dueDate && <p className="text-sm text-gray-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No upcoming tasks.</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                         <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800">{formState.id ? 'Edit Appointment' : 'Add New Appointment'}</h2>
                            <input type="text" name="title" value={formState.title} onChange={handleFormChange} placeholder="Appointment Title" className="w-full p-2 border rounded" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" name="date" value={formState.date} onChange={handleFormChange} className="w-full p-2 border rounded" required />
                                <input type="time" name="time" value={formState.time} onChange={handleFormChange} className="w-full p-2 border rounded" />
                            </div>
                            <input type="text" name="location" value={formState.location} onChange={handleFormChange} placeholder="Location" className="w-full p-2 border rounded" />
                            <select name="condition" value={formState.condition} onChange={handleFormChange} className="w-full p-2 border rounded">
                                <option value="">Link to a condition (optional)</option>
                                {claimPackage.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                            <textarea name="notes" value={formState.notes} onChange={handleFormChange} placeholder="Notes..." className="w-full p-2 border rounded" rows="3"></textarea>
                            <div className="flex justify-between items-center">
                                {formState.id && <button type="button" onClick={() => handleDeleteAppointment(formState.id)} className="text-red-600 hover:underline">Delete</button>}
                                <div className="flex justify-end space-x-4 flex-grow">
                                    <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                    <button type="submit" className="bg-[#002458] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#001c46]">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
```
***
### **4. `src/pages/CalculatorPage.jsx` (Updated)**

This file now includes the new "Overview" section at the top.


```javascript
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { VA_KNOWLEDGE_BASE, COMPENSATION_RATES_FULL, ADDITIONAL_DEPENDENT_AMOUNTS } from '../data.js';
import { loadScript, roundToNearestTen, calculateVACombinedRating } from '../utils.js';
import { Button, Input, Select, CircularProgressBar, Card } from '../components.jsx';
import { ChevronDownIcon, CircularPlusIcon, CircularUploadIcon, Trash2Icon, XIcon } from '../icons.jsx';

const GOOGLE_AI_API_KEY = "AIzaSyDekB0_RLxklkmDkzQLRUfDQCb8Oqe1nes";

export default function CalculatorPage({ userData, setUserData, setPage }) {
    
    // ... (All other components like Modal, IncreaseStrategyCard, etc. remain here) ...
    const { disabilities, dependents, serviceDates, presumptiveSymptoms, strategyData, claimPackage, appointments, todos } = userData;
    const [dependentsOpen, setDependentsOpen] = useState(false);
    const [serviceInfoOpen, setServiceInfoOpen] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [isPresumptiveModalOpen, setIsPresumptiveModalOpen] = useState(false);
    const [hasShownPresumptiveModal, setHasShownPresumptiveModal] = useState(false);
    const fileInputRef = useRef(null);

    // ... (All handler functions like addDisability, handleFileSelect, etc. remain here) ...

    const calculationResult = useMemo(() => { /* ... */ }, [disabilities, dependents]);
    const totalSecondaryConditions = useMemo(() => { /* ... */ }, [strategyData]);
    const hasConditions = disabilities.length > 0 && disabilities.some(d => d.name.trim() !== '');

    return (
        <div className="space-y-6">
            {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
            {isPresumptiveModalOpen && <PresumptiveModal onClose={() => setIsPresumptiveModalOpen(false)} />}

            {/* --- NEW OVERVIEW SECTION --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-slate-700">Claims in Progress</h3>
                        <p className="text-3xl font-extrabold text-[#002458] mt-2">{claimPackage.length}</p>
                        <button onClick={() => setPage('claimBuilder')} className="text-sm font-semibold text-blue-600 hover:underline mt-2">View Claims</button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-slate-700">Upcoming Appointments</h3>
                        <p className="text-3xl font-extrabold text-[#002458] mt-2">{appointments.filter(a => new Date(a.date) >= new Date()).length}</p>
                        <button onClick={() => setPage('appointments')} className="text-sm font-semibold text-blue-600 hover:underline mt-2">View Calendar</button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-bold text-slate-700">Active To-Do Items</h3>
                        <p className="text-3xl font-extrabold text-[#002458] mt-2">{todos.filter(t => !t.completed).length}</p>
                        <button onClick={() => setPage('todo')} className="text-sm font-semibold text-blue-600 hover:underline mt-2">View To-Do List</button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                {/* ... Rest of the calculator page content (Rating, Disabilities, etc.) ... */}
            </div>

            {/* ... All other cards for the calculator page ... */}
        </div>
    );
}
```
***
### **5. `src/App.jsx` (Updated)**

Finally, this is the main app file, updated to include the new "To-Do List" page, add the new `todos` state, and update the sidebar.


```javascript
import React, { useState } from 'react';
import CalculatorPage from './pages/CalculatorPage';
import ConditionsOverviewPage from './pages/ConditionsOverviewPage';
import ClaimBuilderPage from './pages/ClaimBuilderPage';
import SymptomTrackerPage from './pages/SymptomTrackerPage';
import AppointmentPage from './pages/AppointmentPage';
import CandPPrepPage from './pages/CandPPrepPage';
import DocumentTemplatesPage from './pages/DocumentTemplatesPage';
import ToDoListPage from './pages/ToDoListPage'; // Import the new page
import { HomeIcon, DocumentTextIcon, PlusCircleIcon, ActivityIcon, CalendarIcon, ClipboardCheckIcon, FileTextIcon, SupportIcon, ListChecksIcon } from './icons.jsx';

export default function App() {
    const [page, setPage] = useState('calculator');
    const [userData, setUserData] = useState({
        disabilities: [],
        dependents: { maritalStatus: 'single', childrenUnder18: 0, childrenOver18School: 0, dependentParents: 0, smcKAwards: 0, spouseAidAttendance: false },
        serviceDates: { eod: '', rad: '' },
        presumptiveSymptoms: {},
        strategyData: { potentialIncreases: [], potentialNewClaims: { presumptiveConditions: [], secondaryConditions: [] } },
        claimPackage: [],
        symptomLogs: {},
        savedDocuments: [],
        appointments: [],
        todos: [], // Add new state for to-do items
        checklistProgress: {},
        practiceAnswers: {},
        dbqAnswers: {},
        postExamLogs: {},
    });

    const addClaimToPackage = (claimToAdd) => { setUserData(prev => { if (prev.claimPackage.some(c => c.name === claimToAdd.name)) { return prev; } return { ...prev, claimPackage: [...prev.claimPackage, claimToAdd] }; }); };
    const removeClaimFromPackage = (claimNameToRemove) => { setUserData(prev => ({ ...prev, claimPackage: prev.claimPackage.filter(c => c.name !== claimNameToRemove) })); };

    const Sidebar = () => {
        const navItems = [
            { name: 'Calculator', icon: <HomeIcon />, id: 'calculator' },
            { name: 'Conditions Overview', icon: <DocumentTextIcon />, id: 'conditionsOverview' },
            { name: 'Claim Builder', icon: <PlusCircleIcon />, id: 'claimBuilder' },
            { name: 'Symptom Tracker', icon: <ActivityIcon />, id: 'symptomTracker' },
            { name: 'Appointments', icon: <CalendarIcon />, id: 'appointments' },
            { name: 'To-Do List', icon: <ListChecksIcon />, id: 'todo' }, // Add new sidebar item
            { name: 'C&P Exam Prep', icon: <ClipboardCheckIcon />, id: 'candpPrep' },
            { name: 'Document Generation', icon: <FileTextIcon />, id: 'documentTemplates' },
            { name: 'Support', icon: <SupportIcon />, id: 'support' },
        ];
        return (
            <aside className="w-64 bg-white p-4 flex-col border-r border-gray-200 hidden md:flex">
                <img src="https://i.ibb.co/YB8HrVsD/VALogo1.png" alt="VA Claims Pro Logo" className="h-auto w-full mb-10" />
                <nav className="flex-grow">
                    <ul>{navItems.map(item => (<li key={item.id}><a href="#" onClick={(e) => { e.preventDefault(); setPage(item.id); }} className={`flex items-center space-x-3 p-3 rounded-lg font-medium my-1 ${page === item.id ? 'bg-[#f9e9e9] text-[#c62727]' : 'text-gray-600 hover:bg-gray-100'}`}>{item.icon}<span>{item.name}</span></a></li>))}</ul>
                </nav>
                <div className="text-xs text-gray-400">© 2025 VA Claims Pro</div>
            </aside>
        );
    };

    const Header = () => ( <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center"><div className="md:hidden text-2xl font-bold text-[#c62727]">VACP</div><div className="hidden md:block flex-1"><div className="flex items-center gap-8"><input type="search" placeholder="Search claims, documents..." className="border rounded-md px-4 py-2 text-sm w-full max-w-xs" /></div></div><div className="flex items-center space-x-4"><div className="w-8 h-8 bg-[#c62727] rounded-full text-white flex items-center justify-center font-bold">V</div></div></header> );

    const renderPage = () => {
        const props = { userData, setUserData, setPage, addClaimToPackage, removeClaimFromPackage, claimPackage: userData.claimPackage };
        switch (page) {
            case 'calculator': return <CalculatorPage {...props} />;
            case 'conditionsOverview': return <ConditionsOverviewPage {...props} />;
            case 'claimBuilder': return <ClaimBuilderPage {...props} />;
            case 'symptomTracker': return <SymptomTrackerPage {...props} />;
            case 'appointments': return <AppointmentPage {...props} />;
            case 'todo': return <ToDoListPage {...props} />; // Add new page case
            case 'candpPrep': return <CandPPrepPage {...props} />;
            case 'documentTemplates': return <DocumentTemplatesPage {...props} />;
            case 'support': return <div className="p-6 bg-white rounded-lg shadow"><h1 className="text-2xl font-bold">Support</h1><p>Contact us at support@vaclaims.pro</p></div>;
            default: return <CalculatorPage {...props} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">{renderPage()}</main>
            </div>
        </div>
    );
}

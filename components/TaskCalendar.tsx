import React, { useState } from 'react';
import { Task } from '../types';

interface TaskCalendarProps {
    tasks: Task[];
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    };

    const getTasksForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(task => task.dueDate === dateStr);
    };

    return (
        <div className="animate-in fade-in duration-500 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <h3 className="text-lg font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="min-h-[80px] sm:min-h-[100px] p-2 rounded-xl bg-gray-50/50"></div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dayTasks = getTasksForDay(day);
                    
                    return (
                        <div 
                            key={day} 
                            className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-xl border transition ${isToday(day) ? 'border-ecomattGreen bg-green-50/30' : 'border-gray-100 bg-white hover:border-gray-200'} flex flex-col`}
                        >
                            <div className={`text-xs font-bold mb-1 ${isToday(day) ? 'text-ecomattGreen' : 'text-gray-500'}`}>
                                {day}
                            </div>
                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                                {dayTasks.map(task => (
                                    <div 
                                        key={task.id} 
                                        className={`text-[10px] sm:text-xs truncate px-1.5 py-0.5 rounded font-bold ${
                                            task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                                            'bg-blue-50 text-blue-600'
                                        } ${task.status === 'Completed' ? 'opacity-50 line-through' : ''}`}
                                        title={task.title}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskCalendar;

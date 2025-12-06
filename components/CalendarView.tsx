
import React, { useState, useMemo } from 'react';
import { CalendarEvent, getAggregatedEvents } from '../services/calendarService';
import { Pig, Task, FinanceRecord } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, DollarSign, Activity } from 'lucide-react';

interface CalendarViewProps {
    pigs: Pig[];
    tasks: Task[];
    financeRecords: FinanceRecord[];
    onNavigate: (view: any) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ pigs, tasks, financeRecords, onNavigate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

    const events = useMemo(() => getAggregatedEvents(pigs, tasks, financeRecords), [pigs, tasks, financeRecords]);

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day: number) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        setSelectedDate(dateStr);
    };

    const renderCalendarGrid = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100"></div>);
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-24 border border-gray-100 p-1 relative cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'ring-2 ring-inset ring-ecomattGreen bg-green-50/30' : ''} ${isToday ? 'bg-green-50/10' : 'bg-white'}`}
                >
                    <div className={`text-xs font-bold mb-1 flex justify-between ${isToday ? 'text-ecomattGreen' : 'text-gray-700'}`}>
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-ecomattGreen text-white shadow-sm' : ''}`}>{day}</span>
                        {dayEvents.length > 0 && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 rounded-full">{dayEvents.length}</span>}
                    </div>

                    <div className="flex flex-col gap-1 overflow-hidden h-[calc(100%-24px)]">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                            <div key={`${event.id}-${idx}`} className={`text-[10px] px-1 py-0.5 rounded border truncate ${event.color}`}>
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="text-[9px] text-gray-400 pl-1">+ {dayEvents.length - 3} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-ecomattGreen" />
                        Farm Calendar
                    </h2>
                    <p className="text-sm text-gray-500">Master schedule of all farm activities</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold text-gray-800 w-32 text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Calendar Grid */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7">
                        {renderCalendarGrid()}
                    </div>
                </div>

                {/* Sidebar (Selected Day Details) */}
                <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a Date'}
                    </h3>

                    {selectedDate ? (
                        <div className="space-y-3 overflow-y-auto flex-1 max-h-[500px] pr-1 custom-scrollbar">
                            {selectedEvents.length > 0 ? selectedEvents.map(event => (
                                <div key={event.id} className={`p-3 rounded-lg border-l-4 ${event.color.replace('text-', 'border-').split(' ')[0]} bg-white shadow-sm border border-gray-100`}>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {event.type === 'Task' && <CheckCircle size={16} className="text-gray-400" />}
                                            {event.type === 'Pig' && <Activity size={16} className="text-purple-400" />}
                                            {event.type === 'Finance' && <DollarSign size={16} className="text-emerald-400" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                                            {event.subType && <p className="text-xs text-ecomattGreen font-medium mt-0.5">{event.subType}</p>}
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{event.type}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-gray-400">
                                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                    <p>No events for this day.</p>
                                    <button className="mt-4 text-xs font-bold text-ecomattGreen hover:underline">+ Add Task</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>Click on a date to view detailed schedule.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;

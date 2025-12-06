
import { Pig, Task, FinanceRecord, PigStage } from '../types';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'Task' | 'Pig' | 'Finance' | 'Other';
    subType?: string; // e.g., 'Repro', 'Income', 'High Priority'
    color: string;
    details?: any;
}

export const getAggregatedEvents = (
    pigs: Pig[],
    tasks: Task[],
    financeRecords: FinanceRecord[]
): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // 1. Process Tasks
    tasks.forEach(task => {
        let color = 'bg-blue-100 text-blue-700 border-blue-200';
        if (task.priority === 'High') color = 'bg-red-100 text-red-700 border-red-200';
        if (task.priority === 'Medium') color = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        if (task.status === 'Completed') color = 'bg-gray-100 text-gray-500 border-gray-200 line-through';

        events.push({
            id: task.id,
            title: task.title,
            date: task.dueDate,
            type: 'Task',
            subType: task.priority,
            color,
            details: task
        });
    });

    // 2. Process Pig Events (from Timeline)
    pigs.forEach(pig => {
        if (pig.timeline) {
            pig.timeline.forEach(event => {
                let color = 'bg-purple-100 text-purple-700 border-purple-200';
                if (event.color === 'red') color = 'bg-red-50 text-red-600 border-red-100';
                if (event.color === 'green') color = 'bg-green-50 text-green-600 border-green-100';

                events.push({
                    id: event.id || `evt-${Math.random()}`,
                    title: `${event.title} (${pig.tagId})`,
                    date: event.date,
                    type: 'Pig',
                    subType: event.subtitle,
                    color,
                    details: { pig, event }
                });
            });
        }

        // Add Birthday? (Optional)
        // events.push({ ... })
    });

    // 3. Process Finance (Scheduled/Projected)
    financeRecords.forEach(record => {
        if (record.status === 'Scheduled' || record.date >= new Date().toISOString().split('T')[0]) {
            let color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            if (record.type === 'Expense') color = 'bg-orange-100 text-orange-700 border-orange-200';

            events.push({
                id: record.id,
                title: `${record.type}: ${record.category}`,
                date: record.date,
                type: 'Finance',
                subType: `$${record.amount}`,
                color,
                details: record
            });
        }
    });

    return events;
};

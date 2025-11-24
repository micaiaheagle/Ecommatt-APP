
import React, { useState, useEffect } from 'react';
import { Pig, TimelineEvent } from '../types';

interface PigProfileProps {
  pig: Pig;
  allPigs: Pig[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedPig: Pig) => void;
  onEdit: () => void;
  onViewHealth: () => void;
}

const PigProfile: React.FC<PigProfileProps> = ({ pig, allPigs, onBack, onDelete, onUpdate, onEdit, onViewHealth }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Lifecycle' | 'Pedigree' | 'Lineage' | 'Gallery'>('Overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Notes State
  const [notes, setNotes] = useState(pig.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Pedigree Edit State
  const [isEditingLineage, setIsEditingLineage] = useState(false);
  const [lineageData, setLineageData] = useState({ sireId: pig.sireId || '', damId: pig.damId || '' });

  // Timeline Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<{title: string, subtitle: string, date: string, color: 'green' | 'yellow' | 'blue' | 'red'}>({
      title: '',
      subtitle: '',
      date: new Date().toISOString().split('T')[0],
      color: 'green'
  });

  // Feed Log Modal State
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [feedData, setFeedData] = useState({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      quantity: 0,
      feedType: 'Grower Pellets'
  });

  // Sync state when pig prop updates
  useEffect(() => {
      setNotes(pig.notes || '');
      setLineageData({ sireId: pig.sireId || '', damId: pig.damId || '' });
  }, [pig]);

  // Helper to calculate age from DOB
  const calculateAge = (dob: string) => {
    if (!dob) return 'Unknown';
    const birth = new Date(dob);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    const years = (diffDays / 365).toFixed(1);
    return `${years} years`;
  };

  // Helper for lifecycle progress
  const getDaysOld = (dob: string) => {
      if (!dob) return 0;
      const birth = new Date(dob);
      const now = new Date();
      return Math.ceil(Math.abs(now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  };

  const confirmDelete = () => {
      onDelete(pig.id);
      setShowDeleteConfirm(false);
  };

  const handleSaveNotes = () => {
      onUpdate({ ...pig, notes });
      setIsEditingNotes(false);
  };

  const handleToggleEventStatus = (idx: number) => {
      if (!pig.timeline) return;
      const newTimeline = [...pig.timeline];
      const event = newTimeline[idx];
      event.status = event.status === 'Completed' ? 'Pending' : 'Completed';
      onUpdate({ ...pig, timeline: newTimeline });
  };

  const handleSaveLineage = () => {
      onUpdate({ ...pig, sireId: lineageData.sireId, damId: lineageData.damId });
      setIsEditingLineage(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newEvent.title || !newEvent.date) return;

      const eventToAdd: TimelineEvent = {
          id: `evt-${Date.now()}`,
          title: newEvent.title,
          subtitle: newEvent.subtitle,
          date: newEvent.date,
          color: newEvent.color,
          status: 'Pending'
      };

      // Create new timeline array
      const updatedTimeline = [eventToAdd, ...(pig.timeline || [])];
      updatedTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      onUpdate({ ...pig, timeline: updatedTimeline });
      setShowEventModal(false);
      setNewEvent({
          title: '',
          subtitle: '',
          date: new Date().toISOString().split('T')[0],
          color: 'green'
      });
  };

  const handleLogFeed = (e: React.FormEvent) => {
      e.preventDefault();
      if (feedData.quantity <= 0) return;

      // Format Last Fed string
      // E.g. "Nov 22 08:30 AM"
      const dateObj = new Date(`${feedData.date}T${feedData.time}`);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const lastFedString = `${formattedDate} ${formattedTime}`;

      // Create Timeline Entry
      const feedEvent: TimelineEvent = {
          id: `feed-${Date.now()}`,
          date: feedData.date,
          title: 'Feed Logged',
          subtitle: `${feedData.quantity}kg ${feedData.feedType}`,
          color: 'green',
          status: 'Completed',
          icon: 'fa-wheat'
      };

      const updatedTimeline = [feedEvent, ...(pig.timeline || [])];
      updatedTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      onUpdate({ 
          ...pig, 
          lastFed: lastFedString,
          timeline: updatedTimeline
      });
      
      setShowFeedModal(false);
      // Reset slightly but keep date/time current
      setFeedData({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          quantity: 0,
          feedType: 'Grower Pellets'
      });
  };

  // Lifecycle Stages Config
  const LIFE_STAGES = [
      { label: 'Piglet', endDay: 30, icon: 'fa-paw' },
      { label: 'Weaner', endDay: 70, icon: 'fa-cube' },
      { label: 'Grower', endDay: 110, icon: 'fa-arrow-up' },
      { label: 'Finisher', endDay: 180, icon: 'fa-weight-hanging' },
      { label: 'Mature', endDay: 9999, icon: 'fa-medal' },
  ];

  // Helper to render parent card
  const renderParentCard = (role: 'SIRE' | 'DAM', id?: string) => {
      const parent = allPigs.find(p => p.tagId === id);
      const colorClass = role === 'SIRE' ? 'blue' : 'pink';
      
      if (isEditingLineage) {
          return (
              <div className={`bg-${colorClass}-50 border border-${colorClass}-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm`}>
                   <span className={`text-[10px] font-bold text-${colorClass}-600 bg-white px-2 py-0.5 rounded shadow-sm border border-${colorClass}-100`}>{role} ID</span>
                   <div className="w-full relative">
                        <input 
                            type="text" 
                            className={`w-full p-2 text-sm border border-${colorClass}-200 rounded-lg text-center focus:outline-none focus:border-ecomattGreen focus:ring-1 focus:ring-ecomattGreen`}
                            value={role === 'SIRE' ? lineageData.sireId : lineageData.damId}
                            onChange={(e) => role === 'SIRE' ? setLineageData({...lineageData, sireId: e.target.value}) : setLineageData({...lineageData, damId: e.target.value})}
                            placeholder={`Enter ${role} Tag`}
                        />
                        <i className="fas fa-pen absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none"></i>
                   </div>
              </div>
          );
      }

      return (
        <div className={`bg-${colorClass}-50 border border-${colorClass}-100 p-4 rounded-2xl relative`}>
            <span className={`text-[10px] font-bold text-${colorClass}-500 bg-white px-2 py-0.5 rounded shadow-sm absolute -top-3 left-1/2 -translate-x-1/2`}>{role}</span>
            
            {parent ? (
                <div className="text-center pt-2">
                    <h4 className="font-bold text-sm text-gray-900">{parent.tagId}</h4>
                    <p className="text-xs text-gray-500">{parent.breed}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{parent.status}</p>
                </div>
            ) : id ? (
                <div className="text-center pt-2">
                    <h4 className="font-bold text-sm text-gray-900">{id}</h4>
                    <p className="text-xs text-gray-500 italic">Unknown Details</p>
                    <button className="mt-2 text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 hover:text-ecomattGreen">
                        <i className="fas fa-search mr-1"></i> Search
                    </button>
                </div>
            ) : (
                <div className="text-center pt-2 min-h-[60px] flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-400 italic">Not Recorded</p>
                    <button 
                        onClick={() => { setLineageData({ sireId: pig.sireId || '', damId: pig.damId || '' }); setIsEditingLineage(true); }}
                        className="mt-2 text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 hover:text-ecomattGreen"
                    >
                        <i className="fas fa-plus mr-1"></i> Add
                    </button>
                </div>
            )}
        </div>
      );
  };

  return (
    <div className="bg-grayBg min-h-screen pb-20 animate-in slide-in-from-right duration-300 relative">
      
      {/* Screen 3: Profile Header */}
      <div className="h-64 bg-gray-900 relative">
          <img 
            src={pig.imageUrl || "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover opacity-60" 
            alt="Pig" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
          
          <button 
            onClick={onBack}
            className="absolute top-6 left-4 text-white w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition z-10"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          
          <div className="absolute top-6 right-4 flex gap-2 z-10">
            <button 
                onClick={onEdit}
                className="text-white w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition"
                title="Edit Details"
            >
                <i className="fas fa-edit"></i>
            </button>
             <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="text-red-400 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-900/50 transition" 
                title="Delete Record"
             >
                <i className="fas fa-trash"></i>
            </button>
          </div>

          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold tracking-tight">{pig.tagId}</h1>
            <p className="text-ecomattYellow font-medium text-sm mt-1">{pig.breed} • {pig.stage}</p>
          </div>
      </div>

      <div className="p-5 -mt-6 bg-grayBg rounded-t-3xl relative z-10">
          
        {/* Quick Stats Grid - 2 Columns */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-3 rounded-2xl text-center border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Age</p>
                <p className="text-lg font-bold text-gray-900">{calculateAge(pig.dob)}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-2xl text-center border border-green-100 shadow-sm">
                <p className="text-[10px] text-green-600 font-bold uppercase">Status</p>
                <p className="text-lg font-bold text-green-700">{pig.status}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl text-center border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Weight</p>
                <p className="text-lg font-bold text-gray-900">{pig.weight}kg</p>
            </div>
             <div className="bg-white p-3 rounded-2xl text-center border border-gray-100 shadow-sm relative overflow-hidden group">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Last Fed</p>
                <p className="text-lg font-bold text-gray-900 truncate px-1">
                    {pig.lastFed ? pig.lastFed.split(' ').slice(1).join(' ') : 'N/A'}
                </p>
                <p className="text-[9px] text-gray-400 mb-1">
                    {pig.lastFed ? pig.lastFed.split(' ')[0] : ''}
                </p>
                {/* Overlay Button */}
                <button 
                  onClick={() => setShowFeedModal(true)}
                  className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white font-bold text-xs"
                >
                  <i className="fas fa-plus mr-1"></i> Log
                </button>
                {/* Always visible mobile button if needed, but hover covers desktop. Let's make it clickable area or small icon */}
                 <button 
                  onClick={() => setShowFeedModal(true)}
                  className="absolute top-1 right-1 w-6 h-6 bg-ecomattGreen text-white rounded-full flex items-center justify-center shadow-sm md:hidden"
                >
                  <i className="fas fa-plus text-[10px]"></i>
                </button>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar pb-2">
            {['Overview', 'Lifecycle', 'Pedigree', 'Lineage', 'Gallery'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeTab === tab 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* --- TAB CONTENT --- */}

        {/* Overview & Lifecycle Content */}
        {(activeTab === 'Overview' || activeTab === 'Lifecycle') && (
            <div className="animate-in fade-in space-y-4">
                
                {/* 1. Lifecycle: Visual Stage Tracker */}
                {activeTab === 'Lifecycle' && (
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="fas fa-chart-line text-ecomattGreen"></i> Growth Progression
                        </h3>
                        
                        <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                            
                            {/* Stages */}
                            <div className="flex justify-between relative z-10">
                                {LIFE_STAGES.map((stage, idx) => {
                                    const daysOld = getDaysOld(pig.dob);
                                    const isCompleted = daysOld > stage.endDay;
                                    const isCurrent = daysOld <= stage.endDay && (idx === 0 || daysOld > LIFE_STAGES[idx - 1].endDay);
                                    
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 w-14">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs border-4 transition-all duration-500
                                                ${isCompleted ? 'bg-ecomattGreen border-ecomattGreen text-white' : 
                                                  isCurrent ? 'bg-white border-ecomattGreen text-ecomattGreen shadow-lg scale-110' : 
                                                  'bg-white border-gray-200 text-gray-300'}
                                            `}>
                                                <i className={`fas ${stage.icon}`}></i>
                                            </div>
                                            <span className={`text-[9px] font-bold text-center ${isCurrent ? 'text-ecomattGreen' : 'text-gray-400'}`}>
                                                {stage.label}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-[9px] text-gray-400 font-mono -mt-1">{daysOld}d</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Info Banner */}
                            <div className="mt-6 bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-3">
                                <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                                <div>
                                    <p className="text-xs text-blue-800 font-bold">Current Phase: {
                                        LIFE_STAGES.find((s, i) => getDaysOld(pig.dob) <= s.endDay && (i === 0 || getDaysOld(pig.dob) > LIFE_STAGES[i-1].endDay))?.label || 'Mature'
                                    }</p>
                                    <p className="text-[10px] text-blue-600 leading-tight mt-1">
                                        Monitor feed conversion ratio closely during this stage. Ensure ad-libitum water access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Overview: Bio Details Card */}
                {activeTab === 'Overview' && (
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                             <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date of Birth</p>
                                <h4 className="text-gray-900 font-bold flex items-center gap-2">
                                    <i className="fas fa-birthday-cake text-pink-400"></i> {pig.dob}
                                </h4>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Exact Age</p>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {calculateAge(pig.dob)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowFeedModal(true)}
                                className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-100 py-3 rounded-xl font-bold text-xs hover:bg-yellow-100 transition flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-utensils"></i> Log Feed
                            </button>
                            <button 
                                onClick={onViewHealth}
                                className="flex-1 bg-blue-50 text-blue-600 border border-blue-100 py-3 rounded-xl font-bold text-xs hover:bg-blue-100 transition flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-file-medical-alt"></i> View Health
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Overview: Notes Section */}
                {activeTab === 'Overview' && (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-900">General Notes</h3>
                            {!isEditingNotes && (
                                <button onClick={() => setIsEditingNotes(true)} className="text-ecomattGreen text-xs font-bold hover:underline">
                                    <i className="fas fa-pencil-alt mr-1"></i> Edit
                                </button>
                            )}
                        </div>
                        {isEditingNotes ? (
                            <div className="animate-in fade-in">
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none mb-2"
                                    rows={4}
                                    placeholder="Add observations, behavioral notes, or medical history..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => {
                                            setNotes(pig.notes || '');
                                            setIsEditingNotes(false);
                                        }} 
                                        className="text-gray-500 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveNotes} 
                                        className="bg-ecomattGreen text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-green-600"
                                    >
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {notes || <span className="text-gray-400 italic">No notes recorded for this animal.</span>}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Shared: Timeline */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Timeline & History</h3>
                    <div className="border-l-2 border-gray-100 ml-3 space-y-8">
                        
                        {/* Render existing Timeline Events */}
                        {pig.timeline && pig.timeline.map((event, idx) => (
                             <div key={idx} className={`relative pl-8 transition-opacity duration-300 ${event.status === 'Completed' ? 'opacity-60' : 'opacity-100'}`}>
                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform
                                    ${event.status === 'Completed' ? 'bg-gray-400' :
                                      event.color === 'green' ? 'bg-green-500' : 
                                      event.color === 'yellow' ? 'bg-yellow-500' :
                                      event.color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}
                                `} onClick={() => handleToggleEventStatus(idx)}>
                                    {event.status === 'Completed' && <i className="fas fa-check text-[8px] text-white"></i>}
                                </div>
                                
                                <div className="flex justify-between items-start group">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1 font-mono">{event.date}</p>
                                        <h4 className={`font-bold text-sm text-gray-900 ${event.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{event.title}</h4>
                                        <p className="text-xs text-gray-500">{event.subtitle}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleToggleEventStatus(idx)}
                                        className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors
                                            ${event.status === 'Completed' 
                                                ? 'bg-gray-100 text-gray-500 border-gray-200' 
                                                : 'bg-white text-ecomattGreen border-green-200 hover:bg-green-50'}
                                        `}
                                    >
                                        {event.status === 'Completed' ? 'Done' : 'Mark Done'}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Fallback event if empty */}
                        {(!pig.timeline || pig.timeline.length === 0) && (
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-gray-300 rounded-full border-2 border-white shadow-sm"></div>
                                <p className="text-xs text-gray-400 mb-1">{pig.dob}</p>
                                <h4 className="font-bold text-gray-900 text-sm">Born / Acquired</h4>
                                <p className="text-xs text-gray-500">Entry into system</p>
                            </div>
                        )}
                        
                    </div>
                    
                    <button 
                        onClick={() => setShowEventModal(true)}
                        className="w-full mt-6 bg-green-50 text-ecomattGreen border border-green-200 py-3 rounded-xl font-bold text-xs hover:bg-green-100 transition flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-plus-circle"></i> Log New Event
                    </button>
                </div>
            </div>
        )}

        {/* Pedigree Chart (Screen 18) */}
        {activeTab === 'Pedigree' && (
             <div className="animate-in fade-in text-center">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-gray-900">Genetics</h2>
                     <button 
                        onClick={() => {
                            if (isEditingLineage) handleSaveLineage();
                            else {
                                setLineageData({ sireId: pig.sireId || '', damId: pig.damId || '' });
                                setIsEditingLineage(true);
                            }
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                            isEditingLineage 
                            ? 'bg-ecomattGreen text-white border-ecomattGreen shadow-md' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                     >
                        {isEditingLineage ? 'Save Changes' : 'Edit Genetics'}
                     </button>
                 </div>

                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative mb-4">
                    {/* Subject */}
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full mb-3 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                         <i className="fas fa-dna text-3xl text-gray-300"></i>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">{pig.tagId}</h3>
                    <p className="text-xs text-gray-500">{pig.breed}</p>
                    
                    {/* Connector */}
                    <div className="absolute bottom-0 left-1/2 w-px h-8 bg-gray-300"></div>
                 </div>

                 {/* Parents */}
                 <div className="grid grid-cols-2 gap-4 relative mt-8">
                    {/* Visual Tree Connector lines */}
                    <div className="absolute -top-4 left-1/4 right-1/4 h-px bg-gray-300 border-t border-gray-300"></div>
                    <div className="absolute -top-4 left-1/4 h-4 w-px bg-gray-300"></div>
                    <div className="absolute -top-4 right-1/4 h-4 w-px bg-gray-300"></div>

                    {renderParentCard('SIRE', pig.sireId)}
                    {renderParentCard('DAM', pig.damId)}
                 </div>
             </div>
        )}

        {/* Lineage Tree (Screen 49) */}
        {activeTab === 'Lineage' && (
             <div className="animate-in fade-in">
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="absolute top-4 right-4 bg-ecomattGreen text-white text-[10px] font-bold px-2 py-1 rounded">3 Generations</div>
                     
                     {/* Simplified Tree Viz */}
                     <div className="flex flex-col items-center gap-8 scale-90">
                         {/* Gen 1 */}
                         <div className="flex flex-col items-center z-10">
                             <div className="w-16 h-16 bg-ecomattGreen text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-4 border-white">{pig.tagId.split('-')[1] || 'Pig'}</div>
                         </div>
                         
                         <div className="w-px h-8 bg-gray-300 -mt-8"></div>
                         <div className="w-32 h-px bg-gray-300"></div>
                         
                         {/* Gen 2 */}
                         <div className="flex justify-between w-48 -mt-4">
                             <div className="flex flex-col items-center">
                                 <div className="w-px h-4 bg-gray-300"></div>
                                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">Sire</div>
                             </div>
                             <div className="flex flex-col items-center">
                                 <div className="w-px h-4 bg-gray-300"></div>
                                 <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm">Dam</div>
                             </div>
                         </div>

                         {/* Gen 3 */}
                          <div className="flex justify-between w-64 text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                              <span>Grand Sire</span><span>Grand Dam</span><span>Grand Sire</span><span>Grand Dam</span>
                          </div>

                     </div>
                 </div>
             </div>
        )}

        {/* Gallery (Screen 19) */}
        {activeTab === 'Gallery' && (
            <div className="animate-in fade-in">
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 mb-6 hover:border-ecomattGreen hover:text-ecomattGreen transition cursor-pointer bg-white"
                >
                    <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                    <span className="text-xs font-bold">Tap to Upload Photo</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {pig.imageUrl && (
                        <div className="aspect-square bg-gray-200 rounded-xl relative overflow-hidden group">
                            <img src={pig.imageUrl} className="w-full h-full object-cover" alt="Pig" />
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 opacity-100">
                                <p className="text-[10px] text-white">Profile Photo</p>
                            </div>
                        </div>
                    )}
                    <div className="aspect-square bg-gray-800 rounded-xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2">
                            <p className="text-[10px] text-white">Oct '25</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Record?</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to permanently delete <span className="font-bold text-gray-900">{pig.tagId}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Log Event Modal */}
      {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:px-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Log Timeline Event</h3>
                      <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-times text-xl"></i>
                      </button>
                  </div>
                  
                  <form onSubmit={handleAddEvent} className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-500 font-bold uppercase ml-1">Event Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Vaccination, Weaning, Moved" 
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Type (Color)</label>
                            <select 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                                value={newEvent.color}
                                onChange={(e) => setNewEvent({...newEvent, color: e.target.value as any})}
                            >
                                <option value="green">General (Green)</option>
                                <option value="blue">Movement (Blue)</option>
                                <option value="yellow">Repro (Yellow)</option>
                                <option value="red">Medical (Red)</option>
                            </select>
                        </div>
                      </div>

                      <div>
                          <label className="text-xs text-gray-500 font-bold uppercase ml-1">Description (Subtitle)</label>
                          <input 
                            type="text" 
                            placeholder="Brief details..." 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                            value={newEvent.subtitle}
                            onChange={(e) => setNewEvent({...newEvent, subtitle: e.target.value})}
                          />
                      </div>

                      <button className="w-full bg-ecomattGreen text-white font-bold py-3 rounded-xl shadow-lg mt-4">
                          Add Event
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Log Feed Modal */}
      {showFeedModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:px-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Log Feed Consumption</h3>
                      <button onClick={() => setShowFeedModal(false)} className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-times text-xl"></i>
                      </button>
                  </div>
                  
                  <form onSubmit={handleLogFeed} className="space-y-4">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                                value={feedData.date}
                                onChange={(e) => setFeedData({...feedData, date: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Time</label>
                            <input 
                                type="time" 
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                                value={feedData.time}
                                onChange={(e) => setFeedData({...feedData, time: e.target.value})}
                            />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Quantity (Kg)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="0.0" 
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none font-bold"
                                value={feedData.quantity}
                                onChange={(e) => setFeedData({...feedData, quantity: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Feed Type</label>
                            <select 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                                value={feedData.feedType}
                                onChange={(e) => setFeedData({...feedData, feedType: e.target.value})}
                            >
                                <option value="Creep Feed">Creep Feed</option>
                                <option value="Weaner Pellets">Weaner Pellets</option>
                                <option value="Grower Pellets">Grower Pellets</option>
                                <option value="Finisher Meal">Finisher Meal</option>
                                <option value="Sow & Boar">Sow & Boar</option>
                            </select>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mt-2">
                        <p className="text-xs text-yellow-800">
                            <i className="fas fa-info-circle mr-1"></i>
                            This will update the 'Last Fed' timestamp for this animal.
                        </p>
                      </div>

                      <button className="w-full bg-ecomattYellow text-black font-bold py-3 rounded-xl shadow-lg mt-4 hover:bg-yellow-500 transition-colors">
                          Confirm Feed
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default PigProfile;

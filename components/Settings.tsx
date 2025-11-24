
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface SettingsProps {
  currentUser: User;
  allUsers: User[];
  onAddUser: (user: User) => void;
  onUpdatePassword: (password: string) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, allUsers, onAddUser, onUpdatePassword, onLogout }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // New User State
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'General Worker' as UserRole, password: '' });
  
  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      const user: User = {
          id: `u${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password
      };
      onAddUser(user);
      setNewUser({ name: '', email: '', role: 'General Worker', password: '' });
      setActiveSection(null);
      alert(`User Created!\nEmail: ${user.email}\nPassword: ${user.password}`);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
          setPasswordMsg("Passwords do not match.");
          return;
      }
      if (newPassword.length < 6) {
          setPasswordMsg("Password too short.");
          return;
      }
      onUpdatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg("Password updated successfully.");
      setTimeout(() => setPasswordMsg(''), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
        
        {/* Profile Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 border-2 border-white shadow-sm">
                {currentUser.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg">{currentUser.name}</h3>
                <p className="text-sm text-ecomattGreen font-medium">{currentUser.role}</p>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
        </div>

        {/* Account Security */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Account Security</h3>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div 
                    onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                            <i className="fas fa-key"></i>
                        </div>
                        <span className="text-sm font-bold text-gray-700">Change Password</span>
                    </div>
                    <i className={`fas fa-chevron-down text-gray-300 transition-transform ${activeSection === 'password' ? 'rotate-180' : ''}`}></i>
                </div>
                
                {activeSection === 'password' && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <form onSubmit={handlePasswordUpdate} className="space-y-3">
                            <input 
                                type="password" 
                                placeholder="New Password"
                                className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordMsg && <p className={`text-xs font-bold ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg}</p>}
                            <button className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg text-sm shadow-md">Update Password</button>
                        </form>
                    </div>
                )}
            </div>
        </div>

        {/* Admin Section: User Management */}
        {currentUser.role === 'Farm Manager' && (
            <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Admin Controls</h3>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-ecomattGreen/20 text-ecomattGreen flex items-center justify-center">
                                    <i className="fas fa-users-cog"></i>
                                </div>
                                <span className="text-sm font-bold text-gray-700">Team Management</span>
                            </div>
                            <button 
                                onClick={() => setActiveSection(activeSection === 'adduser' ? null : 'adduser')}
                                className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-bold"
                            >
                                {activeSection === 'adduser' ? 'Cancel' : '+ Add User'}
                            </button>
                        </div>

                        {/* User List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                            {allUsers.map(user => (
                                <div key={user.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                            <p className="text-[10px] text-gray-500">{user.role}</p>
                                        </div>
                                    </div>
                                    {user.id === currentUser.id && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">You</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add User Form */}
                    {activeSection === 'adduser' && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                            <h4 className="text-xs font-bold text-gray-900 uppercase mb-3">Provision New Account</h4>
                            <form onSubmit={handleCreateUser} className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email Address"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                />
                                <select 
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-white"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                                >
                                    <option value="Farm Manager">Farm Manager</option>
                                    <option value="Herdsman">Herdsman</option>
                                    <option value="Veterinarian">Veterinarian</option>
                                    <option value="General Worker">General Worker</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Initial Password"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                />
                                <button className="w-full bg-ecomattGreen text-black font-bold py-3 rounded-lg text-sm shadow-md hover:bg-green-500 transition-colors">
                                    Create Account
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )}
        
        <button 
          onClick={onLogout}
          className="w-full mt-4 bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition"
        >
          <i className="fas fa-sign-out-alt"></i> Sign Out
        </button>

        <p className="text-center text-gray-400 text-[10px] mt-6">
            Changes to your profile are logged for security.
        </p>
    </div>
  );
};

export default Settings;

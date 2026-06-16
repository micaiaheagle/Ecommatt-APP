
import React from 'react';

interface SupportProps {
  onCancel: () => void;
}

const Support: React.FC<SupportProps> = ({ onCancel }) => {
  return (
    <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={onCancel}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
        >
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-100 p-5 rounded-2xl mb-6 flex gap-4 items-center shadow-sm">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
              <i className="fas fa-phone-alt"></i>
          </div>
          <div>
              <h3 className="font-bold text-red-900">System Emergency?</h3>
              <p className="text-xs text-red-700 mb-2">Call tech support immediately.</p>
              <a href="tel:+263770000000" className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded-lg border border-red-200">
                  Call Support
              </a>
          </div>
      </div>

      {/* FAQ Accordion Simulation */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Common Questions</h3>
      <div className="space-y-2 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-800">How to reset password?</h4>
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-800">Offline sync not working</h4>
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-800">Exporting finance reports</h4>
                  <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
          </div>
      </div>

      {/* Contact Form */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Report an Issue</h3>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Ticket Submitted! Reference #9921'); onCancel(); }}>
              <input 
                type="text" placeholder="Subject" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
              />
              <textarea 
                rows={4} placeholder="Describe the problem or suggestion..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
              ></textarea>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 cursor-pointer hover:bg-gray-100">
                  <i className="fas fa-camera"></i>
                  <span className="text-xs">Attach Screenshot (Optional)</span>
              </div>
              <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg">Submit Ticket</button>
          </form>
      </div>

    </div>
  );
};

export default Support;

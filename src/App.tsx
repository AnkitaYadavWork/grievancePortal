import React, { useState } from 'react';
import './App.css';
import GrievanceForm from './components/GrievanceForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

export interface Complaint {
  id: string;
  name: string;
  mobile: string;
  email: string;
  problem: string;
  constituency: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  date: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      status: 'pending'
    };
    setComplaints([newComplaint, ...complaints]);
    alert('Grievance submitted successfully!');
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status } : complaint
    ));
  };

  return (
    <div className="App">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {currentView === 'form' ? (
          <GrievanceForm onSubmit={addComplaint} />
        ) : (
          <Dashboard 
            complaints={complaints} 
            onUpdateStatus={updateComplaintStatus}
          />
        )}
      </main>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import './Dashboard.css';
import { Complaint } from '../App';

interface DashboardProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, status: Complaint['status']) => void;
}

type FilterStatus = 'all' | 'pending' | 'in-progress' | 'resolved';
type SortOption = 'newest' | 'oldest' | 'priority';

const Dashboard: React.FC<DashboardProps> = ({ complaints, onUpdateStatus }) => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredComplaints = () => {
    let filtered = [...complaints];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.status === filter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.mobile.includes(term) ||
        c.problem.toLowerCase().includes(term) ||
        c.constituency.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'priority':
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStatusBadgeClass = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  const getPriorityBadgeClass = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const filteredComplaints = getFilteredComplaints();
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Grievance Dashboard</h2>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card progress">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card resolved">
            <span className="stat-value">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, mobile, or problem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value as FilterStatus)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="complaints-list">
        {filteredComplaints.length === 0 ? (
          <div className="no-results">
            <p>No grievances found</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <div className="complaint-title">
                  <h3>{complaint.name}</h3>
                  <span className="complaint-date">
                    {new Date(complaint.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="complaint-badges">
                  <span className={`priority-badge ${getPriorityBadgeClass(complaint.priority)}`}>
                    {complaint.priority} priority
                  </span>
                  <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>

              <div className="complaint-details">
                <div className="detail-item">
                  <span className="detail-label">📞 Mobile:</span>
                  <span>{complaint.mobile}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">✉️ Email:</span>
                  <span>{complaint.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Constituency:</span>
                  <span>{complaint.constituency}</span>
                </div>
              </div>

              <div className="complaint-problem">
                <p className="problem-label">Problem Statement:</p>
                <p className="problem-text">{complaint.problem}</p>
              </div>

              <div className="complaint-actions">
                <select 
                  value={complaint.status}
                  onChange={(e) => onUpdateStatus(complaint.id, e.target.value as Complaint['status'])}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
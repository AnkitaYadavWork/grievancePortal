import React, { useState } from 'react';
import './GrievanceForm.css';
import { Complaint } from '../App';

interface GrievanceFormProps {
  onSubmit: (complaint: Omit<Complaint, 'id' | 'status'>) => void;
}

const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    problem: '',
    constituency: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.problem.trim()) {
      newErrors.problem = 'Problem statement is required';
    } else if (formData.problem.length < 10) {
      newErrors.problem = 'Please provide more details (minimum 10 characters)';
    }

    if (!formData.constituency.trim()) {
      newErrors.constituency = 'Constituency is required';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof formData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        email: '',
        problem: '',
        constituency: '',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Lodge Your Grievance</h2>
        <p>Please fill in the details below. Your concerns will be addressed promptly.</p>
      </div>

      <form onSubmit={handleSubmit} className="grievance-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              maxLength={10}
              className={errors.mobile ? 'error' : ''}
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="constituency">Ward *</label>
            <input
              type="text"
              id="constituency"
              name="constituency"
              value={formData.constituency}
              onChange={handleChange}
              placeholder="Enter your constituency"
              className={errors.constituency ? 'error' : ''}
            />
            {errors.constituency && <span className="error-message">{errors.constituency}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="problem">Problem Statement *</label>
          <textarea
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            placeholder="Please describe your problem in detail..."
            rows={5}
            className={errors.problem ? 'error' : ''}
          />
          {errors.problem && <span className="error-message">{errors.problem}</span>}
          <small className="hint">{formData.problem.length}/500 characters</small>
        </div>

        <button type="submit" className="submit-btn">
          Submit Grievance
        </button>
      </form>
    </div>
  );
};

export default GrievanceForm;
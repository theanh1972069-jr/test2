// OverviewCard.jsx
import React from 'react';

const OverviewCard = ({ title, value, iconClass, bgColorClass }) => (
  <div className={`card overview-card-container ${bgColorClass}`}>
    <div className="overview-card-icon">
      <i className={iconClass}></i>
    </div>
    <div className="overview-card-info">
      <span className="overview-card-title">{title}</span>
      <span className="overview-card-value">{value}</span>
    </div>
  </div>
);

export default OverviewCard;
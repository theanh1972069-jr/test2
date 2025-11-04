// DetailCard.jsx
import React from 'react';

const DetailCard = ({ title, value, iconClass, bgColorClass }) => (
  <div className={`card detail-card-container ${bgColorClass}`}>
    <div className="detail-card-icon">
      <i className={iconClass}></i>
    </div>
    <div className="detail-card-info">
      <span className="detail-card-title">{title}</span>
      <span className="detail-card-value">{value}</span>
    </div>
  </div>
);

export default DetailCard;

import React from 'react';
import './YearView.css';



const YearView: React.FC= () => {
  const months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const currentYear = 2024; // Updated to the desired year

  const renderMonthGrid = () => {
    const grid = [];
    const daysOfWeek = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

    for (const month of months) {
      const firstDayOfMonth = new Date(currentYear, months.indexOf(month), 1);
      const lastDayOfMonth = new Date(currentYear, months.indexOf(month) + 1, 0);

      const endDate = lastDayOfMonth.getDate();
      const startDayOfWeek = firstDayOfMonth.getDay();

      const headerRow = daysOfWeek.map((day) => (
        <div key={day} className="day-of-week" style={{ marginRight: '15px' }}>
          {day}
        </div>
      ));

      const emptyBoxes = Array.from({ length: startDayOfWeek }, (_, i) => (
        <div key={`empty-${i}`} className="date-item empty"></div>
      ));

      const dateItems = Array.from({ length: endDate }, (_, i) => (
        <div key={i + 1} className="date-item">
          {i + 1}
        </div>
      ));

      grid.push(
        <div key={month} className="month-container">
          <div className="month-header">
            {month} {currentYear}
          </div>
          <div className="grid-row">
            {headerRow}
          </div>
          <div className="dates-grid">
            {emptyBoxes.concat(dateItems)}
          </div>
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="year-view p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Year View</h2>
      <div className="months-grid">
        {renderMonthGrid()}
      </div>
    </div>
  );
};

export default YearView;

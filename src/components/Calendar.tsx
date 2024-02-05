import React, { useState} from 'react';
import '../App.css';
import YearView from './YearView';

import './calendar.css';

interface CalendarProps {}

interface Country {
  key: string;
  value: string;
}

interface Holiday {
  date: string;
  name: string;
}

const Calendar: React.FC<CalendarProps> = () => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState<'default' | 'year' | 'month'>('default');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentDate(today);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleYear = () => {
    setCurrentView('year');
  };

  const handleMonth = () => {
    setCurrentView('month');
  };

  const fetchHolidays = async (countryCode: string) => {
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/${countryCode}`);
      const apiData = await response.json();
      const mappedHolidays: Holiday[] = apiData.map((apiHoliday: any) => ({
        date: apiHoliday.date,
        name: apiHoliday.name,
      }));
      setHolidays(mappedHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
      const data = await response.json();

      const mappedCountries: Country[] = data.map((apiCountry: any) => ({
        key: apiCountry.countryCode,
        value: apiCountry.name,
      }));

      setCountries(mappedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
fetchCountries();
 

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryCode = event.target.value;
    setSelectedCountry(selectedCountryCode);
    fetchHolidays(selectedCountryCode);
  };

  const renderDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const endDate = lastDayOfMonth.getDate();


    const isHoliday = (date: Date) =>
      holidays.some((holiday) => new Date(holiday.date).toDateString() === date.toDateString());

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="grid-item1 empty-cell"></div>);
    }

    for (let i = 1; i <= endDate; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const holidayForDate = holidays.find((holiday) => new Date(holiday.date).toDateString() === date.toDateString());

      days.push(
        <div
          key={i}
          className={`grid-item1 border border-gray-600 
        ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected bg-green-300 text-white' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex flex-col items-center">
            <div className="justify-center text-lg">{i}</div>
            {isHoliday(date) && (
              <div className="holiday-name bg-blue-500 text-white text-lg p-1 rounded-md mt-1">{holidayForDate?.name}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar p-8 mx-auto my-auto mt-8">
      {currentView !== 'year' && (
        <div className="Header flex flex-col lg:flex-row justify-between items-center mb-4 p-8">
          <div className="nav-buttons space-x-2 lg:mb-0 mb-2">
            <button onClick={handlePrev} className="btn btn-blue">
              Previous
            </button>
            <button onClick={handleNext} className="btn btn-blue">
              Next
            </button>
            <button onClick={handleTodayClick} className="btn btn-blue">
              Today
            </button>
          </div>

          <div className="flex items-center flex-wrap lg:flex-nowrap">
           
            <div className="country-dropdown lg:mr-2 mb-2 lg:mb-0">
              <label className="mr-2">Select Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e)}
                className="border p-2"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.key} value={country.key}>
                    {country.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="month-year">
              <h2 className="text-xl font-bold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
          </div>

          <div className="view flex space-x-2">
            <button onClick={handleMonth} className="btn btn-blue">
              Month
            </button>
            <button onClick={handleYear} className="btn btn-blue">
              Year
            </button>
          </div>
        </div>
      )}

      {currentView === 'year' && (
        <div className="view flex space-x-2 mr-0 justify-end">
          <button onClick={handleMonth} className="btn btn-blue">
            Month
          </button>
          <button onClick={handleYear} className="btn btn-blue">
            Year
          </button>
        </div>
      )}

      {currentView === 'year' && <YearView />}

      {currentView !== 'year' && (
        <>
          <div className="grid grid-cols-7 bg-blue-500 text-white font-bold justify-center border-2px blue">
            <div className="grid-item">Sun</div>
            <div className="grid-item">Mon</div>
            <div className="grid-item">Tue</div>
            <div className="grid-item">Wed</div>
            <div className="grid-item">Thu</div>
            <div className="grid-item">Fri</div>
            <div className="grid-item">Sat</div>
          </div>
          <div className="days grid grid-cols-7 gap-0 row-gap-0">{renderDays()}</div>
        </>
      )}

     {currentView !== 'year' && (
  <div>
    <div>
      {holidays.length > 0 && (
        <div className="selected-date mt-4">
          <div className="font-bold mt-2">Holiday Details:</div>
          <ul>
            {holidays
              .filter((holiday) => new Date(holiday.date).getMonth() === currentDate.getMonth())
              .map((holiday, index) => (
                <li key={index}>
                  {holiday.name} - {holiday.date}
                </li>
              ))}
          </ul>
        </div>
      )}
      {holidays.length === 0 && (
        <div className="selected-date mt-4">
          {currentDate.getMonth() === selectedDate?.getMonth() ? (
            <div>
              <div className="font-bold mt-2">No Holidays</div>
            </div>
          ) : (
            <div>
              <div className="font-bold mt-2">Select a date in the current month</div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default Calendar;

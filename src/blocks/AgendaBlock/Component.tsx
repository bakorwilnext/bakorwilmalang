'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, User, Clock } from 'lucide-react';

interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  category: 'all' | 'events' | 'classes' | 'performances' | 'workshops';
  startDate: string;
  endDate?: string;
  location?: string;
  instructor?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  color: string;
}

interface AgendaBlockProps {
  title?: string;
  showFilters?: boolean;
  defaultView?: 'month' | 'week' | 'day';
  allowedCategories?: string[];
  showUpcoming?: boolean;
  upcomingLimit?: number;
  disableInnerContainer?: boolean;
}

const AgendaBlock: React.FC<AgendaBlockProps> = ({
  title = 'Agenda Bakorwil Malang',
  showFilters = true,
  defaultView = 'week',
  allowedCategories = ['events', 'classes', 'performances', 'workshops'],
  showUpcoming = false,
  upcomingLimit = 5,
  disableInnerContainer = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['events', 'classes', 'performances', 'workshops']);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AgendaItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Helper function to validate and create safe dates
  const createSafeDate = (dateInput: string | Date): Date | null => {
    try {
      if (!dateInput) return null;
      
      const date = new Date(dateInput);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date encountered:', dateInput);
        return null;
      }
      
      return date;
    } catch (error) {
      console.error('Error creating date:', error, dateInput);
      return null;
    }
  };

  // Helper function to format date safely
  const formatDateSafely = (date: Date): string => {
    try {
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return '';
    }
  };

  useEffect(() => {
    // Fetch agenda items from API
    const fetchAgendaItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/agenda');
        if (response.ok) {
          const data = await response.json();
          // Filter out items with invalid dates
          const validItems = (data.docs || []).filter((item: AgendaItem) => {
            const startDate = createSafeDate(item.startDate);
            return startDate !== null;
          });
          setAgendaItems(validItems);
        } else {
          setAgendaItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch agenda items:', error);
        setAgendaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendaItems();
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getFilteredEvents = () => {
    return agendaItems.filter(item => {
      const matchesFilter = selectedFilters.includes(item.category);
      return matchesFilter;
    });
  };

  const getActiveDaysInRange = (startDate: Date, endDate: Date) => {
    const filteredEvents = getFilteredEvents();
    const activeDays: Date[] = [];
    const seenDates = new Set<string>();
    
    // Get all days that have events
    filteredEvents.forEach(item => {
      const eventDate = createSafeDate(item.startDate);
      
      // Skip invalid dates
      if (!eventDate) {
        console.warn('Skipping item with invalid startDate:', item.title, item.startDate);
        return;
      }
      
      // Normalize to local date without time zone issues
      const localEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const eventDateStr = formatDateSafely(localEventDate);
      
      // Skip if we couldn't format the date
      if (!eventDateStr) return;
      
      // Check if this event date falls within our range
      if (localEventDate >= startDate && localEventDate <= endDate) {
        // Check if we already have this date using Set for better performance
        if (!seenDates.has(eventDateStr)) {
          seenDates.add(eventDateStr);
          activeDays.push(localEventDate);
        }
      }
    });
    
    // Sort by date
    activeDays.sort((a, b) => a.getTime() - b.getTime());
    
    return activeDays;
  };

  const getDisplayDays = () => {
    // Get a wider range to find active days
    const rangeStart = new Date(currentDate);
    rangeStart.setDate(currentDate.getDate() - 60); // Look 60 days back
    
    const rangeEnd = new Date(currentDate);
    rangeEnd.setDate(currentDate.getDate() + 60); // Look 60 days forward
    
    const activeDays = getActiveDaysInRange(rangeStart, rangeEnd);
    
    if (activeDays.length === 0) {
      // If no active days, show current week including all 7 days
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days.slice(0, 6); // Still return only 6 days for layout
    }
    
    // Find the index of current date or closest date
    let startIndex = 0;
    const currentDateStr = formatDateSafely(currentDate);
    
    if (currentDateStr) {
      for (let i = 0; i < activeDays.length; i++) {
        const activeDayStr = formatDateSafely(activeDays[i]);
        if (activeDayStr && activeDayStr >= currentDateStr) {
          startIndex = Math.max(0, i - 2); // Show 2 days before current if possible
          break;
        }
      }
      
      // If we didn't find a date >= current date, start from the end
      if (startIndex === 0 && activeDays.length > 0) {
        const lastIndex = activeDays.findIndex(day => {
          const dayStr = formatDateSafely(day);
          return dayStr && dayStr >= currentDateStr;
        });
        if (lastIndex === -1) {
          startIndex = Math.max(0, activeDays.length - 6);
        }
      }
    }
    
    // Return up to 6 active days starting from startIndex
    return activeDays.slice(startIndex, startIndex + 6);
  };

  const getEventsForDate = (date: Date) => {
    // Normalize the input date to avoid timezone issues
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateStr = formatDateSafely(targetDate);
    
    if (!dateStr) return [];
    
    const filteredEvents = getFilteredEvents();
    
    return filteredEvents.filter(item => {
      const eventDate = createSafeDate(item.startDate);
      if (!eventDate) return false;
      
      // Normalize event date to local date
      const localEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const itemDateStr = formatDateSafely(localEventDate);
      return itemDateStr === dateStr;
    });
  };

  const navigateWeek = (direction: number) => {
    const activeDays = getActiveDaysInRange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
    );
    
    if (activeDays.length === 0) {
      // Fallback to regular week navigation
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (direction * 7));
      setCurrentDate(newDate);
      return;
    }
    
    const currentDateStr = formatDateSafely(currentDate);
    if (!currentDateStr) return;
    
    let currentIndex = activeDays.findIndex(day => {
      const dayStr = formatDateSafely(day);
      return dayStr && dayStr >= currentDateStr;
    });
    
    if (currentIndex === -1) {
      currentIndex = activeDays.length - 1;
    }
    
    const newIndex = Math.max(0, Math.min(activeDays.length - 1, currentIndex + (direction * 6)));
    setCurrentDate(activeDays[newIndex] || currentDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (dateStr: string) => {
    const date = createSafeDate(dateStr);
    if (!date) return 'Invalid time';
    
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleEventClick = (event: AgendaItem) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // const getCategoryColor = (category: string) => {
  //   const colors = {
  //     events: 'bg-blue-100 text-blue-800 border-blue-200',
  //     classes: 'bg-green-100 text-green-800 border-green-200',
  //     performances: 'bg-purple-100 text-purple-800 border-purple-200',
  //     workshops: 'bg-orange-100 text-orange-800 border-orange-200',
  //   };
  //   return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  // };

  const getDateRangeDisplay = () => {
    const displayDays = getDisplayDays();
    if (displayDays.length === 0) {
      return `${monthNames[currentDate.getMonth()].toUpperCase()}`;
    }

    const startDay = displayDays[0];
    const endDay = displayDays[displayDays.length - 1];

    // If all days are in the same month
    if (startDay.getMonth() === endDay.getMonth()) {
      return `${startDay.getDate()}-${endDay.getDate()} ${monthNames[startDay.getMonth()].toUpperCase()}`;
    } else {
      // If days span across different months
      return `${startDay.getDate()} ${monthNames[startDay.getMonth()].substring(0, 3).toUpperCase()} - ${endDay.getDate()} ${monthNames[endDay.getMonth()].substring(0, 3).toUpperCase()}`;
    }
  };

  const displayDays = getDisplayDays();
  const weekRange = getDateRangeDisplay();

  if (loading) {
    return (
      <div className={`w-full mx-auto py-16 ${!disableInnerContainer ? 'container px-4' : ''}`}>
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full mx-auto py-16 ${!disableInnerContainer ? 'container px-4' : ''}`}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-0">
                  {weekRange}
                </span>
                <button
                  onClick={() => navigateWeek(1)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Next week"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center lg:text-left">
                {title}
              </h1>
            </div>

            {/* Category Filters */}
            {/* {showFilters && (
              <div className="mt-6 flex flex-wrap gap-2">
                {allowedCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      if (selectedFilters.includes(category)) {
                        // Remove filter if only one is selected, otherwise just remove this one
                        if (selectedFilters.length > 1) {
                          setSelectedFilters(selectedFilters.filter(f => f !== category));
                        }
                      } else {
                        // Add filter
                        setSelectedFilters([...selectedFilters, category]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedFilters.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )} */}
          </div>

          {/* Week View */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, index) => {
                const day = displayDays[index];
                if (!day) {
                  // Empty slot to maintain grid layout
                  return (
                    <div key={index} className="min-h-[300px] lg:min-h-[400px]">
                      <div className="text-center py-8">
                        <div className="text-gray-300 dark:text-gray-600 text-sm">
                          No events
                        </div>
                      </div>
                    </div>
                  );
                }

                const events = getEventsForDate(day);
                const isTodayDay = isToday(day);
                const dayOfWeek = day.getDay();
                const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Adjust for Sunday
                
                return (
                  <div key={index} className="min-h-[300px] lg:min-h-[400px]">
                    {/* Day Header */}
                    <div className="text-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        {dayName}
                      </div>
                      <div className={`text-2xl lg:text-3xl font-light ${
                        isTodayDay 
                          ? 'text-red-500 dark:text-red-400 font-medium' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {day.getDate()}
                      </div>
                      {/* Show month for first day or when month changes */}
                      {(index === 0 || (displayDays[index - 1] && day.getMonth() !== displayDays[index - 1].getMonth())) && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {monthNames[day.getMonth()].substring(0, 3).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Events */}
                    <div className="space-y-3">
                      {events.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-500 text-sm">
                            No events
                          </div>
                        </div>
                      ) : (
                        events.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                            onClick={() => handleEventClick(event)}
                          >
                            {/* Category Badge */}
                            {/* <div className="mb-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                            </div> */}

                            {/* Time */}
                            <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              {formatTime(event.startDate)}
                              {event.endDate && ` - ${formatTime(event.endDate)}`}
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                              {event.title}
                            </h3>

                            {/* Description */}
                            {event.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            
                            {/* Meta Info */}
                            <div className="space-y-1">
                              {event.location && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                              {event.instructor && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <User className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">{event.instructor}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {/* <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span> */}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {selectedEvent.title}
              </h2>
              
              {selectedEvent.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>
              )}
              
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {(() => {
                        const date = createSafeDate(selectedEvent.startDate);
                        return date ? date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Invalid date';
                      })()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(selectedEvent.startDate)}
                      {selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructor */}
                {selectedEvent.instructor && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedEvent.instructor}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Instructor
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add to calendar functionality here
                    closeModal();
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgendaBlock;
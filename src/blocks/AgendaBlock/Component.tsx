'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, User, Clock } from 'lucide-react';

interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  instructor?: string;
  color?: string;
}

interface AgendaBlockProps {
  title?: string;
  defaultView?: 'month' | 'week' | 'day';
  showUpcoming?: boolean;
  upcomingLimit?: number;
  disableInnerContainer?: boolean;
}

const AgendaBlock: React.FC<AgendaBlockProps> = ({
  title = 'Agenda Bakorwil Malang',
  defaultView = 'week',
  showUpcoming = false,
  upcomingLimit = 5,
  disableInnerContainer = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AgendaItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Optimized date utilities
  const createSafeDate = useCallback((dateInput: string | Date): Date | null => {
    try {
      if (!dateInput) return null;
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }, []);

  const formatDateKey = useCallback((date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  // Fetch agenda items with better error handling
  useEffect(() => {
    let mounted = true;
    
    const fetchAgendaItems = async () => {
      try {
        const response = await fetch('/api/agenda?limit=1000&depth=0', {
          next: { revalidate: 60 }
        });
        
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          const validItems = (data.docs || [])
            .filter((item: AgendaItem) => createSafeDate(item.startDate))
            .sort((a: AgendaItem, b: AgendaItem) => 
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
          setAgendaItems(validItems);
        }
      } catch (error) {
        console.error('Failed to fetch agenda:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAgendaItems();
    return () => { mounted = false; };
  }, [createSafeDate]);

  // Memoized events by date map for O(1) lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    
    agendaItems.forEach(item => {
      const date = createSafeDate(item.startDate);
      if (!date) return;
      
      const key = formatDateKey(date);
      const existing = map.get(key) || [];
      map.set(key, [...existing, item]);
    });
    
    return map;
  }, [agendaItems, createSafeDate, formatDateKey]);

  // Memoized sorted active days
  const activeDays = useMemo(() => {
    return Array.from(eventsByDate.keys())
      .map(key => {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => a.getTime() - b.getTime());
  }, [eventsByDate]);

  // Get display days efficiently
  const displayDays = useMemo(() => {
    if (activeDays.length === 0) {
      // Show current week when no events
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
      });
    }
    
    // Find start index based on current date
    const currentDateStr = formatDateKey(currentDate);
    let startIndex = activeDays.findIndex(day => formatDateKey(day) >= currentDateStr);
    
    if (startIndex === -1) {
      startIndex = Math.max(0, activeDays.length - 7);
    } else {
      startIndex = Math.max(0, startIndex - 3);
    }
    
    return activeDays.slice(startIndex, startIndex + 7);
  }, [activeDays, currentDate, formatDateKey]);

  // Get events for date - now O(1) with map lookup
  const getEventsForDate = useCallback((date: Date) => {
    const key = formatDateKey(date);
    return eventsByDate.get(key) || [];
  }, [eventsByDate, formatDateKey]);

  // Navigate week
  const navigateWeek = useCallback((direction: number) => {
    if (activeDays.length === 0) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (direction * 7));
      setCurrentDate(newDate);
      return;
    }
    
    const currentDateStr = formatDateKey(currentDate);
    let currentIndex = activeDays.findIndex(day => formatDateKey(day) >= currentDateStr);
    
    if (currentIndex === -1) currentIndex = activeDays.length - 1;
    
    const newIndex = Math.max(0, Math.min(activeDays.length - 1, currentIndex + (direction * 7)));
    setCurrentDate(activeDays[newIndex] || currentDate);
  }, [activeDays, currentDate, formatDateKey]);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  }, [formatDateKey]);

  const formatTime = useCallback((dateStr: string) => {
    const date = createSafeDate(dateStr);
    if (!date) return 'Invalid time';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, [createSafeDate]);

  const handleEventClick = useCallback((event: AgendaItem) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedEvent(null);
  }, []);

  // Optimized date range display
  const weekRange = useMemo(() => {
    if (displayDays.length === 0) {
      return monthNames[currentDate.getMonth()].toUpperCase();
    }

    const startDay = displayDays[0];
    const endDay = displayDays[displayDays.length - 1];

    if (startDay.getMonth() === endDay.getMonth()) {
      return `${startDay.getDate()}-${endDay.getDate()} ${monthNames[startDay.getMonth()].toUpperCase()}`;
    }
    
    return `${startDay.getDate()} ${monthNames[startDay.getMonth()].substring(0, 3).toUpperCase()} - ${endDay.getDate()} ${monthNames[endDay.getMonth()].substring(0, 3).toUpperCase()}`;
  }, [displayDays, currentDate, monthNames]);

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
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px] text-center">
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

              {/* Title - This is the configurable title */}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center lg:text-left">
                {title}
              </h2>
            </div>
          </div>

          {/* Week View */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 lg:gap-6">
              {displayDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isTodayDay = isToday(day);
                const dayOfWeek = day.getDay();
                const dayName = dayOfWeek === 0 ? 'SUN' : dayNames[dayOfWeek - 1];
                
                return (
                  <div key={formatDateKey(day)} className="min-h-[300px] lg:min-h-[400px]">
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
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {monthNames[day.getMonth()].substring(0, 3).toUpperCase()}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="space-y-3">
                      {events.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-600 text-sm">
                            No events
                          </div>
                        </div>
                      ) : (
                        events.map((event) => (
                          <button
                            key={event.id}
                            className="w-full text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
                            onClick={() => handleEventClick(event)}
                          >
                            {/* Time */}
                            <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              <Clock className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                              <span className="truncate">
                                {formatTime(event.startDate)}
                                {event.endDate && ` - ${formatTime(event.endDate)}`}
                              </span>
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
                          </button>
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Event Details
              </h2>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {selectedEvent.title}
              </h3>
              
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
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedEvent.location}
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
              <button
                onClick={closeModal}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgendaBlock;
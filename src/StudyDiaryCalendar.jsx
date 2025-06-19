import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Check } from "lucide-react";

const StudyDiaryCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState(null);
  const [studyProgress, setStudyProgress] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredPeriod, setHoveredPeriod] = useState(null);

  // 브라우저 환경에서만 localStorage 접근 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("study_diary_progress");
        if (saved) {
          setStudyProgress(JSON.parse(saved));
        }
      } catch (error) {
        console.error("localStorage를 사용할 수 없습니다:", error);
      }
    }
  }, []);

  // studyProgress 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("study_diary_progress", JSON.stringify(studyProgress));
      } catch (error) {
        console.error("localStorage에 저장할 수 없습니다:", error);
      }
    }
  }, [studyProgress]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const calendarDays = [];
  // 달력은 항상 6주(42일)를 표시하도록 고정
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setExpandedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setExpandedDate(null);
  };

  const handleDateClick = (date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    setExpandedDate(prev => (prev === dateKey ? null : dateKey));
  };

  const togglePeriod = (date, period) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    setStudyProgress(prev => {
      const newDayProgress = { ...(prev[dateKey] || {}) };
      newDayProgress[period] = !newDayProgress[period];
      return {
        ...prev,
        [dateKey]: newDayProgress,
      };
    });
  };

  const getCompletionRate = (date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dayProgress = studyProgress[dateKey] || {};
    return Object.values(dayProgress).filter(Boolean).length;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  // --- 스타일 정의 (인라인 스타일) ---
  const containerStyle = {
    width: "100%",
    maxWidth: "64rem",
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "system-ui, -apple-system, sans-serif"
  };

  const headerStyle = {
    background: "linear-gradient(to right, #3b82f6, #9333ea)",
    color: "white",
    padding: "1.5rem",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const navigationStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  };

  const buttonStyle = {
    padding: "0.5rem",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const monthTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    minWidth: "7.5rem",
    textAlign: "center"
  };

  const calendarWrapperStyle = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderTop: "none",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  };

  const weekdayHeaderStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb"
  };

  const weekdayStyle = (index) => ({
    padding: "0.75rem",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "0.875rem",
    color: index === 0 ? "#ef4444" : index === 6 ? "#3b82f6" : "#6b7280"
  });

  const calendarGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(6, 1fr)"
  };

  const dateCellStyle = (index) => ({
    position: "relative",
    borderBottom: "1px solid #e5e7eb",
    borderRight: (index + 1) % 7 === 0 ? "none" : "1px solid #e5e7eb",
    minHeight: "100px"
  });
  
  const dateContentStyle = (date, isExpanded, isHovered) => ({
    padding: "0.5rem",
    height: "100%",
    cursor: "pointer",
    backgroundColor: isExpanded ? "#dbeafe" : (isHovered ? "#eff6ff" : "transparent"),
    outline: isToday(date) ? "2px solid #3b82f6" : "none",
    outlineOffset: "-2px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    transition: "background-color 0.2s"
  });

  const dateNumberStyle = (date) => ({
    fontSize: "0.875rem",
    fontWeight: "500",
    color: isCurrentMonth(date)
      ? (date.getDay() === 0 ? "#ef4444" : date.getDay() === 6 ? "#3b82f6" : "#111827")
      : "#9ca3af"
  });

  const completionBadgeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    color: "#16a34a"
  };

  const progressBarStyle = {
    marginTop: "auto",
    marginBottom: "0.25rem",
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    height: "6px"
  };

  const progressFillStyle = (rate) => ({
    background: "linear-gradient(to right, #4ade80, #22c55e)",
    height: "6px",
    borderRadius: "9999px",
    transition: "width 0.3s",
    width: `${(rate / 6) * 100}%`
  });

  const expandedPanelStyle = (date) => ({
    position: "absolute",
    zIndex: 20,
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "0.75rem",
    marginTop: "0.25rem",
    minWidth: "220px",
    // 팝업이 화면 밖으로 나가지 않도록 위치 조정
    left: date.getDay() > 3 ? 'auto' : '0.5rem',
    right: date.getDay() > 3 ? '0.5rem' : 'auto',
  });

  const periodLabelStyle = (isHovered) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: isHovered ? "#f9fafb" : "transparent"
  });

  const checkboxStyle = {
    width: "1rem",
    height: "1rem",
    accentColor: "#3b82f6",
    cursor: "pointer"
  };

  const periodTextStyle = (isChecked) => ({
    fontSize: "0.875rem",
    color: isChecked ? "#15803d" : "#374151",
    fontWeight: isChecked ? "500" : "400"
  });

  const footerStyle = {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    borderTop: "none",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h1 style={titleStyle}>
            <BookOpen size={28} />
            학습일지
          </h1>
          <div style={navigationStyle}>
            <button onClick={goToPreviousMonth} style={buttonStyle} aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <h2 style={monthTitleStyle}>
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </h2>
            <button onClick={goToNextMonth} style={buttonStyle} aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div style={calendarWrapperStyle}>
        <div style={weekdayHeaderStyle}>
          {dayNames.map((day, index) => (
            <div key={day} style={weekdayStyle(index)}>
              {day}
            </div>
          ))}
        </div>

        <div style={calendarGridStyle}>
          {calendarDays.map((date, index) => {
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const isExpanded = expandedDate === dateKey;
            const completionRate = getCompletionRate(date);
            const isHovered = hoveredDate === dateKey;

            return (
              <div key={index} style={dateCellStyle(index)}>
                <div
                  style={dateContentStyle(date, isExpanded, isHovered)}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span style={dateNumberStyle(date)}>
                      {date.getDate()}
                    </span>
                    {completionRate > 0 && (
                      <div style={completionBadgeStyle}>
                        <Check size={12} />
                        <span style={{ fontSize: "0.75rem", fontWeight: "500" }}>
                          {completionRate}/6
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {completionRate > 0 && (
                    <div style={progressBarStyle}>
                      <div style={progressFillStyle(completionRate)} />
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div style={expandedPanelStyle(date)}>
                    <h4 style={{ fontWeight: "600", color: "#1f2937", marginBottom: "0.75rem", textAlign: "center" }}>
                      {date.getMonth() + 1}월 {date.getDate()}일 학습 현황
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {[1, 2, 3, 4, 5, 6].map(period => {
                        const isChecked = studyProgress[dateKey]?.[period] || false;
                        const periodKey = `${dateKey}-${period}`;
                        const isPeriodHovered = hoveredPeriod === periodKey;
                        
                        return (
                          <label
                            key={period}
                            style={periodLabelStyle(isPeriodHovered)}
                            onMouseEnter={() => setHoveredPeriod(periodKey)}
                            onMouseLeave={() => setHoveredPeriod(null)}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePeriod(date, period)}
                              style={checkboxStyle}
                            />
                            <span style={periodTextStyle(isChecked)}>
                              {period}교시
                            </span>
                            {isChecked && <Check size={16} style={{ color: "#22c55e", marginLeft: "auto" }} />}
                          </label>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #e5e7eb" }}>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          완료: <span style={{ fontWeight: "600", color: "#16a34a" }}>{completionRate}</span> / 6교시
                        </span>
                        <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "0.5rem", marginTop: "0.25rem" }}>
                          <div style={progressFillStyle(completionRate)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={footerStyle}>
        <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
          💡 날짜를 클릭하면 교시별 학습 체크리스트가 나타납니다.
        </div>
      </div>
    </div>
  );
};

export default StudyDiaryCalendar;

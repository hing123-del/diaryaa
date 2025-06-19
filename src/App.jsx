import React, { useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import StudyDiaryCalendar from "./StudyDiaryCalendar";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <KakaoLoginButton onLogin={setUser} />
      ) : (
        <div style={{ padding: 16, fontWeight: 500 }}>
          {user.properties.nickname}님 환영합니다!
          <button style={{ marginLeft: 16 }} onClick={() => setUser(null)}>
            로그아웃
          </button>
          <StudyDiaryCalendar />
        </div>
      )}
    </div>
  );
}

export default App;
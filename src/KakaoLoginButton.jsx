import React, { useEffect } from "react";

const JS_KEY = "91c8584f39217b1edc2b63094904d7e0";

function KakaoLoginButton({ onLogin }) {
  useEffect(() => {
    // Kakao SDK 스크립트가 없다면 동적으로 추가
    if (!window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.onload = () => {
        window.Kakao.init(JS_KEY);
      };
      document.head.appendChild(script);
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JS_KEY);
    }
  }, []);

  const handleLogin = () => {
    if (!window.Kakao) return alert("카카오 SDK 로딩 실패");

    window.Kakao.Auth.login({
      scope: "profile_nickname",
      success: function (authObj) {
        // 사용자 정보 요청
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            onLogin(res); // 부모(App)로 사용자 정보 전달
          },
          fail: function (error) {
            alert("사용자 정보 요청 실패: " + JSON.stringify(error));
          },
        });
      },
      fail: function (err) {
        alert("카카오 로그인 실패: " + JSON.stringify(err));
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        background: "#FEE500",
        color: "#191600",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      카카오로 로그인
    </button>
  );
}

export default KakaoLoginButton;

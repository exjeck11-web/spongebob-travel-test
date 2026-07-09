import React, { useState, useEffect } from 'react';

// --- 스폰지밥 테마 질문 데이터 (12개로 확장하여 모든 성향 공평하게 배분) ---
// A: 자연/액티비티, R: 여유/휴양, C: 역사/전통문화, F: 현대도시/트렌드
const DEFAULT_QUESTIONS = [
  {
    id: 1, // A vs R
    optionA: { text: "다람이와 함께 샌드보드 타러!\n거친 모래산으로 모험 떠나기", type: "A" },
    optionB: { text: "뚱이처럼 바위 밑에 누워\n아무 생각 없이 하루 종일 멍때리기", type: "R" }
  },
  {
    id: 2, // A vs C
    optionA: { text: "해파리 들판에서 뜰채 들고\n이리저리 뛰며 해파리 사냥하기", type: "A" },
    optionB: { text: "바다요정의 전설이 깃든\n고대 비키니 시티 유적지 탐험", type: "C" }
  },
  {
    id: 3, // A vs F
    optionA: { text: "심해 깊은 곳, 불빛 하나 없는\n메롱시티 바닥까지 짜릿한 다이빙!", type: "A" },
    optionB: { text: "스폰지밥과 함께 네온사인 반짝이는\n비키니 시티 다운타운 구경하기", type: "F" }
  },
  {
    id: 4, // R vs C
    optionA: { text: "비눗방울 불면서 퐁퐁 터지는\n소리 들으며 평화롭게 산책하기", type: "R" },
    optionB: { text: "징징이가 좋아하는 우아하고\n고상한 클래식 연주회 관람하기", type: "C" }
  },
  {
    id: 5, // R vs F
    optionA: { text: "따뜻한 해저 화산 옆에서\n달콤한 게살버거 먹으며 힐링", type: "R" },
    optionB: { text: "집게사장님과 함께 번화가에서\n새로운 트렌드와 비즈니스 탐색", type: "F" }
  },
  {
    id: 6, // C vs F
    optionA: { text: "메롱시티의 기괴하고\n오래된 골목길 걸어보기", type: "C" },
    optionB: { text: "비키니 시티 최고 핫플!\n플랑크톤의 미끼식당(앞) 구경가기", type: "F" }
  },
  {
    id: 7, // A vs R
    optionA: { text: "해적 선장의 유령선에 잠입해\n스릴 넘치는 보물찾기", type: "A" },
    optionB: { text: "산호초 사이를 여유롭게 헤엄치며\n아름다운 산호 숲 만끽하기", type: "R" }
  },
  {
    id: 8, // A vs C
    optionA: { text: "야생 바다벌레들이 우글거리는\n해저 동굴 탐험하기", type: "A" },
    optionB: { text: "고대 바다왕 넵튠의 궁전에서\n웅장한 건축물 감상하기", type: "C" }
  },
  {
    id: 9, // A vs F
    optionA: { text: "거대한 해저 소용돌이를 타고\n짜릿한 롤러코스터 즐기기", type: "A" },
    optionB: { text: "비키니 시티 최신 유행!\n화려한 네온 조명의 파티 참석", type: "F" }
  },
  {
    id: 10, // R vs C
    optionA: { text: "구바다 호수 해변에서\n모래성 쌓으며 여유 즐기기", type: "R" },
    optionB: { text: "오래된 해저 케이블카를 타고\n비키니 시티의 클래식한 풍경 감상", type: "C" }
  },
  {
    id: 11, // R vs F
    optionA: { text: "플로터 선장의 푹신한 배 위에서\n따뜻한 햇살 받으며 낮잠자기", type: "R" },
    optionB: { text: "비키니 시티 방송국 앞에서\n가장 트렌디한 하루 보내기", type: "F" }
  },
  {
    id: 12, // C vs F
    optionA: { text: "비키니 시티 역사 박물관에서\n최초의 게살버거 레시피 구경하기", type: "C" },
    optionB: { text: "인플루언서 진주와 함께\n대형 쇼핑몰에서 신상 아이템 싹쓸이", type: "F" }
  }
];

// --- 12개 여행지 결과 데이터 (1순위_2순위 조합으로 12개 완벽 분리) ---
const DEFAULT_RESULTS = {
  // 문화(C) 1순위 조합
  "C_F": { type: "징징이의 우아한 로맨틱", country: "프랑스", code: "FRA", flag: "🇫🇷", continent: "서유럽", spot: "에펠탑", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", reason: "예술을 사랑하는 징징이처럼 고상한 취향을 가진 당신! 예술과 낭만이 살아 숨 쉬는 파리에서 에펠탑의 반짝이는 야경을 감상해보세요.", features: "낭만의 도시, 예술의 중심지, 화려한 야경", mapX: 48, mapY: 28 },
  "C_A": { type: "넵튠왕의 웅장한 역사", country: "독일", code: "DEU", flag: "🇩🇪", continent: "서유럽", spot: "쾰른 대성당", image: "https://images.unsplash.com/photo-1558988628-8fc873b37905?q=80&w=800&auto=format&fit=crop", reason: "압도적인 스케일과 깊은 역사를 사랑하는 당신! 바다왕 넵튠의 궁전처럼 웅장한 쾰른 대성당 앞에서 중세의 숨결을 느껴보세요.", features: "고딕 양식의 정수, 라인강의 기적, 웅장함", mapX: 49, mapY: 25 },
  "C_R": { type: "바다요정의 클래식 감성", country: "러시아", code: "RUS", flag: "🇷🇺", continent: "동유럽/북아시아", spot: "붉은 광장", image: "/다운로드.jpg", reason: "이국적이고 고풍스러운 문화를 선호하는 당신! 테트리스 성으로 유명한 성 바실리 대성당을 거닐며 동화 속 같은 클래식한 감성에 빠져보세요.", features: "동화 같은 건축물, 넓은 대륙, 독특한 문화", mapX: 60, mapY: 22 },

  // 도시(F) 1순위 조합
  "F_C": { type: "퐁퐁부인의 품격", country: "영국", code: "GBR", flag: "🇬🇧", continent: "서유럽", spot: "빅벤 (엘리자베스 타워)", image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=800&auto=format&fit=crop", reason: "현대적인 세련됨과 클래식한 멋을 아는 당신! 템스강 변을 따라 들려오는 빅벤의 웅장한 종소리를 들으며 런던의 분위기를 만끽해 보세요.", features: "클래식 감성, 템스강, 영국 의회의 상징", mapX: 47, mapY: 26 },
  "F_R": { type: "스폰지밥의 자유로운 에너지", country: "미국", code: "USA", flag: "🇺🇸", continent: "북아메리카", spot: "자유의 여신상", image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?q=80&w=800&auto=format&fit=crop", reason: "현대적인 활기와 여유를 동시에 즐기는 당신! 스폰지밥처럼 긍정적인 에너지로 가득한 뉴욕에서 자유의 여신상을 바라보며 아메리칸 드림을 만끽해 보세요.", features: "세계의 중심, 다문화, 자유와 희망", mapX: 25, mapY: 33 },
  "F_A": { type: "세련된 해저 도시", country: "오스트레일리아", code: "AUS", flag: "🇦🇺", continent: "오세아니아", spot: "오페라 하우스", image: "https://images.unsplash.com/photo-1524823136585-610b70c3ba71?q=80&w=800&auto=format&fit=crop", reason: "세련된 건축물과 아름다운 항구, 대자연을 모두 사랑하는 당신! 조개껍데기를 닮은 오페라 하우스에서 품격 있는 시간을 보내보세요.", features: "세계 3대 미항, 현대 건축의 걸작, 남반구", mapX: 85, mapY: 80 },

  // 자연(A) 1순위 조합
  "A_F": { type: "집게사장의 조화로운 감성", country: "캐나다", code: "CAN", flag: "🇨🇦", continent: "북아메리카", spot: "밴쿠버 개스타운", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=800&auto=format&fit=crop", reason: "아름다운 대자연 속에서 세련된 인프라도 놓칠 수 없는 당신! 증기시계가 있는 거리를 걷고, 곧바로 바다와 산으로 향할 수 있는 밴쿠버가 딱입니다.", features: "자연과 도시의 공존, 증기시계, 평화로움", mapX: 15, mapY: 25 },
  "A_C": { type: "플랑크톤의 야생 매력", country: "남아프리카 공화국", code: "ZAF", flag: "🇿🇦", continent: "아프리카", spot: "테이블 마운틴", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop", reason: "거친 대자연과 독특한 문화가 공존하는 곳을 찾는 당신! 평평한 테이블 마운틴에 올라 대서양과 아프리카 대륙이 만나는 절경을 감상하세요.", features: "희귀한 식물군, 대서양 뷰, 아프리카의 끝", mapX: 52, mapY: 82 },
  "A_R": { type: "해파리 사냥꾼의 대자연", country: "노르웨이", code: "NOR", flag: "🇳🇴", continent: "북유럽", spot: "피오르", image: "https://images.unsplash.com/photo-1513515822994-4d89069d3e8e?q=80&w=800&auto=format&fit=crop", reason: "거대한 자연이 주는 경외감과 힐링을 즐기는 당신! 해파리 들판을 뛰어다니는 열정으로 깊고 푸른 협곡, 피오르의 장엄한 대자연 속으로 떠나보세요.", features: "빙하 지형, 백야, 압도적인 자연경관", mapX: 48, mapY: 15 },

  // 여유(R) 1순위 조합
  "R_F": { type: "뚱이의 빈티지 낭만", country: "쿠바", code: "CUB", flag: "🇨🇺", continent: "카리브해", spot: "바라데로 해변", image: "https://images.unsplash.com/photo-1500331002237-7815de0b7c1e?q=80&w=800&auto=format&fit=crop", reason: "시간이 멈춘 듯한 낭만과 여유, 그리고 음악을 사랑하는 당신! 올드카가 달리는 아바나를 지나 눈부시게 하얀 해변에서 여유를 즐겨보세요.", features: "카리브해의 진주, 빈티지 감성, 살사 음악", mapX: 25, mapY: 45 },
  "R_C": { type: "역사가 숨쉬는 시간여행", country: "대한민국", code: "KOR", flag: "🇰🇷", continent: "동아시아", spot: "경주 역사유적지구", image: "https://images.unsplash.com/photo-1590215752152-ed229df83ab7?q=80&w=800&auto=format&fit=crop", reason: "편안한 휴식 속에서 깊은 역사와 문화를 탐구하는 당신! 천년의 신라 역사가 살아 숨 쉬는 고즈넉한 경주에서 힐링 시간 여행을 떠나보세요.", features: "천년고도, 유네스코 세계유산, 고즈넉함", mapX: 83, mapY: 37 },
  "R_A": { type: "다람이의 알프스 힐링", country: "스위스", code: "CHE", flag: "🇨🇭", continent: "서유럽", spot: "마테호른", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop", reason: "깨끗한 자연 속에서 하이킹과 완벽한 평화를 원하는 당신! 다람이가 좋아할 만한 뾰족한 마테호른 영봉을 보며 대자연의 힐링을 경험하세요.", features: "알프스의 혼, 청정 자연, 환상적인 뷰", mapX: 49, mapY: 30 }
};


// --- 공통 아이콘 ---
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 2 5 5 2-2-1-3 3-3 5 6 1.2-.7c.4-.2.7-.6.6-1.1z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
  </svg>
);

const IntroView = ({ onStart, onAdmin }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-600 text-white relative">
    {/* 거품 장식 */}
    <div className="absolute top-10 left-10 text-white/30 text-4xl animate-pulse">🫧</div>
    <div className="absolute bottom-32 right-12 text-white/20 text-5xl animate-bounce">🪼</div>
    
    <button onClick={onAdmin} className="absolute top-6 right-6 text-white/70 hover:text-white transition">
      <SettingsIcon />
    </button>
    
    <div className="bg-yellow-300 p-6 rounded-3xl mb-8 animate-bounce shadow-xl border-4 border-yellow-400 rotate-3">
      <div className="text-6xl">🍍</div>
    </div>
    
    <h1 className="text-4xl font-black mb-4 text-center tracking-tight leading-tight text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
      나의 비키니 시티<br/>여행 세포 깨우기
    </h1>
    
    <p className="text-cyan-50 text-lg mb-12 text-center max-w-xs leading-relaxed font-bold drop-shadow-md">
      마법의 소라고둥이 알려주는<br/>나에게 딱 맞는 육지 세상 랜드마크! 🐚
    </p>
    
    <button 
      onClick={onStart}
      className="w-full max-w-xs bg-yellow-400 text-blue-900 font-black py-5 px-8 rounded-2xl shadow-[0_8px_0_#b45309] text-xl hover:bg-yellow-300 hover:translate-y-1 hover:shadow-[0_4px_0_#b45309] transition-all active:translate-y-2 active:shadow-none"
    >
      육지로 출발~! ⚓
    </button>
  </div>
);

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-cyan-900 text-white relative overflow-hidden">
    {/* 물결 배경 애니메이션 효과 */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-blue-500 to-transparent animate-pulse"></div>
    
    <div className="relative w-32 h-32 mb-8 z-10">
      <div className="absolute inset-0 border-8 border-cyan-700 rounded-full"></div>
      <div className="absolute inset-0 border-8 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-4xl">
        🐚
      </div>
    </div>
    <h2 className="text-2xl font-black text-yellow-300 text-center animate-pulse z-10 drop-shadow-lg" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
      마법의 소라고둥이<br/>당신의 목적지를 찾는 중...
    </h2>
    <p className="mt-4 text-cyan-200 font-bold z-10">보글보글... 🫧</p>
  </div>
);

const QuizView = ({ question, index, total, onAnswer }) => {
  return (
    <div className="flex flex-col h-full bg-cyan-50 px-6 py-8 relative">
       {/* 배경 장식 */}
       <div className="absolute top-20 right-5 text-cyan-100 text-6xl opacity-50">🌸</div>
       <div className="absolute bottom-40 left-5 text-cyan-100 text-5xl opacity-50">🌸</div>

      {/* 진행 상태바 */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between text-sm font-black text-cyan-800 mb-2">
          <span>여정 진행률</span>
          <span>{index + 1} / {total}</span>
        </div>
        <div className="w-full bg-cyan-200 h-4 rounded-full overflow-hidden border-2 border-cyan-800">
          <div 
            className="bg-yellow-400 h-full rounded-full transition-all duration-300 ease-out border-r-2 border-yellow-600"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6 pb-12 relative z-10">
        <button 
          onClick={() => onAnswer(question.optionA.type)}
          className="w-full flex-1 bg-white border-4 border-cyan-200 hover:border-yellow-400 rounded-[2rem] p-6 shadow-[0_6px_0_#a5f3fc] flex items-center justify-center text-center hover:-translate-y-1 hover:shadow-[0_10px_0_#fef08a] transition-all active:translate-y-2 active:shadow-none"
        >
          <span className="text-xl font-bold text-cyan-950 whitespace-pre-line leading-relaxed" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
            {question.optionA.text}
          </span>
        </button>

        <div className="flex justify-center -my-3 relative z-20">
          <span className="bg-pink-400 text-white border-2 border-pink-600 px-5 py-2 rounded-full font-black text-lg shadow-md transform rotate-3">VS</span>
        </div>

        <button 
          onClick={() => onAnswer(question.optionB.type)}
          className="w-full flex-1 bg-white border-4 border-cyan-200 hover:border-yellow-400 rounded-[2rem] p-6 shadow-[0_6px_0_#a5f3fc] flex items-center justify-center text-center hover:-translate-y-1 hover:shadow-[0_10px_0_#fef08a] transition-all active:translate-y-2 active:shadow-none"
        >
          <span className="text-xl font-bold text-cyan-950 whitespace-pre-line leading-relaxed" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
            {question.optionB.text}
          </span>
        </button>
      </div>
    </div>
  );
};

const ResultView = ({ result, onRestart }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '마법의 소라고둥이 추천하는 랜드마크',
          text: `나에게 완벽한 육지 여행지는 [${result.country} ${result.spot}] 입니다! 🍍`,
          url: window.location.href,
        });
      } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyan-100 overflow-y-auto">
      <div className="min-h-max p-4 sm:p-6 pb-12 w-full flex flex-col items-center">
        
        <h2 className="text-center font-black text-cyan-800 mb-4 mt-2 tracking-widest text-sm drop-shadow-sm">
          🌟 YOUR BIKINI BOTTOM RESULT 🌟
        </h2>

        {/* 보딩패스 컨테이너 */}
        <div className="bg-[#fef9c3] rounded-3xl shadow-2xl overflow-hidden relative border-4 border-yellow-400 mx-auto w-full max-w-[360px] flex flex-col">
          {/* 헤더 */}
          <div className="bg-yellow-400 text-blue-900 p-3 flex justify-between items-center relative border-b-4 border-yellow-500">
            <div className="font-black tracking-wider text-xs sm:text-sm flex items-center gap-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
              <span className="text-xl">🧽</span>
              BIKINI BOTTOM AIR
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] opacity-90 bg-white/40 px-2 py-1 rounded font-bold border border-yellow-500">BOARDING PASS</div>
          </div>

          {/* 출발-도착 표시 */}
          <div className="px-4 py-4 border-b-2 border-dashed border-yellow-500 bg-yellow-50 flex justify-between items-center">
            <div className="text-center">
              <div className="text-[10px] text-yellow-600 font-bold mb-0.5">FROM</div>
              <div className="text-2xl font-black text-blue-900 tracking-tighter">BKB</div>
              <div className="text-[10px] text-blue-700 font-bold">Bikini Bottom</div>
            </div>
            
            <div className="flex flex-col items-center flex-1 px-3">
              <div className="w-full border-t-2 border-blue-300 border-dashed relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-50 px-1 text-blue-500 transform hover:scale-125 transition-transform">
                  <PlaneIcon />
                </div>
              </div>
              <div className="text-[10px] font-black text-pink-600 mt-2 whitespace-nowrap bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">
                {result.type}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-yellow-600 font-bold mb-0.5">TO</div>
              <div className="text-2xl font-black text-pink-600 tracking-tighter">
                {result.code || result.country.substring(0,3).toUpperCase()}
              </div>
              <div className="text-[10px] text-blue-700 font-bold line-clamp-1">{result.continent || 'World'}</div>
            </div>
          </div>

          {/* 랜드마크 사진 영역 (비율 조정) */}
          <div className="relative w-full aspect-[16/7] min-h-[160px] bg-yellow-100 p-2 pb-0">
            <div className="w-full h-full rounded-t-2xl overflow-hidden shadow-inner border-2 border-yellow-300 relative">
              <img 
                src={result.image} 
                alt={result.spot} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800'; }}
              />
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black text-pink-600 shadow-md border-2 border-pink-200 flex items-center gap-1 z-10">
              📍 {result.continent || '추천 랜드마크'}
            </div>
          </div>

          {/* 바디 (내용) */}
          <div className="p-5 relative pt-4 bg-yellow-50">
            <div className="text-[10px] font-black text-yellow-600 mb-1 tracking-widest">DESTINATION</div>
            <div className="flex flex-col mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl drop-shadow-sm">{result.flag || '✈️'}</span>
                <span className="text-2xl font-black text-blue-950 leading-none">{result.country}</span>
              </div>
              <span className="text-xl font-black text-pink-500 leading-none ml-1">{result.spot}</span>
            </div>

            <div className="bg-white rounded-xl p-4 mb-5 text-[12px] sm:text-xs text-blue-900 leading-relaxed font-bold border-2 border-blue-100 shadow-sm relative">
              <div className="absolute -top-3 -left-2 text-3xl text-blue-200">❝</div>
              <span className="relative z-10">{result.reason}</span>
            </div>

            {/* 지도 영역 */}
            <div className="bg-white border-2 border-blue-100 rounded-xl p-3 mb-4">
              <div className="text-[11px] font-black text-blue-600 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1"><MapIcon /> LOCATION MAP</span>
                <span className="text-[9px] text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded animate-pulse">👉 지도를 탭하여 구글맵 열기</span>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.country + ' ' + result.spot)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative w-full aspect-[2/1] bg-[#e0f2fe] rounded-lg overflow-hidden border border-blue-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                {/* 안정적인 세계지도 패턴 배경 */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
                  className="absolute w-full h-full object-cover opacity-20 mix-blend-multiply" 
                  alt="World Map Texture" 
                />
                
                {/* 핀 위치 표시 */}
                <div className="absolute w-full h-full top-0 left-0">
                  <div 
                    className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-500"
                    style={{ left: `${result.mapX || 50}%`, top: `${result.mapY || 50}%` }}
                  >
                    {/* 통통 튀는 핀 애니메이션 */}
                    <div className="animate-bounce text-3xl drop-shadow-md origin-bottom relative top-1" style={{ color: '#ec4899', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>📍</div>
                    <div className="text-[10px] font-black bg-white/95 text-blue-900 px-2 py-0.5 rounded-md shadow-md whitespace-nowrap border-2 border-blue-100 mt-1">
                      {result.country}
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex gap-2 flex-wrap">
              {result.features.split(',').map((feature, idx) => (
                <span key={idx} className="text-[10px] font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200">
                  # {feature.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* 바코드 영역 (푸터) */}
          <div className="border-t-4 border-dashed border-yellow-400 p-4 flex flex-col items-center justify-center bg-white relative mt-auto rounded-b-3xl">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-cyan-100 rounded-full border-b-4 border-r-4 border-yellow-400 rotate-45"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-100 rounded-full border-b-4 border-l-4 border-yellow-400 -rotate-45"></div>
            
            <div className="w-full flex justify-between px-4 mb-3">
               <div className="text-center">
                  <div className="text-[10px] text-yellow-600 font-bold mb-0.5">DATE</div>
                  <div className="text-[11px] font-black text-blue-900">TODAY</div>
               </div>
               <div className="text-center">
                  <div className="text-[10px] text-yellow-600 font-bold mb-0.5">GATE</div>
                  <div className="text-[11px] font-black text-blue-900">🍍 01</div>
               </div>
               <div className="text-center">
                  <div className="text-[10px] text-yellow-600 font-bold mb-0.5">SEAT</div>
                  <div className="text-[11px] font-black text-blue-900">VIP</div>
               </div>
            </div>

            <div className="w-full h-12 flex justify-between px-2 opacity-70">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="bg-blue-900" style={{ width: Math.random() * 3 + 1 + 'px' }}></div>
              ))}
            </div>
            <div className="text-center font-mono text-[10px] text-blue-500 font-bold mt-2 tracking-[0.2em]">
              KRABBY PATTY PASSENGER
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 flex gap-3 mx-auto w-full max-w-[360px]">
          <button 
            onClick={handleShare}
            className="flex-1 bg-pink-500 text-white font-black py-4 text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-pink-400 active:scale-95 transition-all shadow-[0_4px_0_#be185d]"
          >
            <ShareIcon /> 결과 공유하기
          </button>
          <button 
            onClick={onRestart}
            className="flex-1 bg-white text-blue-600 font-black border-4 border-blue-200 py-4 text-sm rounded-2xl hover:bg-blue-50 active:scale-95 transition-all shadow-[0_4px_0_#bfdbfe]"
          >
            다시 해보기
          </button>
        </div>
        <p className="text-center mt-4 text-[11px] font-bold text-cyan-700">결과를 위아래로 스크롤하여 모두 확인해보세요! 🧽</p>
        
      </div>
    </div>
  );
};

const AdminView = ({ questions, results, onSave, onBack }) => {
  const [editedQuestions, setEditedQuestions] = useState(JSON.parse(JSON.stringify(questions)));
  const [editedResults, setEditedResults] = useState(JSON.parse(JSON.stringify(results)));

  const handleSave = () => {
    onSave(editedQuestions, editedResults);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">⚙️ 관리자 설정</h1>
        <div className="space-x-2">
          <button onClick={onBack} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-bold">취소</button>
          <button onClick={handleSave} className="px-3 py-1 bg-sky-500 text-white rounded-md text-sm font-bold shadow-sm">저장</button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-6">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-200 font-bold">
          A(자연/액티비티), R(여유/휴양), C(역사/문화), F(도시/트렌드) 조합으로 12개 여행지를 매칭합니다.
        </div>

        {/* 결과 세팅 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <span>🌍</span> 추천 랜드마크 설정 (12개)
          </h2>
          {Object.keys(editedResults).map(typeKey => (
            <div key={typeKey} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 border-l-4 border-sky-500 pl-2 flex justify-between items-center">
                <span>조합: {typeKey}</span>
                <span className="text-xs font-normal text-slate-400">{editedResults[typeKey].country}</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <input 
                    className="w-2/3 p-2 border rounded" 
                    placeholder="국가 (예: 프랑스)"
                    value={editedResults[typeKey].country}
                    onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], country: e.target.value}})}
                  />
                  <input 
                    className="w-1/3 p-2 border rounded" 
                    placeholder="영문코드 (FRA)"
                    value={editedResults[typeKey].code || ''}
                    onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], code: e.target.value.toUpperCase()}})}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2 relative">
                    <span className="absolute left-2 top-2 text-xs text-slate-400">지도 가로 위치(%)</span>
                    <input 
                      className="w-full p-2 pt-6 border rounded text-right" 
                      type="number" min="0" max="100"
                      value={editedResults[typeKey].mapX || ''}
                      onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], mapX: Number(e.target.value)}})}
                    />
                  </div>
                  <div className="w-1/2 relative">
                    <span className="absolute left-2 top-2 text-xs text-slate-400">지도 세로 위치(%)</span>
                    <input 
                      className="w-full p-2 pt-6 border rounded text-right" 
                      type="number" min="0" max="100"
                      value={editedResults[typeKey].mapY || ''}
                      onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], mapY: Number(e.target.value)}})}
                    />
                  </div>
                </div>
                <input 
                  className="w-full p-2 border rounded" 
                  placeholder="명소 (예: 에펠탑)"
                  value={editedResults[typeKey].spot}
                  onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], spot: e.target.value}})}
                />
                <input 
                  className="w-full p-2 border rounded" 
                  placeholder="이미지 URL"
                  value={editedResults[typeKey].image || ''}
                  onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], image: e.target.value}})}
                />
                <textarea 
                  className="w-full p-2 border rounded text-xs h-20" 
                  placeholder="추천 이유 설명"
                  value={editedResults[typeKey].reason}
                  onChange={(e) => setEditedResults({...editedResults, [typeKey]: {...editedResults[typeKey], reason: e.target.value}})}
                />
              </div>
            </div>
          ))}
        </section>

        {/* 질문 세팅 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
            <span>📝</span> 설문 문항 설정 (12개)
          </h2>
          {editedQuestions.map((q, i) => (
            <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="font-bold text-slate-500 mb-3 text-sm">질문 {i + 1}</div>
              
              <div className="mb-3 p-3 bg-slate-50 rounded border border-slate-100">
                <div className="flex gap-2 mb-1">
                  <select 
                    className="p-1 border rounded text-xs bg-white font-bold"
                    value={q.optionA.type}
                    onChange={(e) => {
                      const newQ = [...editedQuestions];
                      newQ[i].optionA.type = e.target.value;
                      setEditedQuestions(newQ);
                    }}
                  >
                    <option value="A">A(자연/액티비티)</option>
                    <option value="R">R(여유/휴양)</option>
                    <option value="C">C(역사/문화)</option>
                    <option value="F">F(도시/트렌드)</option>
                  </select>
                  <span className="text-xs text-slate-400 self-center">선택지 1</span>
                </div>
                <input 
                  className="w-full p-2 border rounded text-sm font-bold" 
                  value={q.optionA.text}
                  onChange={(e) => {
                    const newQ = [...editedQuestions];
                    newQ[i].optionA.text = e.target.value;
                    setEditedQuestions(newQ);
                  }}
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                 <div className="flex gap-2 mb-1">
                  <select 
                    className="p-1 border rounded text-xs bg-white font-bold"
                    value={q.optionB.type}
                    onChange={(e) => {
                      const newQ = [...editedQuestions];
                      newQ[i].optionB.type = e.target.value;
                      setEditedQuestions(newQ);
                    }}
                  >
                    <option value="A">A(자연/액티비티)</option>
                    <option value="R">R(여유/휴양)</option>
                    <option value="C">C(역사/문화)</option>
                    <option value="F">F(도시/트렌드)</option>
                  </select>
                  <span className="text-xs text-slate-400 self-center">선택지 2</span>
                </div>
                <input 
                  className="w-full p-2 border rounded text-sm font-bold" 
                  value={q.optionB.text}
                  onChange={(e) => {
                    const newQ = [...editedQuestions];
                    newQ[i].optionB.text = e.target.value;
                    setEditedQuestions(newQ);
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default function TravelTestApp() {
  const [view, setView] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ A: 0, R: 0, C: 0, F: 0 });
  const [finalResultKey, setFinalResultKey] = useState(null);

  // 로컬 환경에서 이전 버전 데이터가 남아 알고리즘 업데이트가 안 되는 것을 방지하기 위해 v5로 업데이트
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('festivalQuestions_v5');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
  });
  
  const [resultsData, setResultsData] = useState(() => {
    const saved = localStorage.getItem('festivalResults_v5');
    return saved ? JSON.parse(saved) : DEFAULT_RESULTS;
  });

  const handleStart = () => {
    setScores({ A: 0, R: 0, C: 0, F: 0 });
    setCurrentIndex(0);
    setView('quiz');
  };

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 쏠림 현상 방지를 위해 성향 배열을 먼저 무작위로 섞음 (동점자 공정 처리)
      let types = ['A', 'R', 'C', 'F'];
      for (let i = types.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [types[i], types[j]] = [types[j], types[i]];
      }

      // 섞인 배열을 바탕으로 점수 순으로 정렬
      const sortedTypes = types.sort((a, b) => newScores[b] - newScores[a]);
      let top1 = sortedTypes[0];
      let top2 = sortedTypes[1];
      
      // 조합키 생성 (1순위_2순위 그대로 사용하여 12개 국가 완벽 대응)
      let resultKey = `${top1}_${top2}`;
      
      // 혹시 모를 에러를 위한 방어 로직
      if (!resultsData[resultKey]) {
         resultKey = Object.keys(resultsData)[0];
      }

      setFinalResultKey(resultKey);
      
      setView('loading');
      setTimeout(() => {
        setView('result');
      }, 2000);
    }
  };

  const handleSaveAdmin = (newQuestions, newResults) => {
    setQuestions(newQuestions);
    setResultsData(newResults);
    localStorage.setItem('festivalQuestions_v5', JSON.stringify(newQuestions));
    localStorage.setItem('festivalResults_v5', JSON.stringify(newResults));
    setView('intro');
  };

  return (
    <div className="w-full min-h-screen bg-cyan-950 flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-cyan-800">
        {view === 'intro' && (
          <IntroView onStart={handleStart} onAdmin={() => setView('admin')} />
        )}
        
        {view === 'quiz' && (
          <QuizView 
            question={questions[currentIndex]} 
            index={currentIndex} 
            total={questions.length} 
            onAnswer={handleAnswer} 
          />
        )}

        {view === 'loading' && <LoadingView />}

        {view === 'result' && (
          <ResultView 
            result={resultsData[finalResultKey]} 
            onRestart={() => setView('intro')} 
          />
        )}

        {view === 'admin' && (
          <AdminView 
            questions={questions} 
            results={resultsData} 
            onSave={handleSaveAdmin} 
            onBack={() => setView('intro')} 
          />
        )}
      </div>
    </div>
  );
}
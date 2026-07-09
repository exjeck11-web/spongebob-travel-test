import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

// ... existing code ...
const QuizView = ({ question, index, total, onAnswer }) => {
// ... existing code ...
        </button>
      </div>
    </div>
  );
};

const ResultView = ({ result, onRestart }) => {
  const ticketRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!ticketRef.current || isSharing) return;
    setIsSharing(true);
    
    try {
      // 화면 캡처 옵션 (해상도를 높이고, 외부 이미지 로딩 허용)
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#cffafe' // 배경색을 예쁘게 유지
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'bikini_bottom_ticket.png', { type: 'image/png' });

      // 스마트폰 자체 사진 공유 기능 지원 여부 확인
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '마법의 소라고둥 추천 랜드마크',
          text: `나에게 완벽한 여행지는 [${result.country} ${result.spot}] 입니다! 🍍`,
          files: [file]
        });
      } else {
        // PC나 공유 미지원 브라우저의 경우 사진 파일로 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `스폰지밥_여행테스트_${result.country}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.log('Error sharing or capturing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyan-100 overflow-y-auto">
      <div className="min-h-max p-4 sm:p-6 pb-12 w-full flex flex-col items-center">
        
        {/* === 캡처될 영역을 감싸는 div 추가 === */}
        <div ref={ticketRef} className="w-full flex flex-col items-center pb-4">
          <h2 className="text-center font-black text-cyan-800 mb-4 mt-2 tracking-widest text-sm drop-shadow-sm">
            🌟 YOUR BIKINI BOTTOM RESULT 🌟
          </h2>

          <div className="bg-[#fef9c3] rounded-3xl shadow-2xl overflow-hidden relative border-4 border-yellow-400 mx-auto w-full max-w-[360px] flex flex-col">
            <div className="bg-yellow-400 text-blue-900 p-3 flex justify-between items-center relative border-b-4 border-yellow-500">
              <div className="font-black tracking-wider text-xs sm:text-sm flex items-center gap-2" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'}}>
                <span className="text-xl">🧽</span>
                BIKINI BOTTOM AIR
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] opacity-90 bg-white/40 px-2 py-1 rounded font-bold border border-yellow-500">BOARDING PASS</div>
            </div>

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

            <div className="relative w-full aspect-[16/7] min-h-[160px] bg-yellow-100 p-2 pb-0">
              <div className="w-full h-full rounded-t-2xl overflow-hidden shadow-inner border-2 border-yellow-300 relative">
                <img 
                  src={result.image} 
                  alt={result.spot} 
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800'; }}
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black text-pink-600 shadow-md border-2 border-pink-200 flex items-center gap-1 z-10">
                📍 {result.continent || '추천 랜드마크'}
              </div>
            </div>

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
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
                    crossOrigin="anonymous"
                    className="absolute w-full h-full object-cover opacity-20 mix-blend-multiply" 
                    alt="World Map Texture" 
                  />
                  <div className="absolute w-full h-full top-0 left-0">
                    <div 
                      className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-500"
                      style={{ left: `${result.mapX || 50}%`, top: `${result.mapY || 50}%` }}
                    >
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
        </div>
        {/* === 캡처될 영역 끝 === */}

        {/* 하단 버튼 */}
        <div className="mt-6 flex gap-3 mx-auto w-full max-w-[360px]">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 bg-pink-500 text-white font-black py-4 text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-pink-400 active:scale-95 transition-all shadow-[0_4px_0_#be185d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShareIcon /> {isSharing ? '사진 굽는 중...📸' : '결과 공유하기'}
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
// ... existing code ...

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppStep, RoundData, RoundMatch, PlayerSlot } from './types';
import { TEAMS, ROUND_CONFIGS, SLOTS, PASSWORD_REPORT } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import RulesScreen from './components/RulesScreen';
import RoundPreview from './components/RoundPreview';
import StrategyScreen from './components/StrategyScreen';
import MatchingScreen from './components/MatchingScreen';
import BattleScreen from './components/BattleScreen';
import RoundReveal from './components/RoundReveal';
import FinalStandings from './components/FinalStandings';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [rounds, setRounds] = useState<RoundData[]>(
    ROUND_CONFIGS.map(config => ({
      roundNumber: config.round,
      isLocked: false,
      matches: config.pairings.map(([t1, t2]) => ({
        team1Id: t1,
        team2Id: t2,
        assignments: {
          [t1]: {},
          [t2]: {}
        },
        results: SLOTS.map(slot => ({ slot, winnerTeamId: null })),
        completed: false
      }))
    }))
  );

  const [announcement, setAnnouncement] = useState("");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const currentRound = rounds[currentRoundIdx];

  const generateAnnouncement = useCallback(async (context: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `あなたは格式高い将棋大会の大会運営委員です。落ち着きがあり、礼節を重んじ、参加者が集中できるような簡潔で品格のあるアナウンス文（100文字程度）を日本語で作成してください。状況：${context}`,
      });
      setAnnouncement(response.text || "");
    } catch (e) {
      console.error(e);
      setAnnouncement("各チーム、準備が整いましたら速やかに対局を開始してください。礼に始まり礼に終わる対局を期待します。");
    }
  }, []);

  const handleNextStep = () => {
    switch (step) {
      case AppStep.WELCOME: setStep(AppStep.RULES); break;
      case AppStep.RULES: setStep(AppStep.ROUND_PREVIEW); break;
      case AppStep.ROUND_PREVIEW: 
        setStep(AppStep.STRATEGY_REGISTRATION); 
        generateAnnouncement(`第${currentRound.roundNumber}回戦のオーダー提出を開始します。`);
        break;
      case AppStep.STRATEGY_REGISTRATION: setStep(AppStep.MATCHING_DISPLAY); break;
      case AppStep.MATCHING_DISPLAY: setStep(AppStep.BATTLE_PROGRESS); break;
      case AppStep.BATTLE_PROGRESS: setStep(AppStep.ROUND_REVEAL); break;
      case AppStep.ROUND_REVEAL:
        if (currentRoundIdx < ROUND_CONFIGS.length - 1) {
          setCurrentRoundIdx(prev => prev + 1);
          setStep(AppStep.ROUND_PREVIEW);
        } else {
          setStep(AppStep.FINAL_STANDINGS);
        }
        break;
    }
  };

  const updateAssignments = (matchIdx: number, teamId: number, assignments: { [key: string]: string }) => {
    const newRounds = [...rounds];
    newRounds[currentRoundIdx].matches[matchIdx].assignments[teamId] = assignments;
    
    const allRegistered = newRounds[currentRoundIdx].matches.every(m => 
      Object.keys(m.assignments[m.team1Id]).length === 4 && 
      Object.keys(m.assignments[m.team2Id]).length === 4
    );
    
    if (allRegistered) {
      newRounds[currentRoundIdx].isLocked = true;
    }
    setRounds(newRounds);
  };

  const reportResult = (matchIdx: number, slot: PlayerSlot, winnerTeamId: number) => {
    const newRounds = [...rounds];
    const match = newRounds[currentRoundIdx].matches[matchIdx];
    const resultIdx = match.results.findIndex(r => r.slot === slot);
    match.results[resultIdx].winnerTeamId = winnerTeamId;

    if (match.results.every(r => r.winnerTeamId !== null)) {
      match.completed = true;
    }
    setRounds(newRounds);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#141413] text-[#e7e5e4] overflow-x-hidden">
      <div className="max-w-4xl w-full space-y-8">
        {step === AppStep.WELCOME && <WelcomeScreen onStart={handleNextStep} />}
        {step === AppStep.RULES && <RulesScreen onNext={handleNextStep} />}
        {step === AppStep.ROUND_PREVIEW && (
          <RoundPreview 
            round={currentRound} 
            onNext={handleNextStep} 
          />
        )}
        {step === AppStep.STRATEGY_REGISTRATION && (
          <StrategyScreen 
            round={currentRound} 
            announcement={announcement}
            onComplete={handleNextStep}
            onUpdateAssignment={updateAssignments}
          />
        )}
        {step === AppStep.MATCHING_DISPLAY && (
          <MatchingScreen 
            round={currentRound} 
            onNext={handleNextStep} 
          />
        )}
        {step === AppStep.BATTLE_PROGRESS && (
          <BattleScreen 
            round={currentRound} 
            onReport={reportResult}
            onAllFinished={handleNextStep}
          />
        )}
        {step === AppStep.ROUND_REVEAL && (
          <RoundReveal 
            round={currentRound} 
            onNext={handleNextStep} 
          />
        )}
        {step === AppStep.FINAL_STANDINGS && (
          <FinalStandings 
            allRounds={rounds} 
          />
        )}
      </div>
    </div>
  );
};

export default App;

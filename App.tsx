
import React, { useState } from 'react';
import { AppStep, RoundData, PlayerSlot } from './types';
import { ROUND_CONFIGS, SLOTS } from './constants';
import WelcomeScreen from './WelcomeScreen';
import RulesScreen from './RulesScreen';
import RoundPreview from './RoundPreview';
import StrategyScreen from './StrategyScreen';
import MatchingScreen from './MatchingScreen';
import BattleScreen from './BattleScreen';
import RoundReveal from './RoundReveal';
import FinalStandings from './FinalStandings';

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

  const currentRound = rounds[currentRoundIdx];

  const handleNextStep = () => {
    switch (step) {
      case AppStep.WELCOME: setStep(AppStep.RULES); break;
      case AppStep.RULES: setStep(AppStep.ROUND_PREVIEW); break;
      case AppStep.ROUND_PREVIEW: setStep(AppStep.STRATEGY_REGISTRATION); break;
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-5xl w-full space-y-8">
        {step === AppStep.WELCOME && <WelcomeScreen onStart={handleNextStep} />}
        {step === AppStep.RULES && <RulesScreen onNext={handleNextStep} />}
        {step === AppStep.ROUND_PREVIEW && (
          <RoundPreview round={currentRound} onNext={handleNextStep} />
        )}
        {step === AppStep.STRATEGY_REGISTRATION && (
          <StrategyScreen 
            round={currentRound} 
            onComplete={handleNextStep}
            onUpdateAssignment={updateAssignments}
          />
        )}
        {step === AppStep.MATCHING_DISPLAY && (
          <MatchingScreen round={currentRound} onNext={handleNextStep} />
        )}
        {step === AppStep.BATTLE_PROGRESS && (
          <BattleScreen 
            round={currentRound} 
            onReport={reportResult}
            onAllFinished={handleNextStep}
          />
        )}
        {step === AppStep.ROUND_REVEAL && (
          <RoundReveal round={currentRound} onNext={handleNextStep} />
        )}
        {step === AppStep.FINAL_STANDINGS && (
          <FinalStandings allRounds={rounds} />
        )}
      </div>
    </div>
  );
};

export default App;

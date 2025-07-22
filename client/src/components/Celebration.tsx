import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'daily' | 'goal-50' | 'goal-100' | 'streak-3' | 'streak-7' | 'streak-30';
  title: string;
  description: string;
}

export function Celebration({ isOpen, onClose, type, title, description }: CelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getEmoji = () => {
    switch (type) {
      case 'daily': return '🎯';
      case 'goal-50': return '⭐';
      case 'goal-100': return '🏆';
      case 'streak-3': return '🔥';
      case 'streak-7': return '💪';
      case 'streak-30': return '👑';
      default: return '🎉';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'daily': return '#FF6B35';
      case 'goal-50': return '#FFD700';
      case 'goal-100': return '#32CD32';
      case 'streak-3': return '#FF4500';
      case 'streak-7': return '#FF1493';
      case 'streak-30': return '#9400D3';
      default: return '#FF6B35';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center border-2" style={{ borderColor: getColor() }}>
        <div className="relative overflow-hidden">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    fontSize: '20px',
                  }}
                >
                  {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          )}
          
          <div className="space-y-6 py-6">
            <div className="text-8xl animate-pulse">
              {getEmoji()}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold" style={{ color: getColor() }}>
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              <div 
                className="text-4xl font-bold animate-pulse"
                style={{ color: getColor() }}
              >
                Congratulations!
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keep up the amazing progress! 🚀
              </p>
            </div>

            <Button 
              onClick={onClose}
              className="mt-6"
              style={{ backgroundColor: getColor() }}
            >
              Continue Coding! 💪
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MilestoneTrackerProps {
  children: React.ReactNode;
  userId: number;
}

export function MilestoneTracker({ children, userId }: MilestoneTrackerProps) {
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    type: CelebrationProps['type'];
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'daily',
    title: '',
    description: ''
  });

  const checkMilestones = async () => {
    try {
      const response = await fetch('/api/stats');
      const stats = await response.json();

      // Check daily goal completion
      const userResponse = await fetch('/api/user');
      const user = await userResponse.json();
      
      if (stats.todaysSolved >= user.dailyGoal && stats.todaysSolved === user.dailyGoal) {
        setCelebration({
          isOpen: true,
          type: 'daily',
          title: 'Daily Goal Achieved!',
          description: `You've completed ${stats.todaysSolved} problems today!`
        });
        return;
      }

      // Check streak milestones
      if (stats.currentStreak === 3) {
        setCelebration({
          isOpen: true,
          type: 'streak-3',
          title: '3-Day Streak!',
          description: 'You\'re building momentum!'
        });
        return;
      }

      if (stats.currentStreak === 7) {
        setCelebration({
          isOpen: true,
          type: 'streak-7',
          title: '7-Day Streak!',
          description: 'One week of consistent practice!'
        });
        return;
      }

      if (stats.currentStreak === 30) {
        setCelebration({
          isOpen: true,
          type: 'streak-30',
          title: '30-Day Streak!',
          description: 'You\'re a coding champion!'
        });
        return;
      }

      // Check goal progress
      const goalsResponse = await fetch('/api/goals');
      const goals = await goalsResponse.json();
      
      goals.forEach((goal: any) => {
        const progress = (goal.currentProgress / goal.targetProblems) * 100;
        
        if (progress >= 50 && progress < 60) {
          setCelebration({
            isOpen: true,
            type: 'goal-50',
            title: 'Halfway There!',
            description: `50% progress on "${goal.name}"`
          });
        } else if (progress >= 100) {
          setCelebration({
            isOpen: true,
            type: 'goal-100',
            title: 'Goal Completed!',
            description: `"${goal.name}" achieved!`
          });
        }
      });
      
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  };

  // Check milestones when component mounts and periodically
  useEffect(() => {
    checkMilestones();
    const interval = setInterval(checkMilestones, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <>
      {children}
      <Celebration
        isOpen={celebration.isOpen}
        onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
        type={celebration.type}
        title={celebration.title}
        description={celebration.description}
      />
    </>
  );
}
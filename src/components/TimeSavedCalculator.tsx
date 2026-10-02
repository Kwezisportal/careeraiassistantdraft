import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import { Clock, Calculator, TrendingDown, TrendingUp, Info } from 'lucide-react';
import type { TimeSavedResult } from '@/types';

export function TimeSavedCalculator() {
  const [manualMinutes, setManualMinutes] = useState('');
  const [appMinutes, setAppMinutes] = useState('');
  const [result, setResult] = useState<TimeSavedResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const manual = parseFloat(manualMinutes);
    const app = parseFloat(appMinutes);

    if (isNaN(manual) || isNaN(app)) {
      setError('Please enter valid numbers for both fields.');
      setResult(null);
      return;
    }

    if (manual < 0 || app < 0) {
      setError('Time values cannot be negative.');
      setResult(null);
      return;
    }

    if (manual === 0) {
      setError('Manual drafting time cannot be zero (division by zero).');
      setResult(null);
      return;
    }

    setError('');
    const timeSaved = manual - app;
    const percentageSaved = (timeSaved / manual) * 100;
    setResult({ timeSaved, percentageSaved });
  };

  const reset = () => {
    setManualMinutes('');
    setAppMinutes('');
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-navy-100 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-navy-900">Time Saved Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">
            Manual drafting time (minutes)
          </label>
          <TextInput
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 120"
            value={manualMinutes}
            onChange={(e) => setManualMinutes(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">
            Time spent using CareerCraft AI (minutes)
          </label>
          <TextInput
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30"
            value={appMinutes}
            onChange={(e) => setAppMinutes(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {result && (
          <div className="bg-cream-50 rounded-lg p-4 border border-navy-100 animate-fade-in">
            {result.timeSaved > 0 ? (
              <>
                <div className="flex items-center gap-2 text-teal-700 mb-2">
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-semibold">Time saved</span>
                </div>
                <p className="text-2xl font-bold text-navy-900">
                  {Math.round(result.timeSaved)} minutes saved
                </p>
                <p className="text-sm text-navy-500 mt-1">
                  That's approximately {Math.round(result.percentageSaved)}% of your manual drafting time.
                </p>
              </>
            ) : result.timeSaved === 0 ? (
              <>
                <div className="flex items-center gap-2 text-navy-600 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">No time difference</span>
                </div>
                <p className="text-lg font-semibold text-navy-900">
                  Both methods took the same amount of time.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">AI took longer</span>
                </div>
                <p className="text-2xl font-bold text-navy-900">
                  {Math.abs(Math.round(result.timeSaved))} minutes longer with AI
                </p>
                <p className="text-sm text-navy-500 mt-1">
                  That's {Math.abs(Math.round(result.percentageSaved))}% more time than manual drafting.
                </p>
              </>
            )}
            <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-navy-100">
              <Info className="w-3.5 h-3.5 text-navy-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-navy-400">
                This is an estimate based on your entered figures, not a verified research finding.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" onClick={calculate}>Calculate</Button>
          {(result || error) && (
            <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { getVapingRecommendation } from '../services/geminiService';
// Corrected import paths for types and icon components to be relative.
import type { AdvisorAnswers, Recommendation, Product } from '../types';
import { SparklesIcon } from './IconComponents';

type Step = 'start' | 'habit' | 'goal' | 'preference' | 'loading' | 'results' | 'error';

interface VapingAdvisorProps {
    onViewProduct: (productName: string) => void;
    products: Product[];
}

const RadioButton = ({ name, value, label, checked, onChange }: { name: string; value: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${checked ? 'border-brand-blue-light bg-gray-800' : 'border-gray-600 hover:border-brand-blue-light hover:bg-gray-800'}`}>
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-5 w-5 text-brand-blue-light focus:ring-brand-blue-light bg-gray-700 border-gray-600"/>
        <span className="ml-4 text-dark-text font-medium">{label}</span>
    </label>
);

export const VapingAdvisor: React.FC<VapingAdvisorProps> = ({ onViewProduct, products }) => {
  const [step, setStep] = useState<Step>('start');
  const [answers, setAnswers] = useState<AdvisorAnswers>({
    smokingHabit: '',
    vapingGoal: '',
    preference: '',
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    switch (step) {
      case 'start': setStep('habit'); break;
      case 'habit': if (answers.smokingHabit) setStep('goal'); break;
      case 'goal': if (answers.vapingGoal) setStep('preference'); break;
      case 'preference': if (answers.preference) handleSubmit(); break;
    }
  };

  const handleSubmit = async () => {
    setStep('loading');
    setError(null);
    try {
      const result = await getVapingRecommendation(answers, products);
      setRecommendations(result);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setStep('error');
    }
  };

  const resetAdvisor = () => {
    setAnswers({ smokingHabit: '', vapingGoal: '', preference: '' });
    setRecommendations([]);
    setError(null);
    setStep('start');
  };

  const renderStep = () => {
    switch (step) {
      case 'start':
        return (
          <div className="text-center">
            <button onClick={nextStep} className="bg-brand-blue-light text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-blue-dark transition-colors duration-300 text-lg">
                Comenzar Asesoría
            </button>
          </div>
        );
      case 'habit':
        return (
          <div>
            <h3 className="font-semibold text-xl mb-4 text-center">¿Cuál es tu hábito de fumar actual?</h3>
            <div className="space-y-3">
                <RadioButton name="smokingHabit" value="No fumo, soy vaper" label="No fumo, ya soy vaper" checked={answers.smokingHabit === "No fumo, soy vaper"} onChange={handleAnswerChange} />
                <RadioButton name="smokingHabit" value="Menos de 10 cigarrillos al día" label="Menos de 10 cigarrillos al día" checked={answers.smokingHabit === "Menos de 10 cigarrillos al día"} onChange={handleAnswerChange} />
                <RadioButton name="smokingHabit" value="Entre 10 y 20 cigarrillos al día" label="Entre 10 y 20 cigarrillos al día" checked={answers.smokingHabit === "Entre 10 y 20 cigarrillos al día"} onChange={handleAnswerChange} />
                <RadioButton name="smokingHabit" value="Más de 20 cigarrillos al día" label="Más de 20 cigarrillos al día" checked={answers.smokingHabit === "Más de 20 cigarrillos al día"} onChange={handleAnswerChange} />
            </div>
          </div>
        );
      case 'goal':
        return (
            <div>
                <h3 className="font-semibold text-xl mb-4 text-center">¿Qué buscas en el vapeo?</h3>
                <div className="space-y-3">
                    <RadioButton name="vapingGoal" value="Dejar de fumar" label="Dejar de fumar" checked={answers.vapingGoal === "Dejar de fumar"} onChange={handleAnswerChange} />
                    <RadioButton name="vapingGoal" value="Disfrutar de sabores intensos" label="Disfrutar de sabores intensos" checked={answers.vapingGoal === "Disfrutar de sabores intensos"} onChange={handleAnswerChange} />
                    <RadioButton name="vapingGoal" value="Producir grandes nubes de vapor" label="Producir grandes nubes de vapor" checked={answers.vapingGoal === "Producir grandes nubes de vapor"} onChange={handleAnswerChange} />
                    <RadioButton name="vapingGoal" value="Algo sencillo y sin complicaciones" label="Algo sencillo y sin complicaciones" checked={answers.vapingGoal === "Algo sencillo y sin complicaciones"} onChange={handleAnswerChange} />
                </div>
            </div>
        );
      case 'preference':
        return (
            <div>
                <h3 className="font-semibold text-xl mb-4 text-center">¿Qué tipo de dispositivo prefieres?</h3>
                <div className="space-y-3">
                    <RadioButton name="preference" value="Discreto y portátil" label="Discreto y portátil" checked={answers.preference === "Discreto y portátil"} onChange={handleAnswerChange} />
                    <RadioButton name="preference" value="Potente y con muchas opciones" label="Potente y con muchas opciones" checked={answers.preference === "Potente y con muchas opciones"} onChange={handleAnswerChange} />
                    <RadioButton name="preference" value="Equilibrado, ni muy grande ni muy pequeño" label="Equilibrado, ni muy grande ni muy pequeño" checked={answers.preference === "Equilibrado, ni muy grande ni muy pequeño"} onChange={handleAnswerChange} />
                </div>
            </div>
        );
      case 'loading':
        return <div className="text-center">
            <p className="text-lg font-semibold animate-pulse text-brand-blue-light">Consultando a nuestros expertos...</p>
            <p className="text-gray-400 mt-2">Estamos preparando tus recomendaciones personalizadas.</p>
        </div>;
      case 'results':
        return (
            <div>
                <h3 className="font-bold text-2xl mb-6 text-center text-white">Tus recomendaciones personalizadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-700 bg-dark-secondary rounded-lg p-4 flex flex-col items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src={rec.imageUrl} alt={rec.productName} className="w-40 h-40 object-contain rounded-md mb-4"/>
                            <h4 className="font-bold text-lg text-brand-blue-light">{rec.productName}</h4>
                            <p className="text-sm font-semibold text-gray-400 mb-2">{rec.productType}</p>
                            <p className="text-sm text-gray-300 flex-grow">{rec.reasoning}</p>
                            <button onClick={() => onViewProduct(rec.productName)} className="mt-4 bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm">Ver Producto</button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button onClick={resetAdvisor} className="text-brand-blue-light hover:underline">Empezar de nuevo</button>
                </div>
            </div>
        );
      case 'error':
        return (
            <div className="text-center">
                <h3 className="font-bold text-xl text-red-500 mb-4">¡Oops! Algo salió mal.</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button onClick={resetAdvisor} className="bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300">Intentar de nuevo</button>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-brand-blue-light mr-2" />
            <h2 className="text-3xl font-bold text-white">Asesor de Vapeo Inteligente</h2>
        </div>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto">¿No sabes por dónde empezar? Responde unas pocas preguntas y nuestra IA te recomendará los productos perfectos para ti.</p>
      <div className="max-w-2xl mx-auto bg-dark-secondary rounded-xl shadow-lg p-8 border border-gray-700">
          {renderStep()}
          {step !== 'start' && step !== 'loading' && step !== 'results' && step !== 'error' && (
              <div className="mt-8 text-center">
                  <button onClick={nextStep} className="bg-brand-purple text-white font-bold py-2 px-8 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!answers.smokingHabit || (step === 'goal' && !answers.vapingGoal) || (step === 'preference' && !answers.preference)}>
                      {step === 'preference' ? 'Obtener Recomendaciones' : 'Siguiente'}
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
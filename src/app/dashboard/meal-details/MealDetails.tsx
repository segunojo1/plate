'use client';

import React, { useEffect, useState } from 'react';
import gemini from '../../../http/gemini';
import { useSetupContext } from '../../../context/SetupContext';
import MainLayout from '@/components/Layout/MainLayout';
import MealHead from '@/modules/dashboard/meal-details/MealHead';
import { parseBoldText } from '@/app/helpers/parseBoldText';

const MealDetails = ({ breakfast }: { breakfast?: string }) => {
  const { userGoal, possibleDiseases } = useSetupContext();
  const query = `What are the health and my goals impact of this food ${decodeURIComponent(
    breakfast || ''
  )} on me my goal is ${userGoal} and my healthconditions are ${possibleDiseases}`;
  const [answer, setAnswer] = useState('');
  const q2 = `What are the ingredients used to make this food ${decodeURIComponent(breakfast || '')}`;
  const [answer1, setAnswer1] = useState('');

  useEffect(() => {
    if (breakfast) {
      makeRequest();
    }
  }, [breakfast]);

  const makeRequest = async () => {
    const { data } = await gemini.post('/gemini-pro:generateContent', {
      contents: [{ parts: [{ text: query }] }],
    });
    const ingredients = await gemini.post('/gemini-pro:generateContent', {
      contents: [{ parts: [{ text: q2 }] }],
    });
    setAnswer(data.candidates[0].content.parts[0].text);
    setAnswer1(ingredients.data.candidates[0].content.parts[0].text.replace(/\*/g, '\n'));
  };

  return (
    <MainLayout fixedTopbar={true}>
      <MealHead />
      <div className="flex md:flex-row flex-col gap-2 font-satoshi mt-6">
        <div className="bg-[#D6FBC4] p-4 rounded-2xl js-tilt mealreco">
          <div className="flex justify-between items-center mb-5">
            <p className="font-bold text-xs">Health and Goal Impact</p>
          </div>
          {answer ? (
            <div>
              {parseBoldText(answer).map((part, index) => (
                <React.Fragment key={index}>
                  {typeof part === 'string' ? part : <><br />{part}<br /></>}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="bg-[#B0D2C1] p-4 rounded-2xl js-tilt mealreco">
          <div className="flex justify-between items-center mb-5">
            <p className="font-bold text-xs">Ingredients</p>
          </div>
          {answer1 ? (
            <div>
              {parseBoldText(answer1).map((part, index) => (
                <React.Fragment key={index}>
                  {typeof part === 'string' ? part : <><br />{part}<br /></>}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MealDetails;

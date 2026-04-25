import { useEffect, useState } from 'react';
import type { PersonalInfo, Role, SkillsAvatar, StepId, WizardData } from '../types';
import { Stepper } from './Stepper';
import { Step1PersonalInfo } from './steps/Step1PersonalInfo';
import { Step2SkillsAvatar } from './steps/Step2SkillsAvatar';
import { Step3Review } from './steps/Step3Review';
import { Success } from './steps/Success';

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: '',
  email: '',
  role: '',
  department: '',
};

const INITIAL_SKILLS_AVATAR: SkillsAvatar = {
  avatar: null,
  skills: [],
};

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Skills & Avatar' },
  { id: 3, label: 'Review' },
];

export function Wizard() {
  const [step, setStep] = useState<StepId>(1);
  const [highestCompleted, setHighestCompleted] = useState(0);
  const [personal, setPersonal] = useState<PersonalInfo>(INITIAL_PERSONAL);
  const [skillsAvatar, setSkillsAvatar] = useState<SkillsAvatar>(INITIAL_SKILLS_AVATAR);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    return () => {
      if (skillsAvatar.avatar) URL.revokeObjectURL(skillsAvatar.avatar.previewUrl);
    };
  }, [skillsAvatar.avatar]);

  const updatePersonal = (next: PersonalInfo) => {
 
    if (next.role !== personal.role && skillsAvatar.skills.length > 0) {
      setSkillsAvatar((prev) => ({ ...prev, skills: [] }));
    }
    setPersonal(next);
  };

  const goToStep = (id: StepId) => {
    if (submitted) return;
    if (id <= Math.max(step, highestCompleted + 1)) {
      setStep(id);
    }
  };

  const advance = (from: StepId) => {
    setHighestCompleted((prev) => Math.max(prev, from));
    setStep((prev) => Math.min(3, (prev + 1)) as StepId);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const data: WizardData = { personal, skillsAvatar };

  if (submitted) {
    return (
      <div className="wizard wizard--terminal">
        <Success data={data} />
      </div>
    );
  }

  return (
    <div className="wizard">
      <Stepper
        current={step}
        highestCompleted={highestCompleted}
        steps={STEPS}
        onJump={goToStep}
      />
      <div className="wizard__panel">
        {step === 1 && (
          <Step1PersonalInfo
            value={personal}
            onChange={updatePersonal}
            onNext={() => advance(1)}
          />
        )}
        {step === 2 && (
          <Step2SkillsAvatar
            role={personal.role as Role}
            value={skillsAvatar}
            onChange={setSkillsAvatar}
            onNext={() => advance(2)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Review
            data={data}
            onBack={() => setStep(2)}
            onEdit={(target) => setStep(target)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

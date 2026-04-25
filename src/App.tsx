import { Wizard } from './components/Wizard';
import './App.css';

function App() {
  return (
    <main className="page">
      <header className="page__header">
        <p className="page__eyebrow">Glamer Media · Onboarding</p>
        <h1 className="page__title">Add a new team member</h1>
        <p className="page__subtitle">
          A short three-step wizard to capture the essentials.
        </p>
      </header>
      <Wizard />
    </main>
  );
}

export default App;

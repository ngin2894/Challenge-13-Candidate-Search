import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import CandidateDetails from '../interfaces/Candidate.interface';
import CandidateCard from '../components/CandidateCard';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<CandidateDetails[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const users = await searchGithub();

        const candidateInfo = await Promise.all(
          users.map(async (user: { login: string; id: number; avatar_url: string }) => {
            const userInfo = await searchGithubUser(user.login);

            return {
              login: user.login,
              avatar_url: user.avatar_url,
              name: userInfo.name || 'No name available',
              location: userInfo.location || 'No location available',
              email: userInfo.email || 'No email available',
              company: userInfo.company || 'No company available',
              html_url: userInfo.html_url || 'No html_url available',
              bio: userInfo.bio || 'No bio available',
            } as CandidateDetails;
          })
        );

        setCandidates(candidateInfo);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Could not load candidates:', err);
      }
    };

    loadCandidates();
  }, []);

  const handleAdd = () => {
    if (currentIndex < candidates.length) {
      const candidateToAdd = candidates[currentIndex];
      const stored = localStorage.getItem('savedCandidates');
      const savedCandidates = stored ? JSON.parse(stored) : [];
      savedCandidates.push(candidateToAdd);
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSkip = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleFetchMore = async () => {
    try {
      setCandidates([]);
      setCurrentIndex(0);
      const users = await searchGithub();

      const candidateInfo = await Promise.all(
        users.map(async (user: { login: string; id: number; avatar_url: string }) => {
          const userInfo = await searchGithubUser(user.login);
          return {
            login: user.login,
            avatar_url: user.avatar_url,
            name: userInfo.name || 'No name available',
            location: userInfo.location || 'No location available',
            email: userInfo.email || 'No email available',
            company: userInfo.company || 'No company available',
            html_url: userInfo.html_url || 'No html_url available',
            bio: userInfo.bio || 'No bio available',
          } as CandidateDetails;
        })
      );

      setCandidates(candidateInfo);
    } catch (err) {
      console.error('Could not fetch more candidates:', err);
    }
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      {currentIndex < candidates.length ? (
        <CandidateCard
          candidate={candidates[currentIndex]}
          onAdd={handleAdd}
          onSkip={handleSkip}
        />
      ) : (
        <div>
          <p>No more candidates.</p>
          <button onClick={handleFetchMore}>Fetch More Candidates</button>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;

import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<any | null>(null); // Store the current candidate
  const [savedCandidates, setSavedCandidates] = useState<any[]>([]); // Store saved candidates

  useEffect(() => {
    const loadCandidate = async () => {
      const result = await searchGithub();
      if (result.length > 0) {
        setCandidate(result[0]); // Set the first candidate from the response
      }
    };

    loadCandidate();
  }, []);

  // Handle saving a candidate
  const handleSaveCandidate = () => {
    if (candidate) {
      const updatedList = [...savedCandidates, candidate];
      setSavedCandidates(updatedList);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedList)); // Save to local storage
    }
    loadNextCandidate(); // Load next candidate after saving
  };

  // Handle skipping a candidate
  const handleSkipCandidate = () => {
    loadNextCandidate(); // Load next candidate without saving
  };

  // Load next candidate from the API
  const loadNextCandidate = async () => {
    const result = await searchGithub();
    if (result.length > 0) {
      setCandidate(result[0]);
    } else {
      setCandidate(null); // No more candidates
    }
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      {candidate ? (
        <div>
          <img src={candidate.avatar_url} alt={candidate.login} width="100" height="100" />
          <h2>{candidate.login}</h2>
          <p>{candidate.location}</p>
          <p>{candidate.email || 'No email available'}</p>
          <p>{candidate.company || 'No company available'}</p>
          <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
          <div>
            <button onClick={handleSaveCandidate}>Save</button>
            <button onClick={handleSkipCandidate}>Skip</button>
          </div>
        </div>
      ) : (
        <p>No more candidates available.</p>
      )}
    </div>
  );
};

export default CandidateSearch;
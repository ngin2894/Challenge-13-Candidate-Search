import react from 'react';
import CandidateDetails from '../interfaces/Candidate.interface';

interface CandidateCardProps {
    candidate: CandidateDetails;
    onAdd: () => void;
    onSkip: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onAdd, onSkip }) => {
    return (
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
                <button onClick={onAdd}>Save</button>
                <button onClick={onSkip}>Skip</button>
            </div>
        </div>
    );
};

export default CandidateCard;
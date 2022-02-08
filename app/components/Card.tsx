import { FC } from 'react';
import { Link } from 'remix';

interface CardProps {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonLocation: string;
}

export const Card: FC<CardProps> = ({
  title,
  subtitle,
  buttonLabel,
  buttonLocation,
}) => {
  return (
    <div className="card shadow-2xl lg:card-side bg-primary text-primary-content">
      <div className="card-body w-full">
        <h2 className="card-title">{title}</h2>
        <p>{subtitle}</p>
        <div className="justify-end card-actions">
          <Link to={buttonLocation} className="btn btn-primary float-right">
            {buttonLabel}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 ml-2 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

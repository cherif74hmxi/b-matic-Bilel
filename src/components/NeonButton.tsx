import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NeonButtonProps {
  children: ReactNode;
  to?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const NeonButton = ({ children, to, type = "button", onClick, className = "", disabled = false }: NeonButtonProps) => {
  // Même style que .btn-main (bouton plein marine) ; le nom est historique.
  const base = `btn-main min-h-[48px] ${className}`;

  if (to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base} disabled={disabled}>
      {children}
    </button>
  );
};

export default NeonButton;
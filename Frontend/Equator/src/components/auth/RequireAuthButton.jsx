import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function RequireAuthButton({
  children,
  onClick,
  message,
  className = "",
  style = {},
  as: Tag = "button",
  disabled = false,
  ...props
}) {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    onClick?.(e);
  };

  return (
    <>
      <Tag
        className={className}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Tag>
      {showModal && (
        <AuthModal message={message} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;

  username: string;
  role: string;
  email: string;

  onGoHome: () => void;

  onOpenPersonalDetails: () => void;
  onOpenChangePassword: () => void;

  onOpenUserManagement: () => void;

  onDeactivateAccount: () => void;
};

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,

  username,
  role,
  email,

  onGoHome,

  onOpenPersonalDetails,
  onOpenChangePassword,

  onOpenUserManagement,

  onDeactivateAccount,
}: Props) {
  if (!isOpen) return null;

  const protectedEmails = [
    "manager@test.com",
    "leader@test.com",
    "staff@test.com",
  ];

  const canDeactivate = !protectedEmails.includes((email ?? "").toLowerCase());

  return (
    <div className="sidebar">
      <div className="sidebar-button">
        <div className="return-button">
          <button onClick={onClose}>
            <div className="return-icon"></div>
          </button>
        </div>
      </div>

      <div className="top-sidebar">
        <h2>{username}</h2>

        <p>{role}</p>
      </div>

      <div className="sidebar-menu">
        <button
          onClick={() => {
            onGoHome();
            onClose();
          }}
        >
          Home
        </button>

        <button
          onClick={() => {
            onOpenPersonalDetails();
            onClose();
          }}
        >
          Personal Details
        </button>

        <button
          onClick={() => {
            onOpenChangePassword();
            onClose();
          }}
        >
          Change Password
        </button>

        {canDeactivate && (
          <button
            className="danger-button"
            onClick={() => {
              onDeactivateAccount();
              onClose();
            }}
          >
            Deactivate Account
          </button>
        )}

        {role === "MANAGER" && (
          <button
            onClick={() => {
              onOpenUserManagement();
              onClose();
            }}
          >
            User Management
          </button>
        )}
      </div>

      <div className="bottom-sidebar">
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

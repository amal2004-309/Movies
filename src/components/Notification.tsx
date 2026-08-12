import "./Notification.css";

type NotificationType = "success" | "error";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose?: () => void;
}

export function Notification({
  message,
  type = "success",
  onClose,
}: NotificationProps) {
  return (
    <div className={`notification notification--${type}`} role="status">
      <div className="notification__body">
        <strong className="notification__title">
          {type === "success" ? "Success" : "Error"}
        </strong>
        <p className="notification__message">{message}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          className="notification__close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

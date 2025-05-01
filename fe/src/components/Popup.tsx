import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";

type PopupStatus = "success" | "error" | "warning";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  status: PopupStatus;
  title: string;
  message: string;
  actionText?: string;
}

const statusConfig = {
  success: {
    icon: FaCheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/50",
  },
  error: {
    icon: FaExclamationCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/50",
  },
  warning: {
    icon: FaExclamationTriangle,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/50",
  },
};

export default function Popup({
  isOpen,
  onClose,
  onAction,
  status,
  title,
  message,
  actionText = "Continue",
}: PopupProps) {
  if (!isOpen) return null;

  const { icon: Icon, iconColor, bgColor, borderColor } = statusConfig[status];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className={`${bgColor} ${borderColor} p-4 rounded-full border mb-4`}>
            <Icon className={`${iconColor} text-4xl`} />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-center mb-6">{message}</p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            {onAction && (
              <button
                onClick={onAction}
                className={`px-4 py-2 ${
                  status === "success"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : status === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white rounded-lg transition-colors`}
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
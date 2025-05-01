import { FaCheckCircle } from "react-icons/fa";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  title: string;
  message: string;
  actionText?: string;
}

export default function SuccessPopup({
  isOpen,
  onClose,
  onAction,
  title,
  message,
  actionText = "Go to Login",
}: SuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
import { ConfirmationStatus } from "@shared/api";
import { Clock, UserCheck, UserX } from "lucide-react";

export const getConfirmationStatusColor = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return "text-green-600 bg-green-100";
    case ConfirmationStatus.REJECTED:
      return "text-red-600 bg-red-100";
    case ConfirmationStatus.PENDING:
    default:
      return "text-yellow-600 bg-yellow-100";
  }
};

export const getConfirmationIcon = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return <UserCheck className="w-4 h-4" />;
    case ConfirmationStatus.REJECTED:
      return <UserX className="w-4 h-4" />;
    case ConfirmationStatus.PENDING:
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getConfirmationLabel = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return 'Confirmed';
    case ConfirmationStatus.REJECTED:
      return 'Rejected';
    case ConfirmationStatus.PENDING:
    default:
      return 'Pending';
  }
};
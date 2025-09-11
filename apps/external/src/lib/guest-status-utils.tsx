import { CreateGuestDto } from "@shared/api";
import { Clock, UserCheck, UserX } from "lucide-react";

export const getConfirmationStatusColor = (status: CreateGuestDto.confirmationStatus) => {
  switch (status) {
    case CreateGuestDto.confirmationStatus.CONFIRMED:
      return "text-green-600 bg-green-100";
    case CreateGuestDto.confirmationStatus.REJECTED:
      return "text-red-600 bg-red-100";
    case CreateGuestDto.confirmationStatus.PENDING:
    default:
      return "text-yellow-600 bg-yellow-100";
  }
};

export const getConfirmationIcon = (status: CreateGuestDto.confirmationStatus) => {
  switch (status) {
    case CreateGuestDto.confirmationStatus.CONFIRMED:
      return <UserCheck className="w-4 h-4" />;
    case CreateGuestDto.confirmationStatus.REJECTED:
      return <UserX className="w-4 h-4" />;
    case CreateGuestDto.confirmationStatus.PENDING:
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getConfirmationLabel = (status: CreateGuestDto.confirmationStatus) => {
  switch (status) {
    case CreateGuestDto.confirmationStatus.CONFIRMED:
      return 'Confirmed';
    case CreateGuestDto.confirmationStatus.REJECTED:
      return 'Rejected';
    case CreateGuestDto.confirmationStatus.PENDING:
    default:
      return 'Pending';
  }
};
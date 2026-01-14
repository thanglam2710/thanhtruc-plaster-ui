import { USER_API_ENDPOINTS } from "@/constants/api/user";
import { useApiMutation } from "@/hooks/base/useApi";
import { CreateContactRequest } from "@/types/dashboard/contacts";

export const useCreateContactMutation = () => {
  return useApiMutation<any, CreateContactRequest>(
    USER_API_ENDPOINTS.CONTACTS.SUBMIT,
    false
  );
};
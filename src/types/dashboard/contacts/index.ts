import { ContactStatus, ContactType } from "../../enums";
import { SearchPaginationRequest } from "../search-params";

export interface ContactDTO {
  id: number;
  customerName: string;
  phone: string;
  email?: string;
  message?: string;
  
  productLink?: string;
  attachmentUrl?: string;
  
  contactType: ContactType;
  contactStatus: ContactStatus;
  adminNote?: string;
  
  createdTime?: string;
}

export interface CreateContactRequest {
  customerName: string;
  phone: string;
  email?: string;
  message?: string;
  productLink?: string;
  attachmentUrl?: string;
  contactType: ContactType;
}

export interface UpdateContactStatusRequest {
  id: number;
  contactStatus: ContactStatus;
  adminNote?: string;
}

export interface SearchContactRequest extends SearchPaginationRequest {
  contactType?: ContactType;
  contactStatus?: ContactStatus;
}